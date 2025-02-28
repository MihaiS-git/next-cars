'use server';

import { signIn } from '@/auth';
import { AuthError } from "next-auth";
import { signUpSchema } from '@/lib/validators/auth-zod';
import { saltAndHashPassword } from '@/lib/util/password';
import { createNewUser, getUserByEmail } from '@/lib/queries/users-queries';

export async function authenticate(prevState: string | undefined, formData: FormData, provider: 'google' | 'credentials') {
    try {
        if (provider === 'google') {
            return await signIn('google');
        } else if (provider === 'credentials') {
            const res = await signIn('credentials', {
                redirect: false,
                email: formData.get('email'),
                password: formData.get('password')
            });
            if (res?.error) {
                return 'Invalid credentials.';
            }
        }
        return null;
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export type State = {
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
    message?: string | null;
};

export async function signup(prevState: State, formData: FormData) {
    try {
        const validatedFields = signUpSchema.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Failed to create new user. Some fields are missing or incorrect.'
            };
        }

        const { email, password } = validatedFields.data;

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return {
                errors: { email: ['Email already in use.'] },
                message: 'Failed to create new user. Email already exists.'
            };
        }

        const hashedPassword = await saltAndHashPassword(password);
        
        const newUser = await createNewUser(email, hashedPassword);
        
        const plainUser = newUser ? { id: newUser._id.toString(), email: newUser.email, } : null;

        return { user: plainUser, redirectTo: '/auth/login' };
    } catch (error) {
        console.error('Error during user creation:', error);
        return {
            errors: {},
            message: 'Failed to create new user due to an unexpected error.'
        };
    }
}