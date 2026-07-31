import { useEffect, useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import DatePicker from "react-datepicker";
import { CalendarDays } from "lucide-react";

import type { CreateEmailInput } from "@/validators/emai.validator";

import "react-datepicker/dist/react-datepicker.css";

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

  const [selectedDate, setSelectedDate] = useState<Date>(
    scheduledAt ? new Date(scheduledAt) : new Date(),
  );

  useEffect(() => {
    if (scheduledAt) {
      setSelectedDate(new Date(scheduledAt));
    }
  }, [scheduledAt]);

  const quickOptions = useMemo(() => {
    function tomorrowAt(hour: number) {
      const date = new Date();

      date.setDate(date.getDate() + 1);
      date.setHours(hour, 0, 0, 0);

      return date;
    }

    return [
      {
        label: "Tomorrow, 10:00 AM",
        value: tomorrowAt(10),
      },
      {
        label: "Tomorrow, 11:00 AM",
        value: tomorrowAt(11),
      },
      {
        label: "Tomorrow, 3:00 PM",
        value: tomorrowAt(15),
      },
    ];
  }, []);

  function handleDone() {
    setValue("scheduledAt", selectedDate, {
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

      <div className="p-5">
        <div className="border-b border-gray-200 pb-4">
          <label className="mb-2 block text-sm text-gray-500">
            Pick date & time
          </label>

          <div className="flex items-center justify-between">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              showTimeSelect
              timeIntervals={1}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full border-none bg-transparent text-sm outline-none"
            />

            <CalendarDays size={18} className="text-gray-500" />
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-gray-700">Tomorrow</p>

          <div className="space-y-1">
            {quickOptions.map((option) => {
              const selected =
                selectedDate.getTime() === option.value.getTime();

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSelectedDate(option.value)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition
                    ${
                      selected
                        ? "bg-green-50 font-medium text-green-700"
                        : "hover:bg-gray-100"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {errors.scheduledAt && (
          <p className="mt-3 text-sm text-red-500">
            {errors.scheduledAt.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-5 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDone}
          className="rounded-full border border-green-600 px-5 py-2 text-sm font-medium text-green-600 transition hover:bg-green-50"
        >
          Done
        </button>
      </div>
    </div>
  );
}
