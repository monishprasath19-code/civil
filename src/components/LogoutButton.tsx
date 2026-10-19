"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { logout } from "@/app/(auth)/actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
      title="Logout"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
