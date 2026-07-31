import { Clock3 } from "lucide-react";
import type { EmailStatus } from "@/types/Email";
interface StatusBadgeProps {
  status: EmailStatus;
  time?: string;
}

export default function StatusBadge({ status, time }: StatusBadgeProps) {
  if (status === "PENDING") {
    return (
      <span
        className="
          inline-flex
          items-center
          rounded-full
          bg-orange-100
          px-2
          py-1
          gap-1
          text-xs
          font-medium
          text-orange-600
        "
      >
        <Clock3 size={12} /> {time}
      </span>
    );
  }

  if (status == "COMPLETED"){
    return (
      <span
        className="rounded-full
        bg-gray-100
        px-2
        py-1
        text-xs
        font-medium
        text-gray-600"
      >
        Sent
      </span>
    );
  }

  return (
    <span
      className="
      rounded-full
      bg-gray-100
      px-2
      py-1
      text-xs
      font-medium
      text-gray-600
    "
    >
      Failed
    </span>
  );
}
