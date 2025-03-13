import Link from "next/link";

export default function CloseButton({ target }: { target: string }) {
    return (
        <Link href={target}>
            <button
                type="button"
                className="bg-red-600 text-zinc-50 px-2 rounded-sm"
            >
                Close
            </button>
        </Link>
    );
}
