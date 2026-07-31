import { Upload } from "lucide-react";
import { useRef } from "react";
import Papa from "papaparse";

interface RecipientUploadProps {
  onEmailsImported: (emails: string[]) => void;
}

const EMAIL_HEADERS = [
  "email",
  "email address",
  "recipient",
  "recipient email",
];

export default function RecipientUpload({
  onEmailsImported,
}: RecipientUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,

      complete: ({ data }) => {
        if (!data.length) return;

        const headers = Object.keys(data[0]);

        const emailKey = headers.find((header) =>
          EMAIL_HEADERS.includes(header.trim().toLowerCase()),
        );

        if (!emailKey) {
          alert("No email column found in the uploaded file.");
          return;
        }

        const emails = Array.from(
          new Set(
            data
              .map((row) => row[emailKey] ?? "")
              .map((email) => email.trim().toLowerCase())
              .filter(Boolean)
              .filter(isValidEmail),
          ),
        );

        onEmailsImported(emails);
      },

      error(error) {
        console.error(error);
        alert("Failed to parse CSV.");
      },
    });

    event.target.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt"
        hidden
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-green-600 transition hover:text-green-700"
      >
        <Upload size={16} />
        Upload List
      </button>
    </>
  );
}
