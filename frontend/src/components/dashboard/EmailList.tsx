import EmailRow from "./EmailRow";
import type { Email } from "@/types/Email";
import EmptyState from "../ui/EmptyState";

interface EmailListProps {
  emails: Email[];
  status: "PENDING" | "COMPLETED";
}

export default function EmailList({ emails , status }: EmailListProps) {

  if (emails.length === 0) {
    return (
      <EmptyState
        title={
          status === "PENDING" ? "No Scheduled Emails" : "No Sent Emails"
        }
        description={
          status === "PENDING"
            ? "Schedule your first email campaign."
            : "Sent emails will appear here."
        }
      />
    );
  }
  return (
    <>
      {emails.map((email) => (
        <EmailRow
          key={email.id}
          id={email.id}
          recipient={
            email.recipients.length === 1
              ? email.recipients[0].emailAddress
              : `${email.recipients[0].emailAddress} +${email.recipients.length - 1} more`
          }
          subject={email.subject}
          preview={email.body}
          status={email.status}
          scheduledTime={email.scheduledAt}
        />
      ))}
    </>
  );
}
