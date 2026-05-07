import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import api, { formatApiError } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = loading, false = unauth, object = auth
  const [checking, setChecking] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("attouna_token");
    if (!token) {
      setUser(false);
      setChecking(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (e) {
      localStorage.removeItem("attouna_token");
      setUser(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("attouna_token", data.access_token);
      await loadMe();
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: formatApiError(e.response?.data?.detail, "Identifiants invalides"),
      };
    }
  }, [loadMe]);

  const logout = useCallback(() => {
    localStorage.removeItem("attouna_token");
    setUser(false);
  }, []);

  const value = useMemo(
    () => ({ user, checking, login, logout, refresh: loadMe }),
    [user, checking, login, logout, loadMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
