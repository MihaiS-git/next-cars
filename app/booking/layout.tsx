export const metadata = {
    title: 'Next Cars - Book a Car',
    description: 'Book a car from Next Cars',
    keywords: 'Next Cars, Book, Book a Car, Book a Driver',
    author: 'Next Cars Team',
    robots: 'index, follow',
    charset: 'UTF-8',
};

export default function ContactPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col bg-zinc-800 text-red-600 w-full md:w-11/12 rounded-lg border border-red-600 mt-4">
            {children}
        </div>
    );
}
