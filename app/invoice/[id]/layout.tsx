export const metadata = {
    title: 'Next Cars - Invoice',
    description: 'Your Next Cars booking invoice.',
    keywords: 'Next Cars, Book a Car, Book a Driver, Invoice',
    author: 'Next Cars Team',
    robots: 'index, follow',
    charset: 'UTF-8',
};

export default function InvoicePageLayout({ children }: { children: React.ReactNode }) { 
    return (
        <div className="bg-zinc-800 w-full md:w-11/12 lg:w-10/12 rounded-lg border border-red-600 mt-4 mx-auto pt-4 lg:px-16 lg:pt-16">
            {children}
        </div>
    );
}