import api from "@/lib/axios";

export async function getSenders() {
  const response = await api.get("/senders");
  return response.data.data;
}