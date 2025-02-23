"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "../data/user";
import { getVerificationTokenByToken } from "../data/verification-token";

export const emailVerification = async (token: string) => {
    try {
        console.log(token);
        const existingToken = await getVerificationTokenByToken(token);
        if (!existingToken) return { error: "Token doesn't exist" };

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) return { error: "Token has been expired" };

        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser) return { error: "Email doesn't exist" };

        if (existingUser.emailVerified) return { success: "Email has been verified already" };

        await db.user.update({
            where: { id: existingUser.id },
            data: {
                emailVerified: new Date(),
                email: existingToken.email,
            }
        });

        await db.verificationToken.delete({
            where: { id: existingToken.id },
        });

        return { success: "Account is active and ready! ==>" };
    } catch {
        return { error: "Error occurred..." };
    }
}