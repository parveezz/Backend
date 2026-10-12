import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as authRepository from "./auth.repository.js";
import { sendWelcomeEmail, sendOtpEmail } from "../../services/email.service.js";

// ---------------------------------------------------------------------------
// Generate JWT
// ---------------------------------------------------------------------------
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

// ---------------------------------------------------------------------------
// 1. Register User
// ---------------------------------------------------------------------------
export const registerUser = async ({ fullname, email, password }) => {
    const normalizedName = fullname.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await authRepository.register(
            normalizedName,
            normalizedEmail,
            hashedPassword
        );

        // Fire-and-forget — never block registration on email delivery
        sendWelcomeEmail(normalizedEmail, normalizedName).catch((err) =>
            console.error("[EMAIL] Welcome email failed:", err.message)
        );

        return newUser;
    } catch (err) {
        // Postgres unique violation on email
        if (err.code === "23505") {
            const conflictError = new Error(
                "An account with this email already exists."
            );
            conflictError.statusCode = 409;
            throw conflictError;
        }
        throw err;
    }
};

// ---------------------------------------------------------------------------
// 2. Login User
// ---------------------------------------------------------------------------
export const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await authRepository.findEmail(normalizedEmail);
    if (!user) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user.id);
    const {
        password: _,
        reset_otp,
        reset_otp_expires,
        reset_otp_used,
        ...userData
    } = user;

    return { user: userData, token };
};

// ---------------------------------------------------------------------------
// 3. Forgot Password (generate + store 6-digit OTP)
// ---------------------------------------------------------------------------
export const forgotPassword = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await authRepository.findEmail(normalizedEmail);

    // Do NOT reveal whether the account exists (enumeration protection)
    if (!user) {
        return {
            message: "If an account exists with this email, an OTP has been sent.",
        };
    }

    // Cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await authRepository.updateOtp(user.id, otp, expiresAt);

    // Fire-and-forget OTP email
    sendOtpEmail(normalizedEmail, otp).catch((err) =>
        console.error("[EMAIL] OTP email failed:", err.message)
    );

    return {
        message: "If an account exists with this email, an OTP has been sent.",
        // Only exposed when explicitly enabled in env (never in production)
        ...(process.env.ALLOW_OTP_PREVIEW === "true" && { otpPreview: otp }),
    };
};

// ---------------------------------------------------------------------------
// Shared helper: resolve and validate an OTP
// ---------------------------------------------------------------------------
const findValidOtpUser = async (otp) => {
    const user = await authRepository.findOtpUser(otp.trim());

    if (!user) {
        const error = new Error("Invalid or expired OTP.");
        error.statusCode = 400;
        throw error;
    }

    if (user.reset_otp_used) {
        const error = new Error("This OTP has already been used.");
        error.statusCode = 400;
        throw error;
    }

    if (new Date() > new Date(user.reset_otp_expires)) {
        const error = new Error("OTP has expired. Please request a new one.");
        error.statusCode = 400;
        throw error;
    }

    return user;
};

// ---------------------------------------------------------------------------
// 4. Verify OTP
// ---------------------------------------------------------------------------
export const verifyOtp = async (otp) => {
    await findValidOtpUser(otp);
    return { message: "OTP verified successfully." };
};

// ---------------------------------------------------------------------------
// 5. Reset Password
// ---------------------------------------------------------------------------
export const resetPassword = async (otp, newPassword) => {
    const user = await findValidOtpUser(otp);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authRepository.updatePassword(user.id, hashedPassword);

    return {
        message: "Password has been reset successfully. You can now log in.",
    };
};