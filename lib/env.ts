import { z } from 'zod';

const EnvSchema = z.object({
    VITE_SUPABASE_URL: z.string().url("Must be a valid URL").optional(),
    VITE_SUPABASE_ANON_KEY: z.string().min(10).optional(),
});

export function validateEnv() {
    try {
        EnvSchema.parse(import.meta.env);
    } catch (error) {
        console.warn('Environment variable validation warnings:', error);
    }
}
