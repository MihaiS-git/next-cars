export default function AuthPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-zinc-800 text-zinc-50 w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12 rounded-lg border border-red-600 mt-4">
            {children}
        </div>
    );
}
