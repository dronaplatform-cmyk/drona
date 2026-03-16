import { z } from 'zod';

export const registerSchema = z.object({
    fullname: z.string()
        .min(2, "Full name must be at least 2 characters."),
    email: z.string()
        .email("Invalid email address."),
    password: z.string()
        .min(8, "Password must be at least 8 characters."),
    role: z.enum(['PARENT', 'TUTOR'] as const),
    bio: z.string().optional(),
    experienceType: z.enum(['< 1 years', '2', '3', '4', 'more than 5', 'others']).optional(),
    experienceYears: z.coerce.number().optional(),
    subjects: z.array(z.string()).optional(),
    subjectsOthers: z.string().optional(),
    classesTaught: z.array(z.string()).optional(), // Changed to array for multiple selection
    adhaarId: z.string().optional(),
    location: z.string().optional(),
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits.")
        .max(15, "Phone number must be at most 15 digits."),
});

// Export the inferred TypeScript type for type safety across the app
export type RegisterInput = z.infer<typeof registerSchema>;