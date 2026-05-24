import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_ROUTES } from "../constants";

export interface AuthUser {
  id:           string;
  name:         string;
  email:        string;
  phone?:       string;
  ministry?:    string;
  role:         string;
  requestedRole?: string;
  createdAt:    string;
}

export interface AuthResponse {
  user:  AuthUser;
  token: string;
}

const TOKEN_KEY = "auth_token";
const USER_KEY  = "auth_user";

// ── API calls ──────────────────────────────────────────────

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
    ministry?: string;
    requestedRole?: string;
  }): Promise<AuthResponse> {
    console.log("=== AUTH SERVICE DEBUG ===");
    console.log("data received:", JSON.stringify(data));
    console.log("body being sent:", JSON.stringify({ ...data }));

    const res = await fetch(API_ROUTES.auth.register, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Registration failed");
    return json.data as AuthResponse;
  },

  async login(data: {
    email:    string;
    password: string;
  }): Promise<AuthResponse> {
    const res = await fetch(API_ROUTES.auth.login, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Login failed");
    return json.data as AuthResponse;
  },

  async me(token: string): Promise<AuthUser> {
    const res = await fetch(API_ROUTES.auth.me, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch user");
    return json.data as AuthUser;
  },

  async getRoleAvailability(): Promise<{
    PASTOR: { taken: boolean };
    MEDIA: { taken: boolean };
    SECRETARY: { taken: boolean };
  }> {
    const res = await fetch(API_ROUTES.auth.roleAvailability, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Failed to fetch role availability");
    return json.data as {
      PASTOR: { taken: boolean };
      MEDIA: { taken: boolean };
      SECRETARY: { taken: boolean };
    };
  },

  // ── Token storage ────────────────────────────────────────

  async saveSession(token: string, user: AuthUser): Promise<void> {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_KEY, JSON.stringify(user)],
    ]);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async getUser(): Promise<AuthUser | null> {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },
};