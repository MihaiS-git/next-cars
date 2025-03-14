"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import LogoutButton from "@/components/ui/auth/LogoutButton";
import { Button } from "../button";

export default function MainNavigation() {
    const { status } = useSession();

    return (
        <nav className="hidden lg:flex w-8/12 items-center text-xl me-4">
            <ul className="flex flex-row justify-end w-full text-zinc-50 text-lg">
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/cars">Cars</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/drivers">Drivers</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/booking">Booking</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/account">Account</Link>
                </li>
                <li className="px-4 my-auto hover:animate-pulse hover:text-red-600">
                    <Link href="/contact">Contact</Link>
                </li>
                {status === "authenticated" ? (
                    <li className="px-4 my-auto hover:animate-pulse">
                        <LogoutButton />
                    </li>
                ) : (
                    <li className="px-4 my-auto hover:animate-pulse">
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
