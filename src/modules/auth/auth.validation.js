/**
 * Pure JavaScript validation utilities for authentication.
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
export const validateRegistrationInput = (data) => {
    const errors = [];
    const { fullname, email, password } = data || {};

    // Full name
    if (!fullname || typeof fullname !== "string" || fullname.trim() === "") {
        errors.push("Full name is required.");
    } else if (fullname.trim().length < 2) {
        errors.push("Full name must be at least 2 characters long.");
    } else if (fullname.trim().length > 100) {
        errors.push("Full name cannot exceed 100 characters.");
    }

    // Email
    if (!email || typeof email !== "string" || email.trim() === "") {
        errors.push("Email is required.");
    } else if (!emailRegex.test(email.trim())) {
        errors.push("Please provide a valid email address.");
    } else if (email.trim().length > 255) {
        errors.push("Email cannot exceed 255 characters.");
    }

    // Password
    if (!password || typeof password !== "string") {
        errors.push("Password is required.");
    } else if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    } else if (password.length > 72) {
        errors.push("Password cannot exceed 72 characters.");
    } else if (password.trim().length < 8) {
        errors.push("Password cannot be only whitespace.");
    }

    return errors;
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export const validateLoginInput = (data) => {
    const errors = [];
    const { email, password } = data || {};

    if (!email || typeof email !== "string" || email.trim() === "") {
        errors.push("Email is required.");
    } else if (!emailRegex.test(email.trim())) {
        errors.push("Please provide a valid email address.");
    }

    if (!password || typeof password !== "string" || password === "") {
        errors.push("Password is required.");
    }

    return errors;
};

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------
export const validateForgotPasswordInput = (data) => {
    const errors = [];
    const { email } = data || {};

    if (!email || typeof email !== "string" || email.trim() === "") {
        errors.push("Email is required.");
    } else if (!emailRegex.test(email.trim())) {
        errors.push("Please provide a valid email address.");
    }

    return errors;
};

// ---------------------------------------------------------------------------
// Verify OTP
// ---------------------------------------------------------------------------
export const validateVerifyOtpInput = (data) => {
    const errors = [];
    const { otp } = data || {};

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
        errors.push("A valid 6-digit OTP is required.");
    } else if (!/^\d{6}$/.test(otp.trim())) {
        errors.push("OTP must contain only digits.");
    }

    return errors;
};

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------
export const validateResetPasswordInput = (data) => {
    const errors = [];
    const { otp, newPassword } = data || {};

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
        errors.push("A valid 6-digit OTP is required.");
    } else if (!/^\d{6}$/.test(otp.trim())) {
        errors.push("OTP must contain only digits.");
    }

    if (!newPassword || typeof newPassword !== "string") {
        errors.push("New password is required.");
    } else if (newPassword.length < 8) {
        errors.push("New password must be at least 8 characters long.");
    } else if (newPassword.length > 72) {
        errors.push("New password cannot exceed 72 characters.");
    } else if (newPassword.trim().length < 8) {
        errors.push("New password cannot be only whitespace.");
    }

    return errors;
};