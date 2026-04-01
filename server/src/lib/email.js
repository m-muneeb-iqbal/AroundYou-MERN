import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const EMAIL_TIMEOUT_MS = Number(process.env.EMAIL_TIMEOUT_MS || 10000);
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@aroundyou.online";

if (!RESEND_API_KEY) {
    console.warn("Warning: RESEND_API_KEY is not set. Email functionality will not work.");
}

const resend = new Resend(RESEND_API_KEY);

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

export const sendVerificationEmail = async ({ to, fullName, token }) => {

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await withTimeout(resend.emails.send({
        from: `AroundYou <${FROM_EMAIL}>`,
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

export const sendPasswordResetEmail = async ({ to, fullName, token }) => {

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await withTimeout(resend.emails.send({
        from: `AroundYou <${FROM_EMAIL}>`,
        to,
        subject: "Reset your AroundYou password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
                
                <h2 style="color: #04263D; margin-bottom: 8px;">Password Reset Request</h2>
                <p style="color: #555; margin-bottom: 24px;">
                    Hi ${fullName}, we received a request to reset your password. Click the button below to create a new password.
                    This link expires in <strong>1 hour</strong>.
                </p>

                <a href="${resetUrl}"
                    style="display: inline-block; background-color: #04263D; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                    Reset Password
                </a>

                <p style="color: #aaa; font-size: 0.78rem; margin-top: 24px;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will not change.
                </p>
                <p style="color: #aaa; font-size: 0.78rem;">
                    Link not working? Copy and paste this URL into your browser:<br/>
                    <span style="color: #04263D;">${resetUrl}</span>
                </p>

            </div>
        `,
    }), EMAIL_TIMEOUT_MS, "Password reset email send");

};