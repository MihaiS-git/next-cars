"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

import MainHeader from "@/components/ui/main-header";
import MainFooter from "@/components/ui/main-footer";
import { store } from "@/app/store";
import { metadata } from '@/app/layout-server';
import "./globals.css";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <html lang="en">
                <head>
                    <title>{String(metadata.title) || "Next Cars"}</title>
                    <meta name="description" content={metadata.description ?? undefined} />
                </head>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <SessionProvider>
                        <MainHeader />
                        <main className="flex flex-col items-center py-16">
                            {children}
                        </main>
                        <MainFooter />
                    </SessionProvider>
                </body>
            </html>
        </Provider>
    );
}
