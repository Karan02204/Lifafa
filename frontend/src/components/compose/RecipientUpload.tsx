import { Upload } from "lucide-react";
import { useRef } from "react";

interface RecipientUploadProps {
  onFileSelect: (file: File) => void;
}

export default function RecipientUpload({
  onFileSelect,
}: RecipientUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);

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
