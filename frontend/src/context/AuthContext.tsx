import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authService, AuthUser } from "../services/auth.service";
import { socketService } from "../services/socket.service";
import { SocketContext } from "./SocketContext";
import { registerForPushNotifications } from "../services/notification.service";

// ── Context shape ──────────────────────────────────────────

interface AuthContextValue {
  user:      AuthUser | null;
  token:     string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login:     (email: string, password: string) => Promise<void>;
  register:  (data: { name: string; email: string; password: string; phone?: string; gender?: string; ministry?: string; requestedRole?: string }) => Promise<void>;
  logout:    () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [token,     setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const socketCtx = useContext(SocketContext);

  // ── Restore session on app start ───────────────────────
  useEffect(() => {
    const restore = async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          authService.getToken(),
          authService.getUser(),
        ]);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
          // Reconnect socket with saved token
          socketCtx?.connect(savedToken);
          // Register for push notifications on session restore
          registerForPushNotifications(savedToken).catch(err =>
            console.warn('[push] Registration failed:', err)
          );
        }
      } catch (err) {
        console.warn("[auth] session restore failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    await authService.saveSession(result.token, result.user);
    setToken(result.token);
    setUser(result.user);
    // Connect socket immediately after login
    socketCtx?.connect(result.token);
    // Register for push notifications
    registerForPushNotifications(result.token).catch(err =>
      console.warn('[push] Registration failed:', err)
    );
  }, [socketCtx]);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
    ministry?: string;
    requestedRole?: string;
  }) => {
    const result = await authService.register(data);
    await authService.saveSession(result.token, result.user);
    setToken(result.token);
    setUser(result.user);
    socketCtx?.connect(result.token);
    // Register for push notifications
    registerForPushNotifications(result.token).catch(err =>
      console.warn('[push] Registration failed:', err)
    );
  }, [socketCtx]);

  const logout = useCallback(async () => {
    await authService.clearSession();
    socketCtx?.disconnect();
    setToken(null);
    setUser(null);
  }, [socketCtx]);

  const updateUser = useCallback((updatedUser: AuthUser) => {
    setUser(updatedUser);
    authService.saveUser(updatedUser); // Save to storage
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};