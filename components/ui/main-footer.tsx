import Link from "next/link";

export default function MainFooter() {
    return (
        <footer className="bg-zinc-800 opacity-80 flex flex-row align-middle justify-center absolute bottom-0 left-0 w-full">
            <Link
                href="https://mihais-git.github.io/"
                className="text-zinc-50 my-4"
            >
                Mihai Suciu &copy; 2025
            </Link>
        </footer>
    );
}
