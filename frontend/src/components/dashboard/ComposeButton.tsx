interface ComposeButtonProps {
  onCompose: () => void;
}

export default function ComposeButton({ onCompose }: ComposeButtonProps) {
  return (
    <button
      className="
        w-full
        rounded-full
        border-2
        border-green-600
        py-2
        text-lg
        font-medium
        text-green-600
        transition
        hover:bg-green-50
      "
      onClick={onCompose}
    >
      Compose
    </button>
  );
}
