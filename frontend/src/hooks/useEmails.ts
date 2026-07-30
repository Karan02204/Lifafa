import { useQuery } from "@tanstack/react-query";
import { getEmails } from "@/api/email";

export function useEmails(status?: string) {
  return useQuery({
    queryKey: ["emails", status],
    queryFn: () => getEmails(status),
  });
}


