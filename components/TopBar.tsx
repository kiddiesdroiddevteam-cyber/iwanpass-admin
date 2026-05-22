"use client";

import { UserNav } from "./UserNav";

export function TopBar() {
  return (
    <div className="flex items-center justify-between bg-white border-b border-[#E4E7EC] px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">iwanpass Admin</h1>
      </div>
      <UserNav />
    </div>
  );
}
