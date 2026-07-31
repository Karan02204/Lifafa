import EmailRow from "./EmailRow";
import type { Email } from "@/types/Email";

interface EmailListProps {
  emails: Email[];
}

export default function EmailList({ emails }: EmailListProps) {
  return (
    <>
      {emails.map((email) => (
        <EmailRow
          key={email.id}
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
