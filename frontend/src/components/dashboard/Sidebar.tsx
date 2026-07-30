import Logo from "./Logo";
import UserCard from "./UserCard";
import ComposeButton from "./ComposeButton";
import SidebarNavigation from "./SidebarNavigation";

interface SidebarProps {
  activeTab: "PENDING" | "SENT";
  setActiveTab: React.Dispatch<React.SetStateAction<"PENDING" | "SENT">>;
  scheduledCount: number;
  sentCount: number;
  onCompose: () => void;
}



export default function Sidebar({ activeTab, setActiveTab , scheduledCount , sentCount , onCompose }: SidebarProps) {
  return (
    <aside className="flex h-screen flex-col border-r border-gray-200 bg-white px-3 py-6">
      <Logo />

      <div className="mt-5">
        <UserCard />
      </div>

      <div className="mt-4">
        <ComposeButton onCompose={onCompose} />
      </div>

      <div className="mt-8">
        <SidebarNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          scheduledCount={scheduledCount}
          sentCount={sentCount}
        />
      </div>
    </aside>
  );
}
