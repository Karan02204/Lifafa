import { Funnel, RotateCw, Search } from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex items-center gap-4 border-gray-200 px-8 py-4">
      <div className="relative max-w-200 flex-1">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          placeholder="Search"
          className="
            w-full
            rounded-full
            bg-gray-100
            py-2
            pl-11
            pr-4
            text-sm
            outline-none
          "
        />
      </div>

      <button className="text-gray-500">
        <Funnel size={18} />
      </button>

      <button className="text-gray-500">
        <RotateCw size={18} />
      </button>
    </header>
  );
}
