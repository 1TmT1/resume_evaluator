"use server";

import { ResetPasswordSchema } from "@/schemas";
import { getOauthAccount, getUserByEmail } from "../data/user";
import { sendResetPasswordEmail } from "@/lib/mail";
import { generateResetPasswordResetToken } from "@/lib/tokens";
import * as z from "zod";

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) return { error: "Invalid Email" };

    const { email } = validatedFields.data;

    const user = await getUserByEmail(email);

    if (!user) return { error: "Error Occurred" };

    const userOauthAccount = await getOauthAccount(user.id);

    if (userOauthAccount) return { error: "Already signed in with different method, try using the original one (Google, Github or LinkedIn)" };

    const resetPasswordToken = await generateResetPasswordResetToken(email);
    await sendResetPasswordEmail(resetPasswordToken.email, resetPasswordToken.token);

    return { success: "Reset mail sent!" };
}