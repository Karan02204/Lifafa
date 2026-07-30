import axiosInstance from "@/lib/axios";
import type { CreateEmailInput } from "@/validators/emai.validator";

export async function createEmail(data: CreateEmailInput) {
  const response = await axiosInstance.post("/emails", data);
  return response.data;
}

export async function getEmails(status?: string) {
  const response = await axiosInstance.get("/emails", {
    params: status ? { status } : {},
  });

  return response.data.data;
}