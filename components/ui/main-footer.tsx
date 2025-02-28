import Link from "next/link";

export default function MainFooter() {
    return (
        <footer className="bg-zinc-800 flex flex-row align-middle justify-center fixed bottom-0 left-0 w-full  border border-t-red-600 border-s-0 border-b-0 border-e-0">
            <Link
                href="https://mihais-git.github.io/"
                className="text-red-600 my-4"
            >
                Mihai Suciu &copy; 2025
            </Link>
        </footer>
    );
}
