// ── Payloads ─────────────────────────────────────────────

export interface ScripturePayload {
  reference: string;   // e.g. "Romans 8:28"
  text: string;        // e.g. "And we know that in all things..."
}

export interface AnnouncementPayload {
  id: string;
  title: string;
  body: string;
  postedBy: string;    // name of the person who posted
  postedAt: string;    // ISO timestamp
}

export interface ServicePayload {
  serviceId: string;
  title: string;       // e.g. "Sunday Morning Service"
  startedBy: string;   // name of pastor / admin who started
  startedAt?: string;  // ISO timestamp (on start)
  endedAt?: string;    // ISO timestamp (on end)
}

// ── Server → Client events ────────────────────────────────

export interface ServerToClientEvents {
  "service:start":        (payload: ServicePayload) => void;
  "service:end":          (payload: ServicePayload) => void;
  "scripture:update":     (payload: ScripturePayload) => void;
  "announcement:update":  (payload: AnnouncementPayload) => void;
}

// ── Client → Server events ────────────────────────────────

export interface ClientToServerEvents {
  "service:start":        (payload: ServicePayload) => void;
  "service:end":          (payload: ServicePayload) => void;
  "scripture:update":     (payload: ScripturePayload) => void;
  "announcement:update":  (payload: AnnouncementPayload) => void;
}

// ── Socket data (attached to each socket instance) ────────

export interface SocketData {
  userId: string;
  email: string;
  role: string;
  name?: string;
}