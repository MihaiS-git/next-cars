import MainNavigation from "@/app/MainNavigation";
import Hamburger from "@/app/Hamburger";
import Link from "next/link";

export default function MainHeader() {
    return (
        <>
            <header className="bg-zinc-800 flex flex-row justify-between fixed top-0 left-0 w-full border border-b-red-600 border-s-0 border-t-0 border-e-0 z-50">
                <h1 className="m-4 ms-8 lg:ms-16 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl hover:animate-pulse cursor-pointer">
                    <Link href="/">
                        <em>Next Cars</em>
                    </Link>
                </h1>
                <MainNavigation />
            </header>
            <Hamburger />
        </>
    );
}
