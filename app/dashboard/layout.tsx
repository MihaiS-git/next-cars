export const metadata = {
    title: 'Next Cars - Dashboard',
    description: 'Your Next Cars dashboard.',
    keywords: 'Next Cars, Book a Car, Book a Driver, Dashboard',
    author: 'Next Cars Team',
    robots: 'index, follow',
    charset: 'UTF-8',
};

export default function DashboardPageLayout({
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
