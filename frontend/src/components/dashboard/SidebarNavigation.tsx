import { Clock3, Send } from "lucide-react";

interface SidebarNavigationProps {
  activeTab: "PENDING" | "COMPLETED";
  setActiveTab: (tab: "PENDING" | "COMPLETED") => void;
  scheduledCount: number;
  sentCount: number;
}

export default function SidebarNavigation({activeTab,setActiveTab , scheduledCount, sentCount}: SidebarNavigationProps) {
  
  const items = [
    {
      label: "Scheduled",
      status: "PENDING" as const,
      icon: Clock3,
      count: scheduledCount,
    },
    {
      label: "Sent",
      status: "COMPLETED" as const,
      icon: Send,
      count: sentCount,
    },
  ];
  
  return (
    <>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
        Core
      </p>

      {items.map(({ label, status, icon: Icon, count }) => (
        <button
          key={status}
          onClick={() => setActiveTab(status)}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors ${
            activeTab === status
              ? "bg-green-50 text-green-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </div>

          <span className="text-sm text-gray-500">{count}</span>
        </button>
      ))}
    </>
  );
}
