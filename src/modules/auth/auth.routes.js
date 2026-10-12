import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    register,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword,
    getProfile,
} from "./auth.controller.js";
import {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateVerifyOtp,
    validateResetPassword,
    authenticate,
} from "./auth.middleware.js";

const router = Router();

// Strict limiter for sensitive actions
const sensitiveOpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again after 15 minutes.",
    },
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User Authentication & Account Recovery
 */

// ---------------------------------------------------------------------------
// POST /auth/register
// ---------------------------------------------------------------------------
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already exists
 */
router.post("/register", sensitiveOpLimiter, validateRegister, register);

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateLogin, login);

// ---------------------------------------------------------------------------
// POST /auth/forgot-password
// ---------------------------------------------------------------------------
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: OTP generated and sent
 *       400:
 *         description: Validation error
 */
router.post(
    "/forgot-password",
    sensitiveOpLimiter,
    validateForgotPassword,
    forgotPassword
);

// ---------------------------------------------------------------------------
// POST /auth/verify-otp
// ---------------------------------------------------------------------------
/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify 6-digit OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verify-otp", validateVerifyOtp, verifyOtp);

// ---------------------------------------------------------------------------
// POST /auth/reset-password
// ---------------------------------------------------------------------------
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *               - newPassword
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewSecurePass123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired OTP
 */
router.post(
    "/reset-password",
    sensitiveOpLimiter,
    validateResetPassword,
    resetPassword
);

// ---------------------------------------------------------------------------
// GET /auth/me
// ---------------------------------------------------------------------------
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get currently authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized or missing token
 */
router.get("/me", authenticate, getProfile);

export default router;