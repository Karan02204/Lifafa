import api from "@/lib/axios";
import type { User } from "@/types/user";

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get("/auth/me");
  if (!data.user) throw new Error("User not found");
  return data.user;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout").catch(() => {});
  localStorage.removeItem("token");
};
