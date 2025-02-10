'use server';
import nodemailer from 'nodemailer';
const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_SERVER_HOST,
    port: 587,
    secure: true,
    auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    const basePath = process.env.BASE_PATH;
    const confirmLink = `${basePath}/auth/email-verification?token=${token}`;

    try {
        const isVerified = await transporter.verify();
    } catch(err) {
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