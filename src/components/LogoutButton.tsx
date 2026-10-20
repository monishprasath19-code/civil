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
      className="p-2 text-zinc-400 hover:text-rose-400 rounded-full hover:bg-zinc-900 transition-colors disabled:opacity-50"
      title="Exit Atelier"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
