import { Suspense } from "react";

import LoginForm from "@/components/ui/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center bg-zinc-800 text-zinc-50 opacity-80 w-full md:w-10/12 lg:w-8/12 xl:w-6/12 2xl:w-4/12">
            <header>
                <h1 className="font-bold text-3xl mb-4 mt-8 text-red-600 ">
                    <em>Login Form</em>
                </h1>
            </header>
            <main className="w-full flex flex-col items-center justify-center overflow-y-auto">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </main>
        </div>
    );
}
