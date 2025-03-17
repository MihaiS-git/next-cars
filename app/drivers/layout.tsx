export const metadata = {
    title: 'Next Cars - Drivers List',
    description: 'Browse the list of available drivers at Next Cars and book your favorite one.',
    keywords: 'Next Cars, Book a Car, Book a Driver, Available Drivers',
    authors: [{name: 'Next Cars Team'}],
    robots: 'index, follow',
    charset: 'UTF-8',
};

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
