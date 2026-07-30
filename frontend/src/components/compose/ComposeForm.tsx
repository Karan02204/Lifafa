import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { CreateEmailInput } from "@/validators/emai.validator";

import { useSenders } from "@/hooks/useSenders";

import RichTextEditor from "./RichTextEditor";
import FormRow from "./FormRow";
import SelectField from "./SelectField";
import InputField from "./InputField";
import RecipientUpload from "./RecipientUpload";

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
            {...register("senderId", {
              valueAsNumber: true,
            })}
          >
            <option value="">Select Sender</option>

            {senders.map((sender) => (
              <option key={sender.id} value={sender.id}>
                {sender.email}
              </option>
            ))}
          </SelectField>
        </FormRow>

        {errors.senderId && (
          <p className="mt-1 text-sm text-red-500">{errors.senderId.message}</p>
        )}

        <FormRow label="To" className="border-b">
          <div className="flex border-none items-center gap-4">
            <InputField
              {...register("recipient")}
              className="flex-1"
              placeholder="recipient@example.com"
            />

            <RecipientUpload
              onFileSelect={(file) => {
                console.log(file);
              }}
            />
          </div>
        </FormRow>

        {errors.recipient && (
          <p className="mt-1 text-sm text-red-500">
            {errors.recipient.message}
          </p>
        )}

        <FormRow label="Subject" className="border-b">
          <InputField {...register("subject")} placeholder="Enter subject" />
        </FormRow>

        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}

        <div className="flex items-center border-gray-200 py-3 gap-3">
          <div className="flex items-center">
            <label className="mr-4 text-sm font-medium">
              Delay between 2 emails
            </label>

            <InputField
              type="number"
              defaultValue={5}
              className="w-24 rounded-md border border-gray-300 px-3 py-1.5"
            />
          </div>

          <div className="flex items-center">
            <label className="mr-4 text-sm font-medium">Hourly Limit</label>

            <InputField
              type="number"
              defaultValue={100}
              className="w-24 rounded-md border border-gray-300 px-3 py-1.5"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />

          {errors.body && (
            <p className="mt-2 text-sm text-red-500">{errors.body.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
