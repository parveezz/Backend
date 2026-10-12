import * as authService from "./auth.service.js";

// ---------------------------------------------------------------------------
// POST /auth/register
// ---------------------------------------------------------------------------
export const register = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await authService.registerUser({ fullname, email, password });

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /auth/forgot-password
// ---------------------------------------------------------------------------
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);

        return res.status(200).json({
            success: true,
            message: result.message,
            ...(result.otpPreview && { otpPreview: result.otpPreview }),
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /auth/verify-otp
// ---------------------------------------------------------------------------
export const verifyOtp = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const result = await authService.verifyOtp(otp);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// POST /auth/reset-password
// ---------------------------------------------------------------------------
export const resetPassword = async (req, res, next) => {
    try {
        const { otp, newPassword } = req.body;
        const result = await authService.resetPassword(otp, newPassword);

        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// GET /auth/me (Protected)
// ---------------------------------------------------------------------------
export const getProfile = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            data: { user: req.user },
        });
    } catch (error) {
        next(error);
    }
};