"use client";

import { useSession, signOut } from "next-auth/react";

export default function LogoutButton() {
    const { status, update } = useSession();
    
    async function handleLogout() {
        await signOut({ redirect: true });
        update();
    }

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <button type="button" onClick={handleLogout} className="text-slate-200 px-4 hover:animate-pulse hover:text-red-600">
            Logout
        </button>
    );
}
