import pool from "../../config/db.js";

// ---------------------------------------------------------------------------
// Find a user by email
// ---------------------------------------------------------------------------
export const findEmail = async (email) => {
      const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
      );

      return result.rows[0];
};

// ---------------------------------------------------------------------------
// Find a user by ID
// ---------------------------------------------------------------------------
export const findUserById = async (userId) => {
      const result = await pool.query(
            `SELECT id, name, email, email_verified, created_at
     FROM users
     WHERE id = $1`,
            [userId]
      );

      return result.rows[0];
};

// ---------------------------------------------------------------------------
// Register a new user
// ---------------------------------------------------------------------------
export const register = async (fullname, email, password) => {
      const result = await pool.query(
            `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, email_verified, created_at`,
            [fullname, email, password]
      );

      return result.rows[0];
};

// ---------------------------------------------------------------------------
// Update the password-reset OTP
// ---------------------------------------------------------------------------
export const updateOtp = async (userId, otp, expiresAt) => {
      const result = await pool.query(
            `UPDATE users
     SET reset_otp = $1,
         reset_otp_expires = $2,
         reset_otp_used = FALSE,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING id`,
            [otp, expiresAt, userId]
      );

      return result.rows[0];
};

// ---------------------------------------------------------------------------
// Find a user by their OTP — only returns valid, unused, unexpired OTPs
// ---------------------------------------------------------------------------
export const findOtpUser = async (otp) => {
      const result = await pool.query(
            `SELECT id, email, reset_otp, reset_otp_expires, reset_otp_used
     FROM users
     WHERE reset_otp = $1
       AND reset_otp_used = FALSE
       AND reset_otp_expires > NOW()`,
            [otp]
      );

      return result.rows[0];
};

// ---------------------------------------------------------------------------
// Mark the OTP as used
// ---------------------------------------------------------------------------
export const markOtpUsed = async (userId) => {
      const result = await pool.query(
            `UPDATE users
     SET reset_otp = NULL,
         reset_otp_expires = NULL,
         reset_otp_used = TRUE,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
            [userId]
      );

      return result.rowCount > 0;
};

// ---------------------------------------------------------------------------
// Update the user's password (and invalidate the OTP)
// ---------------------------------------------------------------------------
export const updatePassword = async (userId, hashedPassword) => {
      const result = await pool.query(
            `UPDATE users
     SET password = $1,
         reset_otp = NULL,
         reset_otp_expires = NULL,
         reset_otp_used = TRUE,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, email`,
            [hashedPassword, userId]
      );

      return result.rows[0];
};