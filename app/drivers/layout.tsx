export default function DriversPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col bg-zinc-800 text-zinc-50 w-full md:w-11/12 rounded-lg border border-red-600 mt-4">
            {children}
        </div>
    );
}
