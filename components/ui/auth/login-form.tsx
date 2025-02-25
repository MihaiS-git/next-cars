"use client";

import { authenticate } from "@/app/actions/auth/actions";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "./google-login-button";
import Link from "next/link";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") || "/account";
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const { update } = useSession();

    const handleFormSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const error = await authenticate(undefined, formData, "credentials");
        setErrorMessage(error ?? null);
        if (!error) {
            await update();
            router.push(callbackUrl);
        }
    };

    const handleGoogleLogin = async () => {
        setErrorMessage(null);
        const error = await authenticate(undefined, new FormData(), "google");
        setErrorMessage(error ?? null);
        if (!error) {
            await update();
            router.push(callbackUrl);
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
                        className="text-zinc-950 w-10/12 p-1"
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
                        className="text-zinc-950 w-10/12 p-1"
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
                    className="mb-2 mt-4 mx-auto w-3/4 md:w-1/2"
                >
                    Login
                </Button>
                <Link
                    href="/auth/signup"
                    className="text-cyan-400 underline mx-auto mb-8 cursor-pointer hover:animate-pulse"
                >
                    Create new account
                </Link>
                {(emailTouched || passwordTouched) &&
                    errorMessage === "Invalid credentials." && (
                        <div className="text-center">
                            <p className="text-red-600">{errorMessage}</p>
                        </div>
                    )}
            </form>
            <div className="mb-2 mt-4 p-4 md:p-8 text-center w-full">
                <GoogleLoginButton onClick={handleGoogleLogin} />
            </div>
        </>
    );
}
