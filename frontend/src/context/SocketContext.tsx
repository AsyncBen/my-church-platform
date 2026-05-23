import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { socketService } from "../services/socket.service";
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

  const cleanupRef = useRef<(() => void) | null>(null);

  const connect = useCallback((token: string) => {
    const socket = socketService.connect(token);

    // ── Connection state ───────────────────────────────────
    socket.on("connect",    () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // ── sync:state — fires immediately on connect ──────────
    socket.on("sync:state", (payload: SyncStatePayload) => {
      setServiceStatus(payload.serviceStatus);
      setCurrentService(payload.currentService);
      setCurrentScripture(payload.currentScripture);
    });

    // ── Live events ────────────────────────────────────────
    socket.on("service:start", (payload: ServicePayload) => {
      setServiceStatus("live");
      setCurrentService(payload);
    });

    socket.on("service:end", (payload: ServicePayload) => {
      setServiceStatus("idle");
      setCurrentService(payload);
    });

    socket.on("scripture:update", (payload: ScripturePayload) => {
      setCurrentScripture(payload);
    });

    socket.on("announcement:update", (payload: AnnouncementPayload) => {
      setAnnouncements((prev) => [payload, ...prev].slice(0, 50));
    });

    // Cleanup function
    cleanupRef.current = () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("sync:state");
      socket.off("service:start");
      socket.off("service:end");
      socket.off("scripture:update");
      socket.off("announcement:update");
    };
  }, []);

  const disconnect = useCallback(() => {
    cleanupRef.current?.();
    socketService.disconnect();
    setIsConnected(false);
    setServiceStatus("idle");
    setCurrentService(null);
    setCurrentScripture(null);
    setAnnouncements([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        serviceStatus,
        currentService,
        currentScripture,
        announcements,
        connect,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// ── Raw context export (for AuthContext to call connect) ───
export { SocketContext };