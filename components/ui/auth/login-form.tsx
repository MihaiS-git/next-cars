"use client";

import { authenticate } from "@/app/actions/auth/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "./google-login-button";
import Link from "next/link";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/account";
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const { data: session, status, update } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push(callbackUrl);
        }
    }, [status]);

    const handleFormSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const error = await authenticate(undefined, formData, "credentials");
        setErrorMessage(error ?? "Something went wrong.");
        if (!error) {
            await update();
        }
    };

    const handleGoogleLogin = async () => {
        setErrorMessage(null);
        const error = await authenticate(undefined, new FormData(), "google");
        setErrorMessage(error ?? "Something went wrong.");
        if (!error) {
            await update();
        }
    };

    return (
        <>
            <form
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-4 justify-between align-middle w-full p-4 md:p-8"
            >
                <p className="flex flex-row justify-between m-2">
                    <label htmlFor="email" className="w-3/12 md:w-2/12">
                        Email
                    </label>
                    <input
                        className="text-zinc-950 w-10/12 p-1 rounded-md"
                        type="email"
                        id="email"
                        name="email"
                        aria-describedby="email-error"
                        onBlur={() => setEmailTouched(true)}
                        onChange={() => setEmailTouched(true)}
                    />
                </p>
                <p className="flex flex-row justify-between m-2">
                    <label htmlFor="password" className="w-3/12 md:w-2/12">
                        Password
                    </label>
                    <input
                        className="text-zinc-950 w-10/12 p-1 rounded-md"
                        type="password"
                        id="password"
                        name="password"
                        aria-describedby="password-error"
                        onBlur={() => setPasswordTouched(true)}
                        onChange={() => setPasswordTouched(true)}
                    />
                </p>
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="mb-0 mt-4 mx-auto w-3/4 md:w-1/2"
                >
                    Login
                </Button>
                <Link
                    href="/auth/signup"
                    className="text-cyan-400 underline mx-auto cursor-pointer hover:animate-pulse"
                >
                    Create new account
                </Link>
                {(emailTouched || passwordTouched) &&
                    errorMessage === "Invalid credentials." && (
                        <div className="text-center">
                            <p className="text-red-600">{errorMessage}</p>
                        </div>
                    )}
            <hr className="my-4 h-0.5 bg-zinc-50 border-none"/>
            </form>
            <div className="mb-2 text-center w-full px-4 md:px-8" >
                <GoogleLoginButton onClick={handleGoogleLogin} />
            </div>
        </>
    );
}
