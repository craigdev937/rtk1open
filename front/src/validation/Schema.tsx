import { z } from "zod";

export const RSchema = z.object({
    first: z.string().trim().min(3).max(120, {
        message: "First name must be 120 or Less!"
    }),
    last: z.string().trim().min(3).max(120, {
        message: "Last name must be 120 or Less!"
    }), 
    email: z.email().trim().min(3, {
        message: "Email is Required!"
    }),
    password: z.string().trim().min(6, {
        message: "Must be at least six characters!"
    }),
});

export type RType = z.infer<typeof RSchema>;

export const LSchema = z.object({
    email: z.email().trim().min(3, {
        message: "Email is Required!"
    }),
    password: z.string().trim().min(6, {
        message: "Must be at least six characters!"
    })
});

export type LType = z.infer<typeof LSchema>;



