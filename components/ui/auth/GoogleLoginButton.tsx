import { Button } from "../button";

interface GoogleLoginButtonProps {
    onClick: () => void;
}

export default function GoogleLoginButton({ onClick }: GoogleLoginButtonProps) {
    return (
        <Button
            type="submit"
            variant="secondary"
            size="lg"
            className="w-3/4 md:w-1/2 mb-4 google-login-button"
            onClick={onClick}
        >
            Login with Google
        </Button>
    );
}
