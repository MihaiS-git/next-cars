'use client';

import SignupForm from "@/app/auth/signup/SignupForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function SignupPage() {
    function handleClose() {
        redirect("/");
    }

    return (
        <div className="flex flex-col w-full ">
            <header>
                <h1 className="mb-4 mt-8 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl text-center">
                    <em>Signup form</em>
                </h1>
            </header>
            <main className="w-full flex items-center justify-center overflow-y-auto">
                <Suspense fallback={<div>Loading...</div>}>
                    <SignupForm />
                </Suspense>
            </main>
            <footer>
                <div className="mb-4 me-4 text-right">
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleClose}
                    >
                        <X />
                    </Button>
                </div>
            </footer>
        </div>
    );
}
