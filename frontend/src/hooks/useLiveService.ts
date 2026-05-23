import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

/**
 * Clean hook for LiveServiceScreen.
 *
 * Usage:
 *   const { isLive, scripture, announcements, isConnected } = useLiveService();
 */
export const useLiveService = () => {
  const ctx = useContext(SocketContext);

  if (!ctx) throw new Error("useLiveService must be used inside SocketProvider");

  return {
    // Connection
    isConnected:   ctx.isConnected,

    // Service state
    isLive:        ctx.serviceStatus === "live",
    serviceStatus: ctx.serviceStatus,
    currentService: ctx.currentService,

    // Scripture — what's currently on screen
    scripture: ctx.currentScripture,

    // Announcements — latest first
    announcements: ctx.announcements,
    latestAnnouncement: ctx.announcements[0] ?? null,
  };
};