import {z} from	'zod';
export const signUpSchema = z.object({
    email : z.string().email(),
    username: z.string().min(3),
    password: z.string().min(8),
})