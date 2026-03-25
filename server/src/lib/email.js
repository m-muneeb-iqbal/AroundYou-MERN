import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const EMAIL_TIMEOUT_MS = Number(process.env.EMAIL_TIMEOUT_MS || 10000);

const withTimeout = (promise, timeoutMs, operation) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
        reject(new Error(`${operation} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
        .then((value) => {
            clearTimeout(timer);
            resolve(value);
        })
        .catch((error) => {
            clearTimeout(timer);
            reject(error);
        });
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async ({ to, fullName, token }) => {

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await withTimeout(transporter.sendMail({
        
        from: `"AroundYou" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Verify your AroundYou account",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
                
                <h2 style="color: #04263D; margin-bottom: 8px;">Welcome to AroundYou, ${fullName}!</h2>
                <p style="color: #555; margin-bottom: 24px;">
                    Thanks for signing up. Please verify your email address to activate your account.
                    This link expires in <strong>15 minutes</strong>.
                </p>

                <a href="${verificationUrl}"
                    style="display: inline-block; background-color: #04263D; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                    Verify Email Address
                </a>

                <p style="color: #aaa; font-size: 0.78rem; margin-top: 24px;">
                    If you didn't create an account, you can safely ignore this email.
                </p>
                <p style="color: #aaa; font-size: 0.78rem;">
                    Link not working? Copy and paste this URL into your browser:<br/>
                    <span style="color: #04263D;">${verificationUrl}</span>
                </p>

            </div>
        `,

    }), EMAIL_TIMEOUT_MS, "Verification email send");

};