import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function GoogleLoginButton() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/account";

    return (
        <>
            <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-3/4 md:w-1/2 mb-4"
                onClick={() => signIn("google", { callbackUrl })}
            >
                Login with Google
            </Button>
        </>
    );
}
