import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { apiFetch, setToken, clearToken, getToken, SessionExpiredError } from "./api";
import { registerForPush, unregisterPush } from "./notifications";
import { log } from "./log";

export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  emailVerified: boolean;
  emailNotificationsEnabled: boolean;
};

type SessionResponse = { user: User; token?: string };

type AuthState = {
  user: User | null;
  /** True until the stored token has been checked, so nothing flashes the wrong screen. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: { email: string; password: string; username: string; firstName: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Confirms the stored token still works and takes the rotated one.
   *
   * Called on every cold start, which is what keeps someone who opens the app
   * monthly from ever being logged out: the server reissues a fresh thirty-day
   * token each time rather than counting down from whenever they signed in.
   */
  const refresh = useCallback(async () => {
    const stored = await getToken();
    if (!stored) {
      log.info("auth.refresh.noToken");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetch<SessionResponse>("/api/auth/session");
      if (data.token) await setToken(data.token);
      log.info("auth.refresh.ok", { userId: data.user.id, rotated: !!data.token, emailVerified: data.user.emailVerified });
      setUser(data.user);
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        // The password was changed somewhere else, or the account is gone.
        log.warn("auth.refresh.revoked");
        await clearToken();
        setUser(null);
      } else {
        log.warn("auth.refresh.offline", { error: error as Error });
      }
      // Any other failure is almost certainly the network. Keeping the token
      // means someone opening the app on a train sees their cached inbox
      // instead of being thrown back to a login screen they can't complete.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // refresh awaits the keystore before it touches state, so the first
    // update lands in a later tick rather than cascading a render on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  // Registration is attempted whenever a user is present rather than only at
  // sign-in: FCM rotates registration tokens on its own schedule, and a token
  // nobody re-registered is a phone that has silently stopped being notified.
  useEffect(() => {
    if (user) void registerForPush();
  }, [user]);

  // Also refreshed whenever the app comes back to the foreground, not only on a
  // cold start. Things that change the account happen elsewhere — verifying an
  // email from the inbox, changing a password on the website — and an app that
  // only notices on relaunch shows people stale facts about themselves for as
  // long as it stays in memory.
  useEffect(() => {
    // Only a genuine background -> active transition counts. AppState reports
    // "active" once at launch too, which duplicated the mount refresh: every
    // cold start made two session calls, registered the device twice and
    // loaded the inbox twice.
    let previous: AppStateStatus = AppState.currentState;
    const subscription = AppState.addEventListener("change", (state) => {
      const returning = state === "active" && previous.match(/inactive|background/);
      previous = state;
      if (!returning) return;
      log.debug("app.foreground");
      void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ ok: true; token: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      anonymous: true,
    });
    await setToken(data.token);
    const session = await apiFetch<SessionResponse>("/api/auth/session");
    log.info("auth.signIn.ok", { userId: session.user.id });
    setUser(session.user);
  }, []);

  const signUp = useCallback(
    async (input: { email: string; password: string; username: string; firstName: string }) => {
      const data = await apiFetch<{ ok: true; token: string }>("/api/auth/signup", {
        method: "POST",
        body: input,
        anonymous: true,
      });
      await setToken(data.token);
      const session = await apiFetch<SessionResponse>("/api/auth/session");
      log.info("auth.signUp.ok", { userId: session.user.id });
      setUser(session.user);
    },
    []
  );

  const signOut = useCallback(async () => {
    // Unregistered before the token goes, since the call needs it — otherwise
    // the next person to use this phone is told who said yes to the last one.
    log.info("auth.signOut.start");
    await unregisterPush().catch(() => {});
    await clearToken();
    setUser(null);
    log.info("auth.signOut.done");
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refresh }),
    [user, loading, signIn, signUp, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
