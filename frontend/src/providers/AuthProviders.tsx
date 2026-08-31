import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/auth";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUser,
    // Always try cookie-based auth; token presence is not required
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    // If we had a token but user fetch failed with 401, clear it
    if (token && !user && !isLoading) {
      // getCurrentUser will throw; isLoading false + no user means unauthed
      // Don't auto-clear here; let axios interceptor handle it
    }
  }, [user, token, isLoading]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    // Also hit backend to clear cookie + blacklist
    import("@/api/auth").then(({ logout: apiLogout }) => apiLogout().catch(() => {}));
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
