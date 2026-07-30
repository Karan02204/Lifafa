import { ArrowLeft, Paperclip, Clock3 } from "lucide-react";

interface ComposeHeaderProps {
  onClose: () => void;
  onSchedule: () => void;
  onSend: () => void;
}

export default function ComposeHeader({
  onClose,
  onSchedule,
  onSend,
}: ComposeHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 transition hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>

        <h1 className="text-base font-medium text-gray-900">
          Compose New Email
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md p-2 transition hover:bg-gray-100"
        >
          <Paperclip size={16} />
        </button>

        <button
          type="button"
          onClick={onSchedule}
          className="rounded-md p-2 transition hover:bg-gray-100"
        >
          <Clock3 size={16} />
        </button>

        <button
          type="button"
          onClick={onSend}
          className="
            rounded-full
            border
            border-green-500
            px-5
            py-1.5
            text-sm
            font-medium
            text-green-600
            transition
            hover:bg-green-50
          "
        >
          Send
        </button>
      </div>
    </header>
  );
}
