export const metadata = {
    title: 'Next Cars - Contact',
    description: 'Contact Next Cars for more information about our services and products',
    keywords: 'Next Cars, Book a Car, Next Cars Contact, Available Cars',
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
        <div className="flex flex-col bg-zinc-800 text-red-600 w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12 rounded-lg border border-red-600 mt-4">
            {children}
        </div>
    );
}
