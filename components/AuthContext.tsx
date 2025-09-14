"use client";
import { useEffect, useState, createContext, useContext } from "react";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USERS_KEY = "elixlifestyle_users";
const LOCAL_AUTH_KEY = "elixlifestyle_auth_user";

function getStoredUsers(): { email: string; password: string }[] {
  if (typeof window === "undefined") return [];
  const users = localStorage.getItem(LOCAL_USERS_KEY);
  return users ? JSON.parse(users) : [];
}

function setStoredUsers(users: { email: string; password: string }[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function setAuthUser(user: User | null) {
  if (user) {
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_AUTH_KEY);
  }
}

function getAuthUser(): User | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(LOCAL_AUTH_KEY);
  return user ? JSON.parse(user) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getAuthUser());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const authUser = { email };
      setUser(authUser);
      setAuthUser(authUser);
      return {};
    } else {
      return { error: "Invalid email or password." };
    }
  };

  const signup = async (email: string, password: string) => {
    let users = getStoredUsers();
    if (users.find((u) => u.email === email)) {
      return { error: "Email already exists." };
    }
    users.push({ email, password });
    setStoredUsers(users);
    const authUser = { email };
    setUser(authUser);
    setAuthUser(authUser);
    return {};
  };

  const logout = () => {
    setUser(null);
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
