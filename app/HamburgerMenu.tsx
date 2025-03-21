import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

interface HamburgerMenuProps {
    handleClose: () => void;
}

export default function HamburgerMenu({ handleClose }: HamburgerMenuProps) {
    const { status } = useSession();
    
    if (status === "loading") return <p className="text-zinc-50">Loading...</p>;

    return (
        <ul className="flex flex-col justify-center space-y-2 mb-4 pt-8 text-center h-full sm:text-xl md:space-y-4">
            <li className="px-4 py-2 w-60">
                <Link href="/cars" onClick={handleClose}>Cars</Link>
            </li>
            <li className="px-4 py-2 w-60">
                <Link href="/drivers" onClick={handleClose}>Drivers</Link>
            </li>
            <li className="px-4 py-2 w-60">
                <Link href="/booking" onClick={handleClose}>Booking</Link>
            </li>
            <li className="px-4 py-2 w-60">
                <Link href="/account" onClick={handleClose}>Account</Link>
            </li>
            <li className="px-4 py-2 w-60">
                <Link href="/dashboard" onClick={handleClose}>Dashboard</Link>
            </li>
            <li className="px-4 py-2 w-60">
                <Link href="/contact" onClick={handleClose}>Contact</Link>
            </li>
            {status === "authenticated" ? (
                <li className="px-4 hover:animate-pulse hover:text-red-600">
                    <LogoutButton />
                </li>
            ) : (
                <li className="px-4 hover:animate-pulse text-zinc-50 hover:text-red-600">
                    <Link href="/auth/login" onClick={handleClose}>Login</Link>
                </li>
            )}
        </ul>
    );
}
