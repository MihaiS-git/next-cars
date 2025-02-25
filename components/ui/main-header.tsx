import MainNavigation from "@/components/ui/navigation/main-navigation";
import Hamburger from "@/components/ui/navigation/hamburger";
import Link from "next/link";

interface MainHeaderProps {
    pageProps: any;
}

export default function MainHeader() {
    return (
        <header className="bg-zinc-800 opacity-80 flex flex-row justify-between absolute top-0 left-0 w-full">
            <h1 className="m-4 ms-8 lg:ms-16 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl hover:animate-pulse cursor-pointer">
                <Link href="/"><em>Next Cars</em></Link>
            </h1>
                <MainNavigation />
                <Hamburger />
        </header>
    );
}
