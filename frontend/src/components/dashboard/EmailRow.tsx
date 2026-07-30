import { Star } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { EmailStatus } from "@/types/Email";

interface EmailRowProps {
  recipient: string;
  subject: string;
  preview: string;
  status: EmailStatus;
  scheduledTime?: string;
}

export default function EmailRow({
  recipient,
  subject,
  preview,
  status,
  scheduledTime,
}: EmailRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-8 py-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="w-60 shrink-0 text-sm font-medium">To: {recipient}</div>

        <StatusBadge status={status} time={scheduledTime} />

        <div className="min-w-0 flex-1 text-sm">
          <span className="font-medium text-gray-900">{subject}</span>

          <span className="text-gray-400"> - {preview}</span>
        </div>
      </div>

      <button>
        <Star size={16} className="text-gray-300" />
      </button>
    </div>
  );
}
