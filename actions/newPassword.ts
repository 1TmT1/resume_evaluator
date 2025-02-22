"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getResetPasswordTokenByToken } from "../data/reset-password-token";
import { getUserByEmail } from "../data/user";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
    try {
        if (!token) return { error: "Missing Token" };

        const validatedFields = NewPasswordSchema.safeParse(values);

        if (!validatedFields.success) return { error: "Invalid fields" };

        const { password } = validatedFields.data;

        const existingToken = await getResetPasswordTokenByToken(token);

        if (!existingToken) return { error: "Invalid Token" };

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) return { error: "Token Expired" };

        const user = await getUserByEmail(existingToken.email);

        if (!user) return { error: "Error Occurred" };

        const hashedPassword = await bcryptjs.hash(password, 12);

        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword
            },
        });

        await db.resetPasswordToken.delete({
            where: { id: existingToken.id }
        });

        return { success: "Password Updated" };
    } catch {
        return { error: "Error Occurred" };
    }
}