"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoutButton from "@/components/ui/auth/logout-button";

export default function MainNavigation() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p className="text-zinc-50">Loading...</p>;

    return (
        <nav className="hidden lg:flex w-8/12 items-center xl:text-xl">
            <ul className="flex flex-row justify-end w-full text-zinc-50 ">
                <li className="px-4 hover:animate-pulse hover:text-red-600">
                    <Link href="/">Cars</Link>
                </li>
                <li className="px-4 hover:animate-pulse hover:text-red-600">
                    <Link href="/">Drivers</Link>
                </li>
                <li className="px-4 hover:animate-pulse hover:text-red-600">
                    <Link href="/">Cart</Link>
                </li>
                <li className="px-4 hover:animate-pulse hover:text-red-600">
                    <Link href="/">Appointments</Link>
                </li>
                <li className="px-4 hover:animate-pulse hover:text-red-600">
                    <Link href="/">Account</Link>
                </li>
                <li className="px-4 hover:animate-pulse hover:text-red-600">
                    <Link href="/">Contact</Link>
                </li>
                {status === "authenticated" ? (
                    <li className="px-4 hover:animate-pulse hover:text-red-600">
                        <LogoutButton />
                    </li>
                ) : (
                    <li className="px-4 hover:animate-pulse hover:text-red-600">
                        <Link href="/auth/login">Login</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
