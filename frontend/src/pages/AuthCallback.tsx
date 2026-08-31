import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../providers/AuthProviders";
import { useQueryClient } from "@tanstack/react-query";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      login(token);
      // Invalidate me so cookie + token both work
      queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate("/dashboard", { replace: true });
      return;
    }
    // No token in URL => maybe cookie already set, try to fetch me
    queryClient.invalidateQueries({ queryKey: ["me"] });
    // Give a tick for query to resolve, then decide
    const t = setTimeout(() => navigate("/dashboard", { replace: true }), 800);
    return () => clearTimeout(t);
  }, [params, login, navigate, queryClient]);

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
        <p className="text-sm text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
