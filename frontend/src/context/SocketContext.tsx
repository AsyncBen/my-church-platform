import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { socketService } from "../services/socket.service";
import { API_URL } from "../constants";
import type {
  ScripturePayload,
  AnnouncementPayload,
  ServicePayload,
  SyncStatePayload,
} from "../services/socket.service";

// ── Context shape ──────────────────────────────────────────

interface SocketContextValue {
  isConnected:      boolean;
  serviceStatus:    "live" | "idle";
  currentService:   ServicePayload | null;
  currentScripture: ScripturePayload | null;
  announcements:    AnnouncementPayload[];
  connect:          (token: string) => void;
  connectedCount:   number;
  disconnect:       () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected,      setIsConnected]      = useState(false);
  const [serviceStatus,    setServiceStatus]    = useState<"live" | "idle">("idle");
  const [currentService,   setCurrentService]   = useState<ServicePayload | null>(null);
  const [currentScripture, setCurrentScripture] = useState<ScripturePayload | null>(null);
  const [announcements,    setAnnouncements]    = useState<AnnouncementPayload[]>([]);

  const [connectedCount, setConnectedCount] = useState(0); 

  const cleanupRef     = useRef<(() => void) | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── HTTP fallback: fetch current service state ─────────────────────────
  // Called on mount and whenever socket disconnects, so the UI never shows
  // a stale "idle" state if the socket is slow or temporarily drops.
  const fetchServiceState = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/service/status`);
      if (!res.ok) return;
      const data = await res.json();

      // Only apply if socket hasn't already given us a live state
      // (socket sync:state is authoritative when connected)
      setServiceStatus(data.isLive ? "live" : "idle");
      if (data.service)   setCurrentService(data.service);
      if (data.scripture) setCurrentScripture(data.scripture);
    } catch {
      // Silently ignore — socket will sync when it connects
    }
  }, []);

  // ── Polling: re-check every 30s as a safety net ────────────────────────
  // The socket handles real-time updates; this just catches missed events
  // (e.g. app was in background, socket briefly dropped).
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return; // already polling
    pollIntervalRef.current = setInterval(fetchServiceState, 30_000);
  }, [fetchServiceState]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Fetch immediately on mount as a cold-start safety net
  useEffect(() => {
    fetchServiceState();
    startPolling();
    return () => stopPolling();
  }, [fetchServiceState, startPolling, stopPolling]);

  const connect = useCallback((token: string) => {
    const socket = socketService.connect(token);

    // ── Connection state ───────────────────────────────────
    socket.on("connect", () => {
      setIsConnected(true);
      // Socket connected — fetch once immediately to sync any
      // state that arrived between mount and socket handshake
      fetchServiceState();
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      // Socket dropped — bump poll frequency to 10s until reconnect
      stopPolling();
      pollIntervalRef.current = setInterval(fetchServiceState, 10_000);
    });

    // ── sync:state — fires immediately on connect ──────────
    // This is the primary mechanism; HTTP fetch is just a fallback
    socket.on("sync:state", (payload: SyncStatePayload) => {
      setServiceStatus(payload.serviceStatus);
      setCurrentService(payload.currentService);
      setCurrentScripture(payload.currentScripture);
      setConnectedCount(payload.connectedCount ?? 0);
      // Socket is healthy — restore normal 30s poll interval
      stopPolling();
      startPolling();
    });

    // ── Live events ────────────────────────────────────────
    socket.on("service:start", (payload: ServicePayload) => {
      setServiceStatus("live");
      setCurrentService(payload);
    });

    socket.on("service:end", () => {
      setServiceStatus("idle");
      setCurrentService(null);
      setCurrentScripture(null);
    });

    socket.on("scripture:update", (payload: ScripturePayload) => {
      setCurrentScripture(payload);
    });

    socket.on("announcement:update", (payload: AnnouncementPayload) => {
      setAnnouncements((prev) => [payload, ...prev].slice(0, 50));
    });

    socket.on("connections:update", (count: number) => {
      setConnectedCount(count);
    });

    cleanupRef.current = () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sync:state");
      socket.off("service:start");
      socket.off("service:end");
      socket.off("scripture:update");
      socket.off("announcement:update");
      socket.off("connections:update");
    };
  }, [fetchServiceState, startPolling, stopPolling]);

  const disconnect = useCallback(() => {
    cleanupRef.current?.();
    stopPolling();
    socketService.disconnect();
    setIsConnected(false);
    setServiceStatus("idle");
    setCurrentService(null);
    setCurrentScripture(null);
    setAnnouncements([]);
    setConnectedCount(0);
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      stopPolling();
    };
  }, [stopPolling]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        serviceStatus,
        currentService,
        currentScripture,
        announcements,
        connectedCount,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext };