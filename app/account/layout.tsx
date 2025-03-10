export const metadata = {
    title: 'Next Cars - Account Details',
    description: 'Manage your account data',
    keywords: 'Next Cars, Account, User Details, Manage Account',
    author: 'Next Cars Team',
    robots: 'index, follow',
    charset: 'UTF-8',
}

export default function CarsPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col bg-zinc-800 text-red-600 w-full sm:w-8/12 md:w-7/12 lg:w-6/12 xl:w-5/12 rounded-lg border border-red-600 mt-4 mx-auto">
            {children}
        </div>
    );
}
