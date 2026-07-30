import { useQuery } from "@tanstack/react-query";
import { getSenders } from "@/api/sender";
import type { Sender } from "@/types/Sender";

export function useSenders() {
  return useQuery<Sender[]>({
    queryKey: ["senders"],
    queryFn: getSenders,
  });
}