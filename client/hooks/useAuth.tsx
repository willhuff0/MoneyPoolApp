import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored auth on startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed.user);
        }
      } catch (err) {
        console.error("Failed to restore auth", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Call backend to log in
  const login = async (email : string, password : string) => {
    const res = await fetch("https://YOUR_API_URL/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json(); // { user, token }

    setUser(data.user);

    await AsyncStorage.setItem("auth", JSON.stringify(data));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}