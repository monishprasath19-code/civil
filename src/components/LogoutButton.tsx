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
      className="p-2 text-[#78716c] hover:text-rose-600 rounded-full hover:bg-[#f0ede6] transition-colors disabled:opacity-50"
      title="Exit Atelier"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
