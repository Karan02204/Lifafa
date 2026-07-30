import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { CreateEmailInput } from "@/validators/emai.validator";

interface SchedulePopoverProps {
  form: UseFormReturn<CreateEmailInput>;
  onClose: () => void;
}

export default function SchedulePopover({
  form,
  onClose,
}: SchedulePopoverProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const scheduledAt = watch("scheduledAt");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!scheduledAt) return;

    const current = new Date(scheduledAt);

    setDate(current.toISOString().split("T")[0]);

    setTime(
      current.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
  }, [scheduledAt]);

  function handleDone() {
    if (!date || !time) return;

    const value = new Date(`${date}T${time}`);

    setValue("scheduledAt", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    onClose();
  }

  return (
    <div className="w-80 rounded-xl border border-gray-200 bg-white shadow-xl">
      <div className="border-b border-gray-200 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-900">Send Later</h3>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {errors.scheduledAt && (
          <p className="text-sm text-red-500">{errors.scheduledAt.message}</p>
        )}

        <div className="rounded-md bg-gray-50 p-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Scheduled For
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {scheduledAt
              ? new Date(scheduledAt).toLocaleString()
              : "Not Selected"}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDone}
          className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}
