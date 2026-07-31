import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useEmails } from "@/hooks/useEmails";
import EmailList from "@/components/dashboard/EmailList";
// import { useSenders } from "@/hooks/useSenders";
import { useState } from "react";
import ComposeModal from "@/components/compose/ComposeModal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "COMPLETED">("PENDING");
  const { data: emails = [], isLoading, isError } = useEmails(activeTab);

  const { data: scheduledEmails = [] } = useEmails("PENDING");

  const { data: sentEmails = [] } = useEmails("COMPLETED");

  // const { data: senders = [], isLoading: isSendersLoading } = useSenders();
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // console.log(senders);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-red-500">Failed to load emails.</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-[320px_1fr] bg-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scheduledCount={scheduledEmails.length}
        sentCount={sentEmails.length}
        onCompose={() => setIsComposeOpen(true)}
      />

      <main className="flex flex-col">
        <TopBar />

        <section className="flex-1 overflow-y-auto">
          <EmailList emails={emails ?? []} status={activeTab} />
        </section>
      </main>

      <ComposeModal
        open={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
}
