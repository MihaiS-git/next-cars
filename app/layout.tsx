"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import MainHeader from "@/components/ui/main-header";
import MainFooter from "@/components/ui/main-footer";
import { metadata } from "@/app/layout-server";
import "./globals.css";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

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
        <html lang="en" className="min-w-screen min-h-screen top-0 left-0">
            <head>
                <title>{String(metadata.title) || "Next Cars"}</title>
                <meta
                    name="description"
                    content={metadata.description ?? undefined}
                />
                <meta
                    name="keywords"
                    content={
                        Array.isArray(metadata.keywords)
                            ? metadata.keywords.join(", ")
                            : metadata.keywords ?? undefined
                    }
                />
                <meta
                    name="author"
                    content={
                        Array.isArray(metadata.authors)
                            ? metadata.authors.join(", ")
                            : typeof metadata.authors === "string"
                            ? metadata.authors
                            : undefined
                    }
                />
                <meta
                    name="robots"
                    content={
                        typeof metadata.robots === "string"
                            ? metadata.robots
                            : undefined
                    }
                />
                <meta charSet="utf-8" />
                <meta name="language" content="en-US" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
            >
                <QueryClientProvider client={queryClient}>
                    <SessionProvider>
                        <MainHeader />
                        <main className="flex flex-col items-center py-16 w-full min-h-screen">
                            {children}
                        </main>
                        <MainFooter />
                    </SessionProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
