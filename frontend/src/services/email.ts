import axiosInstance from "@/lib/axios";

export async function getEmailById(id: number) {
  const response = await axiosInstance.get(`/emails/${id}`);
  return response.data.data;
}
