'use server';

import { connectDB } from "@/lib/mongoDb";
import { updateUserSchema } from "@/lib/validators/user-zod";

export type State = {
    errors?: {
        email?: string[];
        name?: string[];
        address?: string[];
        phone?: string[];
        role?: string[];
        dob?: string[];
        drivingSince?: string[];
    };
    message?: string | null;
};

export async function updateUser(prevState: State, formData: FormData) {
    const email = formData.get('email');

    const validatedFields = updateUserSchema.safeParse({
        email: formData.get('email'),
        name: formData.get('name'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        dob: formData.get('dob') || undefined,
        drivingSince: formData.get('drivingSince') || undefined
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to update user. Some fields are missing or incorrect.'
        };
    }

    const { name, address, phone, role, dob, drivingSince } = validatedFields.data;

    try {
        const db = await connectDB();

        const existentUser = await db.collection('users').findOne({ email });

        if (existentUser) {
            const result = await db.collection('users').findOneAndUpdate(
                { email },
                {
                    $set: {
                        address,
                        dob: new Date(dob),
                        drivingSince: new Date(drivingSince),
                        name,
                        phone,
                        role,
                        updatedAt: new Date()
                    },
                },
                { returnDocument: "after" }
            );

            if (!result) return { message: 'User not found or update failed.' }

            return { message: 'User updated successfully.' };
        } else {
            const newUser = await db.collection('users').insertOne({
                email,
                address,
                dob: dob ? new Date(dob) : null,
                drivingSince: dob ? new Date(drivingSince) : null,
                name,
                phone,
                role,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return { message: 'User profile created successfully.' };
        }
    } catch (error: any) {
        return { message: `Database error: ${error.message}` };
    }
}