import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/AuthProviders";

export default function UserCard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarLetter = (
    user?.name?.charAt(0) ??
    user?.email?.charAt(0) ??
    "U"
  ).toUpperCase();

  return (
    <div className="relative">
      <div className="flex items-center justify-between rounded-xl bg-gray-100 p-4">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-semibold text-white">
              {avatarLetter}
            </div>
          )}

          <div>
            <p className="text-lg font-medium text-gray-900">{user?.name}</p>

            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-full p-1 transition hover:bg-gray-200"
        >
          <ChevronDown
            size={22}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
