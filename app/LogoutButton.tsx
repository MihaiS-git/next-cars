"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "../components/ui/button";

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
        <Button
            variant="destructive"
            size="lg"
            onClick={handleLogout}
            className="text-base"
        >
            Logout
        </Button>
    );
}
