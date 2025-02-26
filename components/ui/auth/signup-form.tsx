"use client";

import { signup } from "@/app/actions/auth/actions";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupForm() {
    const initialState = { message: "", errors: {} };
    const [formState, formAction] = useActionState(signup, initialState);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (formState.redirectTo) {
            router.push(formState.redirectTo);
        }
    }, [formState.redirectTo]);

    return (
        <>
            <form
                action={formAction}
                className="flex flex-col gap-4 justify-between align-middle w-full p-4 md:p-8"
                noValidate
            >
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="email" className="w-3/12 xl:w-2/12">Email</label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-describedby="email-error"
                    />
                </p>
                <div id="email-error" className="text-center text-base text-red-600">
                    {formState.errors?.email &&
                        formState.errors?.email.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="password" className="w-3/12 xl:w-2/12">Password</label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        aria-describedby="password-error"
                    />
                </p>
                <div id="password-error" className="text-center text-base text-red-600">
                    {formState.errors?.password &&
                        formState.errors?.password.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <p className="flex flex-row justify-between mx-2">
                    <label htmlFor="confirmPassword" className="w-3/12 xl:w-2/12">Confirmation</label>
                    <input
                        className="text-zinc-950 w-8/12 sm:w-9/12 p-1 rounded-md"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e)=>{setConfirmPassword(e.target.value)}}
                        aria-describedby="confirmPassword-error"
                    />
                </p>
                <div id="confirmPassword-error" className="text-center text-base text-red-600">
                    {formState.errors?.confirmPassword &&
                        formState.errors?.confirmPassword.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                </div>
                <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="mb-2 mt-4 mx-auto w-3/4 sm:w-1/2"
                >
                    Signup
                </Button>
                <Link href="/auth/login" className="text-cyan-400 underline mx-auto mb-6 cursor-pointer hover:animate-pulse">
                    Login with existent account
                </Link>
                <div id="general-error" className="text-center text-base text-red-600">
                    {formState.message && <p>{formState.message}</p>}
                </div>
            </form>
        </>
    );
}
