import {
  useState,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

interface RecipientInputProps {
  recipients: string[];
  onChange: (recipients: string[]) => void;
}

const MAX_VISIBLE = 3;

export default function RecipientInput({
  recipients,
  onChange,
}: RecipientInputProps) {
  const [input, setInput] = useState("");
  const [expanded, setExpanded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addRecipient = (value?: string) => {
    const email = (value ?? input).trim().toLowerCase();

    if (!email) return;

    if (!isValidEmail(email)) {
      setInput("");
      return;
    }

    if (recipients.includes(email)) {
      setInput("");
      return;
    }

    onChange([...recipients, email]);
    setInput("");
  };

  const removeRecipient = (email: string) => {
    onChange(recipients.filter((recipient) => recipient !== email));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addRecipient();
    }

    if (e.key === "Backspace" && input === "" && recipients.length > 0) {
      removeRecipient(recipients[recipients.length - 1]);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text");

    const emails = pasted
      .split(/[\n,;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    const validEmails = emails.filter(isValidEmail);

    const uniqueEmails = validEmails.filter(
      (email) => !recipients.includes(email),
    );

    if (uniqueEmails.length > 0) {
      onChange([...recipients, ...uniqueEmails]);
    }
  };

  const visibleRecipients = expanded
    ? recipients
    : recipients.slice(0, MAX_VISIBLE);

  const hiddenCount = recipients.length - visibleRecipients.length;

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[40px] w-full flex-wrap items-center gap-2 cursor-text"
    >
      {visibleRecipients.map((recipient) => (
        <div
          key={recipient}
          className="group flex items-center gap-1 rounded-full border border-green-500 bg-green-50 px-2.5 py-0.5 text-xs text-green-700 transition-colors hover:bg-green-100"
        >
          <span>{recipient}</span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeRecipient(recipient);
            }}
            className="ml-1 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}

      {!expanded && hiddenCount > 0 && input === "" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          className="rounded-full border border-green-500 bg-green-50 px-2.5 py-0.5 text-xs text-green-700 hover:bg-green-100"
        >
          +{hiddenCount}
        </button>
      )}

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setExpanded(true)}
        onBlur={() => {
          addRecipient();
          setExpanded(false);
        }}
        placeholder={recipients.length === 0 ? "Enter recipient email..." : ""}
        className="min-w-[180px] flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </div>
  );
}
