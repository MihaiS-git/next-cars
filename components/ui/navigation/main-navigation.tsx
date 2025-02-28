"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import LogoutButton from "@/components/ui/auth/logout-button";
import { Button } from "../button";

export default function MainNavigation() {
    const { data: session, status } = useSession();

    return (
        <nav className="hidden lg:flex w-8/12 items-center text-xl me-4">
            <ul className="flex flex-row justify-end w-full text-zinc-50 text-lg">
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/cars">Cars</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/">Drivers</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/">Cart</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/">Appointments</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/account">Account</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/">Contact</Link>
                </li>
                {status === "authenticated" ? (
                    <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                        <LogoutButton />
                    </li>
                ) : (
                    <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-zinc-950 text-base"
                        >
                            <Link href="/auth/login">Login</Link>
                        </Button>
                    </li>
                )}
            </ul>
        </nav>
    );
}
