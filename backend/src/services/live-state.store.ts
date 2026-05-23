import { ScripturePayload, ServicePayload } from "../types/socket.types";

export interface LiveServiceState {
  isLive: boolean;
  serviceId: string | null;
  serviceTitle: string | null;
  startedBy: string | null;
  startedAt: string | null;
  currentScripture: ScripturePayload | null;
  lastUpdated: string;
}

const initialState: LiveServiceState = {
  isLive: false,
  serviceId: null,
  serviceTitle: null,
  startedBy: null,
  startedAt: null,
  currentScripture: null,
  lastUpdated: new Date().toISOString(),
};

// In-memory store — swap for Redis later without changing the interface
let state: LiveServiceState = { ...initialState };

export const liveState = {
  get(): LiveServiceState {
    return { ...state };
  },

  startService(payload: ServicePayload): LiveServiceState {
    state = {
      ...state,
      isLive: true,
      serviceId: payload.serviceId,
      serviceTitle: payload.title,
      startedBy: payload.startedBy ?? null,
      startedAt: payload.startedAt ?? new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    return this.get();
  },

  endService(payload: ServicePayload): LiveServiceState {
    state = {
      ...state,
      isLive: false,
      serviceId: payload.serviceId,
      lastUpdated: new Date().toISOString(),
    };
    return this.get();
  },

  updateScripture(payload: ScripturePayload): LiveServiceState {
    state = {
      ...state,
      currentScripture: payload,
      lastUpdated: new Date().toISOString(),
    };
    return this.get();
  },

  reset(): void {
    state = { ...initialState };
  },
};