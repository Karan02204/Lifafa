import type { ReactNode } from "react";
import clsx from "clsx";

interface FormRowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export default function FormRow({ label, children, className }: FormRowProps) {
  return (
    <div
      className={clsx(
        "flex flex-1 items-center border-gray-200 py-3",
        className,
      )}
    >
      <label className="w-24 shrink-0 text-sm font-medium">
        {label}
      </label>

      <div className="flex-1">{children}</div>
    </div>
  );
}
