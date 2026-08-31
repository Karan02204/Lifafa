import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmail } from "@/api/email";
import { toast } from "sonner";

export function useCreateEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmail,
    onSuccess: () => {
      toast.success("Email scheduled successfully");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.response?.data?.errors || err.message || "Failed to schedule email";
      toast.error(typeof msg === "string" ? msg : "Validation failed");
    },
  });
}
