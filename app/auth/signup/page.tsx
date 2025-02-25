import SignupForm from "@/components/ui/auth/signup-form";
import Link from "next/link";
import { Suspense } from "react";

export default function SignupPage() {
    return (
        <div className="flex flex-col items-center bg-zinc-800 text-zinc-50 opacity-80 w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12">
            <header>
                <h1 className="mb-4 mt-8 text-red-600 font-semibold text-2xl lg:font-bold lg:text-3xl">
                    <em>Signup form</em>
                </h1>
            </header>
            <main className="w-full flex items-center justify-center overflow-y-auto">
                <Suspense fallback={<div>Loading...</div>}>
                    <SignupForm />
                </Suspense>
            </main>
        </div>
    );
}
