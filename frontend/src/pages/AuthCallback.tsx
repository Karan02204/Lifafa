import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../providers/AuthProviders";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    login(token);

    navigate("/dashboard", { replace: true });
  }, [params, login, navigate]);

  return <div>Signing you in...</div>;
}
