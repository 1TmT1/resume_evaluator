'use server';
import nodemailer from 'nodemailer';
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const basePath = process.env.BASE_PATH;
    const confirmLink = `${basePath}/auth/email-verification?token=${token}`;

    try {
        const isVerified = await transporter.verify();

        if (!isVerified) return { error: 'Something went wrong' };
    } catch {
        return { error: 'Something went wrong' };
    }

    const res = await transporter.sendMail({
        from: SMTP_SERVER_USERNAME,
        to: email,
        subject: 'Resume Evaluator - Verify your account now!',
        html: `<p><a href=${confirmLink}>Click here</a> to verify your account.</p>`,
    });

    return res;
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const basePath = process.env.BASE_PATH;
    const resetPasswordLink = `${basePath}/auth/new-password?token=${token}`;

    try {
        const isVerified = await transporter.verify();

        if (!isVerified) return { error: 'Something went wrong' };
    } catch {
        return { error: 'Something went wrong' };
    }

    const res = await transporter.sendMail({
        from: SMTP_SERVER_USERNAME,
        to: email,
        subject: 'Resume Evaluator - Reset Password Link',
        html: `<p><a href=${resetPasswordLink}>Click here</a> to reset your password.</p>`,
    });

    return res;
};