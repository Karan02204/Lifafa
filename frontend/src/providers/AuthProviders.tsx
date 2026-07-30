import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/auth";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!user && token && !isLoading) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [user, token, isLoading]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    queryClient.invalidateQueries({
      queryKey: ["me"],
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);

    queryClient.removeQueries({
      queryKey: ["me"],
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
