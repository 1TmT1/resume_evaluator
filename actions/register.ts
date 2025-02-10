"use server";

import * as z from 'zod';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from '../data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);
    
    if (!validateFields.success) return { error: 'Invalid Fields :-(' };

    const { email, password, name } = validateFields.data;
    
    const existingUser = await getUserByEmail(email);

    if (existingUser) return { error: 'User already exists' };

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    
    return { success: 'Email Sent ;-)' };
}