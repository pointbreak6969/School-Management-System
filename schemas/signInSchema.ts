import { z } from "zod";

export const signInSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6,{ message: 'Password must be at least 6 characters' }),
});
