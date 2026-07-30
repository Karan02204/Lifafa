import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmail } from "@/api/email";

export function useCreateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmail,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["emails"],
      });
    },
  });
}
