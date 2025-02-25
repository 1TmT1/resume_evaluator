"use server";

import * as z from 'zod';
import bcryptjs from 'bcryptjs';
import { db } from '@/lib/db';
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from '../data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);
    
    if (!validateFields.success) return { error: 'Invalid Fields :-(' };

    const { email: originalEmail, password, name } = validateFields.data;
    const email = originalEmail.toLowerCase();

    const existingUser = await getUserByEmail(email);

    if (existingUser) return { error: 'User already exists' };

    const hashedPassword = await bcryptjs.hash(password, 12);
    try {
        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    } catch(err) {
        console.log(err);
        return { error: 'Failed creating the account, try again later.' };
    }

    const verificationToken = await generateVerificationToken(email);

    try {
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: 'Email Sent ;-)' };
    } catch {
        return { error: 'Error - Try again later.' };
    }
    
}