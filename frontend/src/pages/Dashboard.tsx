import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { useEmails } from "@/hooks/useEmails";
import EmailList from "@/components/dashboard/EmailList";
import { useState } from "react";
import ComposeModal from "@/components/compose/ComposeModal";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "COMPLETED">("PENDING");
  const [page, setPage] = useState(1);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const { data, isLoading, isError } = useEmails(activeTab, page, 20);

  // Counts: use pagination.total rather than fetching twice
  const scheduledQuery = useEmails("PENDING", 1, 1);
  const sentQuery = useEmails("COMPLETED", 1, 1);

  const emails = data?.data ?? [];
  const pagination = data?.pagination;

  const scheduledCount = scheduledQuery.data?.pagination?.total ?? 0;
  const sentCount = sentQuery.data?.pagination?.total ?? 0;

  const handleTabChange = (tab: "PENDING" | "COMPLETED") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="grid min-h-screen grid-cols-[320px_1fr] bg-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        scheduledCount={scheduledCount}
        sentCount={sentCount}
        onCompose={() => setIsComposeOpen(true)}
      />

      <main className="flex flex-col">
        <TopBar />
        <section className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="grid place-items-center p-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
            </div>
          ) : isError ? (
            <div className="grid place-items-center p-12">
              <p className="text-red-500">Failed to load emails.</p>
            </div>
          ) : (
            <>
              <EmailList emails={emails} status={activeTab} />
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </span>
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <ComposeModal open={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
    </div>
  );
}


