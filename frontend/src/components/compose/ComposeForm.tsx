import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import type { CreateEmailInput } from "@/validators/emai.validator";
import { useSenders } from "@/hooks/useSenders";
import RichTextEditor from "./RichTextEditor";
import FormRow from "./FormRow";
import SelectField from "./SelectField";
import InputField from "./InputField";
import RecipientUpload from "./RecipientUpload";
import RecipientInput from "./RecipientInput";

interface ComposeFormProps {
  form: UseFormReturn<CreateEmailInput>;
}

export default function ComposeForm({ form }: ComposeFormProps) {
  const { data: senders = [] } = useSenders();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="mx-auto w-full max-w-[1000px] px-6 py-5">
      <div className="flex h-[calc(90vh-64px)] flex-col overflow-y-auto px-4 py-5">
        <FormRow label="From">
          <SelectField
            className="w-auto min-w-[230px] rounded-md bg-gray-100 px-3 py-2"
            {...register("senderId", { valueAsNumber: true })}
          >
            <option value="">Select Sender</option>
            {senders.map((sender) => (
              <option key={sender.id} value={sender.id}>
                {sender.email}
              </option>
            ))}
          </SelectField>
        </FormRow>
        {errors.senderId && <p className="mt-1 text-sm text-red-500">{errors.senderId.message}</p>}

        <FormRow label="To" className="border-b">
          <div className="flex flex-1 w-full items-center justify-between gap-4">
            <Controller
              control={control}
              name="recipients"
              render={({ field }) => <RecipientInput recipients={field.value ?? []} onChange={field.onChange} />}
            />
            <RecipientUpload
              onEmailsImported={(emails) => {
                const currentRecipients = form.getValues("recipients") ?? [];
                const merged = Array.from(new Set([...currentRecipients, ...emails]));
                form.setValue("recipients", merged, { shouldValidate: true, shouldDirty: true });
              }}
            />
          </div>
        </FormRow>
        {errors.recipients && <p className="mt-1 text-sm text-red-500">{errors.recipients.message}</p>}

        <FormRow label="Subject" className="border-b">
          <InputField {...register("subject")} placeholder="Enter subject" className="w-full" />
        </FormRow>
        {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}

        {/* Info banner - rate limiting is server-configured */}
        <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Rate limits (delay between emails & hourly cap) are configured server-side via{" "}
          <code>MIN_DELAY_BETWEEN_EMAILS</code> & <code>MAX_EMAILS_PER_HOUR</code>. Campaigns automatically reschedule if
          limits are hit.
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <Controller
            control={control}
            name="body"
            render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
          />
          {errors.body && <p className="mt-2 text-sm text-red-500">{errors.body.message}</p>}
        </div>
      </div>
    </div>
  );
}
