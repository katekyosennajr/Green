'use client';

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full mt-4 flex items-center gap-2 text-xs text-red-300 hover:text-red-200 px-4"
        >
            <LogOut className="w-4 h-4" />
            Sign Out
        </button>
    );
}
