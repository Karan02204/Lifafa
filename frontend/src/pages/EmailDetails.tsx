import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Star,
  Archive,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getEmailById } from "@/services/email";
import type { EmailRecipient } from "@/types/Email";
interface EmailAttachment {
  id: string | number;
  url: string;
  filename: string;
  size: string;
}

export default function EmailDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showRecipients, setShowRecipients] = useState(false);

  const {
    data: email,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["email", id],
    queryFn: () => getEmailById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading email...</p>
      </div>
    );
  }

  if (isError || !email) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p>Unable to load email.</p>

        <button
          onClick={() => navigate(-1)}
          className="rounded-md bg-green-600 px-5 py-2 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const senderName = email.sender.name || email.sender.email;

  const formattedDate = new Date(
    email.sentAt ?? email.scheduledAt,
  ).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const attachments: EmailAttachment[] =
    (email as unknown as { attachments?: EmailAttachment[] }).attachments ??
    [];

  return (
    <div className="min-h-screen bg-white py-8">
      {/* HEADER */}

      <div className="flex items-center gap-4 px-8 pb-5">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-2 transition hover:bg-gray-100"
        >
          <ArrowLeft size={22} />
        </button>

        <h1 className="flex-1 text-3xl font-normal text-gray-900">
          {email.subject}
        </h1>

        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
            <Star size={20} />
          </button>

          <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
            <Archive size={20} />
          </button>

          <button className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
            <Trash2 size={20} />
          </button>
        </div>

        <div className="mx-2 h-6 w-px bg-gray-200" />

        <img
          src={
            (email as unknown as { viewerAvatarUrl?: string })
              .viewerAvatarUrl || "https://i.pravatar.cc/64"
          }
          alt="Account"
          className="h-9 w-9 rounded-full object-cover"
        />
      </div>
      <div className="mx-auto max-w-5xl">

        {/* SENDER */}

        <div className="mt-8 flex items-start justify-between px-8">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-semibold text-white">
              {senderName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-900">
                  {senderName}
                </span>

                <span className="text-sm text-gray-500">
                  &lt;{email.sender.email}&gt;
                </span>
              </div>

              <button
                onClick={() => setShowRecipients(!showRecipients)}
                className="mt-1 flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-700"
              >
                to {email.recipients.length === 1 ? "me" : "recipients"}
                {showRecipients ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
          </div>

          <p className="whitespace-nowrap text-sm text-gray-500">
            {formattedDate}
          </p>
        </div>

        {showRecipients && (
          <div className="ml-[64px] mt-2 space-y-1 px-8">
            {email.recipients.map((recipient: EmailRecipient) => (
              <div
                key={recipient.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">
                  {recipient.emailAddress}
                </span>
                <span className="text-xs text-gray-400">
                  {recipient.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* EMAIL BODY */}

        <div className="mt-10 ml-16 px-8">
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: email.body,
            }}
          />
        </div>

        {/* ATTACHMENTS */}

        {attachments.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4 px-8">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="w-[180px] overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={attachment.url}
                  alt={attachment.filename}
                  className="h-[130px] w-full object-cover"
                />

                <div className="px-3 py-2">
                  <p className="truncate text-sm text-gray-900">
                    {attachment.filename}
                  </p>
                  <p className="text-xs text-gray-500">{attachment.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
