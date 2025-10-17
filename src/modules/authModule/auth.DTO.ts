import z from "zod";
import type { signupSchema } from "./auth.validation";

export type SignDto=z.infer<typeof signupSchema>