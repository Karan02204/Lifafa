import { useQuery } from "@tanstack/react-query";
import { getEmailsPaginated } from "@/api/email";

export function useEmails(status?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["emails", status, page, limit],
    queryFn: () => getEmailsPaginated({ status, page, limit }),
  });
}
