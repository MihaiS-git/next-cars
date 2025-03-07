import { object, z } from 'zod';

export const updateUserSchema = object({
    name: z.string({ required_error: "Name is required." })
        .min(1, "Name must be at least 1 character long."),
    address: z.string({ required_error: "Address is required." })
        .min(1, "Address must be valid."),
    phone: z.string({ required_error: "Phone is required." })
        .min(10, "Phone must be at least 10 digits."),
    dob: z.string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format for dob.')
        .transform((val) => new Date(val))
        .refine((date) => date <= new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old.'),
    drivingSince: z.string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format for drivingSince.')
        .transform((val) => new Date(val))
        .refine((date) => date <= new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), 'You must have driving experience of at least 2 years.')
});