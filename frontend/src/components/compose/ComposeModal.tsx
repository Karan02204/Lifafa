import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ComposeHeader from "./ComposeHeader";
import ComposeForm from "./ComposeForm";
import SchedulePopover from "./SchedulePopover";

import { useCreateEmail } from "@/hooks/useCreateEmail";

import {
  createEmailSchema,
  type CreateEmailInput,
} from "@/validators/emai.validator";

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ComposeModal({ open, onClose }: ComposeModalProps) {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const createEmailMutation = useCreateEmail();

  const form = useForm<CreateEmailInput>({
    resolver: zodResolver(createEmailSchema),
    defaultValues: {
      senderId: 0,
      recipient: "",
      subject: "",
      body: "",
      scheduledAt: new Date(Date.now() + 60 * 1000),
    },
  });

  async function onSubmit(data: CreateEmailInput) {
    await createEmailMutation.mutateAsync(data);

    form.reset({
      senderId: 0,
      recipient: "",
      subject: "",
      body: "",
      scheduledAt: new Date(Date.now() + 60 * 1000),
    });

    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative h-[90vh] w-[90vw] overflow-hidden rounded-xl bg-white shadow-2xl">
        <ComposeHeader
          onClose={onClose}
          onSchedule={() => setScheduleOpen((prev) => !prev)}
          onSend={form.handleSubmit(onSubmit)}
        />

        <ComposeForm form={form} />

        {scheduleOpen && (
          <div className="absolute right-6 top-16 z-20">
            <SchedulePopover
              form={form}
              onClose={() => setScheduleOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
