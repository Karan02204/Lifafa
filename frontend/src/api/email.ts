import api from "@/lib/axios";
import type { CreateEmailInput } from "@/validators/emai.validator";

export async function createEmail(data: CreateEmailInput) {
  const response = await api.post("/emails", data);
  return response.data;
}

export async function getEmails(params?: { status?: string; page?: number; limit?: number; search?: string }) {
  const response = await api.get("/emails", { params });
  // Backend returns { success, data, pagination } — support both shapes
  if (Array.isArray(response.data.data)) return response.data.data;
  return response.data.data ?? response.data;
}

export async function getEmailsPaginated(params?: { status?: string; page?: number; limit?: number; search?: string }) {
  const response = await api.get("/emails", { params });
  return response.data as { success: boolean; data: any[]; pagination?: { page: number; limit: number; total: number; totalPages: number } };
}

export async function deleteEmail(id: number) {
  const response = await api.delete(`/emails/${id}`);
  return response.data;
}
