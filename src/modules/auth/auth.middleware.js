import jwt from "jsonwebtoken";
import {
    validateRegistrationInput,
    validateLoginInput,
    validateForgotPasswordInput,
    validateVerifyOtpInput,
    validateResetPasswordInput,
} from "./auth.validation.js";
import * as authRepository from "./auth.repository.js";

// ---------------------------------------------------------------------------
// Validation middleware
// ---------------------------------------------------------------------------
export const validateRegister = (req, res, next) => {
    const errors = validateRegistrationInput(req.body);
    if (errors.length > 0) {
        return res
            .status(400)
            .json({ success: false, message: "Validation failed.", errors });
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const errors = validateLoginInput(req.body);
    if (errors.length > 0) {
        return res
            .status(400)
            .json({ success: false, message: "Validation failed.", errors });
    }
    next();
};

export const validateForgotPassword = (req, res, next) => {
    const errors = validateForgotPasswordInput(req.body);
    if (errors.length > 0) {
        return res
            .status(400)
            .json({ success: false, message: "Validation failed.", errors });
    }
    next();
};

export const validateVerifyOtp = (req, res, next) => {
    const errors = validateVerifyOtpInput(req.body);
    if (errors.length > 0) {
        return res
            .status(400)
            .json({ success: false, message: "Validation failed.", errors });
    }
    next();
};

export const validateResetPassword = (req, res, next) => {
    const errors = validateResetPasswordInput(req.body);
    if (errors.length > 0) {
        return res
            .status(400)
            .json({ success: false, message: "Validation failed.", errors });
    }
    next();
};

// ---------------------------------------------------------------------------
// JWT authentication middleware
// ---------------------------------------------------------------------------
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || !parts[1]) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Malformed authorization header.",
            });
        }

        const token = parts[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await authRepository.findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. User no longer exists.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }

        console.error("[AUTH] Unexpected middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed. Please try again.",
        });
    }
};