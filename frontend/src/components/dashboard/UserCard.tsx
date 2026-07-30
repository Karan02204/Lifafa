import { ChevronDown } from "lucide-react";

export default function UserCard() {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-100 p-4">
      <div className="flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100"
          alt="User"
          className="h-10 w-10 rounded-full object-cover"
        />

        <div>
          <p className="text-lg font-medium text-gray-900">Oliver Brown</p>

          <p className="text-xs text-gray-500">oliver.brown@domain.io</p>
        </div>
      </div>

      <ChevronDown size={25} strokeWidth="1" className="text-gray-500" />
    </div>
  );
}
