export interface ScripturePayload {
  reference: string;
  text:      string;
}

export interface AnnouncementPayload {
  id:       string;
  title:    string;
  body:     string;
  postedBy: string;
  postedAt: string;
}

export interface ServicePayload {
  serviceId:  string;
  title:      string;
  startedBy?: string;
  startedAt?: string;
  endedAt?:   string;
}

export interface SyncStatePayload {
  currentService:  ServicePayload | null;
  currentScripture: ScripturePayload | null;
  serviceStatus:   "live" | "idle";
}

// ── Server → Client ────────────────────────────────────────
export interface ServerToClientEvents {
  "service:start":       (payload: ServicePayload) => void;
  "service:end":         (payload: ServicePayload) => void;
  "scripture:update":    (payload: ScripturePayload) => void;
  "announcement:update": (payload: AnnouncementPayload) => void;
  "sync:state":          (payload: SyncStatePayload) => void;
}

// ── Client → Server ────────────────────────────────────────
export interface ClientToServerEvents {
  "service:start":       (payload: ServicePayload) => void;
  "service:end":         (payload: ServicePayload) => void;
  "scripture:update":    (payload: ScripturePayload) => void;
  "announcement:update": (payload: AnnouncementPayload) => void;
}

// ── Per-socket data ────────────────────────────────────────
export interface SocketData {
  userId: string;
  email:  string;
  role:   string;
}