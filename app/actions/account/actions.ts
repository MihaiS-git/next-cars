'use server';

import { connectDB } from "@/lib/mongoDb";
import { updateUserSchema } from "@/lib/validators/user-zod";

export type State = {
    errors?: {
        name?: string[];
        address?: string[];
        phone?: string[];
        dob?: string[];
        drivingSince?: string[];
    };
    message?: string | null;
};

export async function updateUser(prevState: State, formData: FormData) {
    const email = formData.get('email') as string | null;
    const role = formData.get('role') as string | null;

    const validatedFields = updateUserSchema.safeParse({
        name: formData.get('name'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        dob: formData.get('dob') || undefined,
        drivingSince: formData.get('drivingSince') || undefined
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to update user. Some fields are missing or incorrect.'
        };
    }

    const { name, address, phone, dob, drivingSince } = validatedFields.data;

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
                        bookings: [],
                        updatedAt: new Date(),
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
                role: "CUSTOMER",
                pictureUrl: '',
                bookings: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });

            if (newUser.insertedId) {
                return { message: 'User profile created successfully.' };
            } else {
                return {message: 'Failed to create user profile.'}
            }

        }
    } catch (error: any) {
        return { message: `Database error: ${error.message}` };
    }
}