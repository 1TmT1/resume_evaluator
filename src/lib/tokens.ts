import { v4 as uuid } from 'uuid';
import { getVerificationTokenByEmail } from '../../data/verification-token';
import { getResetPasswordTokenByEmail } from '../../data/reset-password-token';
import { db } from './db';

export const generateVerificationToken = async (email: string) => {
    const token = uuid();
    const expiresAt =  new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires: expiresAt,
        }
    });

    return verificationToken; 
}

export const generateResetPasswordResetToken = async(email: string) => {
    const token = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getResetPasswordTokenByEmail(email);

    if (existingToken) {
        await db.resetPasswordToken.delete({
            where: {id: existingToken.id}
        });
    }

    const resetPasswordToken = await db.resetPasswordToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return resetPasswordToken;
}