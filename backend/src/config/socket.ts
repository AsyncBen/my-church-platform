import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../sockets/socket.auth";
import { registerServiceEvents } from "../sockets/service.events";
import { registerScriptureEvents } from "../sockets/scripture.events";
import { registerAnnouncementEvents } from "../sockets/announcement.events";
import { registerMinistryEvents } from "../sockets/ministry.events";
import { liveState } from "../services/live-state.store";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  SocketData,
} from "../types/socket.types";

// Define device regions (can be moved to a config file)
const DEVICE_REGIONS = [
  { name: 'Main Sanctuary', role: 'MAIN_HALL' },
  { name: 'Youth Hall', role: 'YOUTH_HALL' },
  { name: 'Overflow Room', role: 'OVERFLOW' },
  { name: 'Online Viewers', role: 'ONLINE' },
];

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>(
    httpServer,
    {
      cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    }
  );

  // ── Helper to broadcast connected count to leadership rooms ──
  const broadcastConnectedCount = () => {
    const count = io.engine.clientsCount;
    io.to("role:ADMIN")
      .to("role:MEDIA")
      .to("role:PASTOR")
      .to("role:SECRETARY")
      .emit("connected:count", { count });
  };

  // ── Helper to calculate and broadcast sync health ──
  const broadcastSyncHealth = async () => {
    try {
      const sockets = await io.fetchSockets();
      const totalDevices = sockets.length;
      
      // Count synced devices (devices that have acknowledged the latest scripture/state)
      const syncedDevices = sockets.filter(s => s.data.synced === true).length;
      
      // Calculate overall health percentage
      const health = totalDevices > 0 ? Math.round((syncedDevices / totalDevices) * 100) : 0;

      // Calculate per-region stats
      const regions = DEVICE_REGIONS.map(region => {
        const regionSockets = sockets.filter(s => {
          // Check if socket belongs to this region
          // You can customize this logic based on your socket data structure
          return s.data.region === region.role || 
                 (region.role === 'ONLINE' && s.data.connectionType === 'remote');
        });
        
        const regionTotal = regionSockets.length;
        const regionSynced = regionSockets.filter(s => s.data.synced === true).length;
        
        // Determine status based on sync percentage
        let status: 'healthy' | 'warning' | 'error' = 'healthy';
        if (regionTotal === 0) {
          status = 'healthy'; // No devices is not an error
        } else {
          const regionHealth = (regionSynced / regionTotal) * 100;
          if (regionHealth >= 90) status = 'healthy';
          else if (regionHealth >= 70) status = 'warning';
          else status = 'error';
        }

        return {
          name: region.name,
          devices: regionTotal,
          synced: regionSynced,
          status,
        };
      });

      // Emit to leadership rooms
      io.to("role:ADMIN")
        .to("role:MEDIA")
        .to("role:PASTOR")
        .to("role:SECRETARY")
        .emit("sync:health", { health, regions });

    } catch (error) {
      console.error('[socket] Error broadcasting sync health:', error);
    }
  };

  // ── Auth middleware ────────────────────────────────────
  io.use(socketAuthMiddleware);

  // ── Connection handler ─────────────────────────────────
  io.on("connection", (socket) => {
    const { userId, email, role } = socket.data;

    // Centralized connection log (only place we log connections)
    console.log(`[socket] + connected   ${email} (${role}) [${socket.id}]`);

    // Initialize sync status
    socket.data.synced = false;
    
    // Store connection type and region (you can set these from client handshake)
    if (!socket.data.region) {
      socket.data.region = 'ONLINE'; // Default for web clients
      socket.data.connectionType = 'remote';
    }

    // Join role room + personal room
    socket.join(`role:${role}`);
    socket.join(`user:${userId}`);

    // ── Broadcast updated connected count and sync health ──
    broadcastConnectedCount();
    broadcastSyncHealth();

    // ── sync:state — send current service state immediately ──
    // Critical for late joiners, WiFi drops, app restarts
    const state = liveState.get();
    socket.emit("sync:state", {
      currentService: state.isLive
        ? {
            serviceId:  state.serviceId!,
            title:      state.serviceTitle!,
            startedBy:  state.startedBy!,
            startedAt:  state.startedAt!,
          }
        : null,
      currentScripture: state.currentScripture,
      serviceStatus: state.isLive ? "live" : "idle",
    });

    console.log(`[socket] sync:state sent to ${email} — service ${state.isLive ? "LIVE" : "idle"}`);

    // ── Listen for sync acknowledgements from clients ──
    socket.on("sync:acknowledged", () => {
      socket.data.synced = true;
      broadcastSyncHealth(); // Update sync health when a device acknowledges
    });

    // ── Register event groups ──────────────────────────────
    registerServiceEvents(io, socket);
    registerScriptureEvents(io, socket);
    registerAnnouncementEvents(io, socket);
    registerMinistryEvents(io, socket);

    // ── Disconnect ─────────────────────────────────────────
    socket.on("disconnect", (reason) => {
      console.log(`[socket] - disconnected ${email} (${role}) — ${reason}`);
      broadcastConnectedCount();
      broadcastSyncHealth();
    });
  });

  // ── Periodic sync health broadcast ──────────────────────
  // Broadcast sync health every 10 seconds to keep admin dashboards updated
  setInterval(() => {
    broadcastSyncHealth();
  }, 10000);

  return io;
};