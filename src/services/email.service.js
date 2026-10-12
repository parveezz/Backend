
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const user = process.env.email;
const pass = process.env.pass;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user,
        pass,
    },
});

const emailLayout = (content) => `
  <div style="margin:0;padding:40px 12px;background:#f3f5f9;font-family:Arial,Helvetica,sans-serif;color:#172033;">
    <div style="max-width:560px;margin:0 auto;">

      <div style="text-align:center;padding:10px 0 24px;">
        <div style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:22px;font-weight:700;padding:12px 16px;border-radius:12px;">
          A
        </div>
        <div style="font-size:20px;font-weight:700;margin-top:10px;color:#172033;">
          ${process.env.EMAIL_FROM_NAME || "App Support"}
        </div>
      </div>

      <div style="background:#ffffff;border:1px solid #e6eaf0;border-radius:16px;overflow:hidden;">
        <div style="height:5px;background:linear-gradient(90deg,#4f46e5,#8b5cf6);"></div>
        <div style="padding:32px 28px;">
          ${content}
        </div>
      </div>

      <div style="text-align:center;padding:22px 12px;color:#8490a3;font-size:12px;line-height:1.8;">
        This is an automated email. Please do not reply to this message.<br/>
        &copy; ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME || "App Support"}
      </div>

    </div>
  </div>
`;

export const sendWelcomeEmail = async (toEmail, fullname) => {
    if (!user || !pass) {
        console.warn("[MAIL] Email credentials are missing from .env.");
        return;
    }

    const safeName = String(fullname)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const content = `
    <div style="text-align:center;">
      <div style="font-size:42px;margin-bottom:16px;">&#127881;</div>
      <p style="font-size:12px;letter-spacing:2px;font-weight:700;color:#4f46e5;text-transform:uppercase;margin:0 0 12px;">
        Welcome aboard
      </p>
      <h1 style="font-size:28px;line-height:1.3;margin:0 0 16px;color:#172033;">
        Hello, ${safeName}!
      </h1>
      <p style="font-size:15px;line-height:1.8;color:#657087;margin:0 0 24px;">
        Your account has been created successfully. We're excited to have you with us!
      </p>

      <div style="background:#f7f7ff;border:1px solid #e7e5ff;border-radius:12px;padding:18px;margin-bottom:24px;text-align:left;">
        <p style="font-size:12px;color:#737b91;margin:0 0 6px;">REGISTERED EMAIL</p>
        <p style="font-size:15px;font-weight:600;color:#242b40;margin:0;overflow-wrap:anywhere;">
          ${toEmail.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </p>
      </div>

      <p style="font-size:14px;line-height:1.8;color:#657087;margin:0;">
        You can now sign in and start exploring the platform.
      </p>
    </div>
  `;

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || "App Support"}" <${user}>`,
        to: toEmail,
        subject: "Welcome aboard! Your account is ready",
        text: `Hello, ${fullname}! Your account has been created successfully. Registered email: ${toEmail}.`,
        html: emailLayout(content),
    };

    try {
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("[MAIL ERROR] Failed to send welcome email:", error.message);
        throw error;
    }
};

export const sendOtpEmail = async (toEmail, otp) => {
    if (!user || !pass) {
        throw new Error("Email credentials are missing from .env.");
    }

    const safeOtp = String(otp).replace(/[&<>"']/g, "");

    const content = `
    <div style="text-align:center;">
      <div style="width:64px;height:64px;line-height:64px;margin:0 auto 20px;background:#fff1f2;border-radius:50%;font-size:28px;">
        &#128273;
      </div>

      <p style="font-size:12px;letter-spacing:2px;font-weight:700;color:#e11d48;text-transform:uppercase;margin:0 0 12px;">
        Security verification
      </p>

      <h1 style="font-size:26px;line-height:1.3;margin:0 0 14px;color:#172033;">
        Reset your password
      </h1>

      <p style="font-size:15px;line-height:1.8;color:#657087;margin:0 0 26px;">
        We received a request to reset your password. Enter this one-time code to continue.
      </p>

      <div style="background:#f8f9fc;border:1px dashed #cbd2e1;border-radius:12px;padding:22px 12px;margin-bottom:22px;">
        <p style="font-size:11px;letter-spacing:2px;font-weight:700;color:#8490a3;margin:0 0 12px;">
          YOUR VERIFICATION CODE
        </p>
        <div style="font-size:34px;font-weight:700;letter-spacing:9px;color:#3730a3;overflow-wrap:anywhere;">
          ${safeOtp}
        </div>
      </div>

      <div style="background:#fff7ed;border-radius:8px;padding:14px;text-align:left;margin-bottom:22px;">
        <p style="font-size:13px;line-height:1.7;color:#9a3412;margin:0;">
          <strong>&#9200; Expires in 10 minutes.</strong><br/>
          Do not share this code with anyone, including anyone claiming to be support.
        </p>
      </div>

      <p style="font-size:13px;line-height:1.8;color:#8490a3;margin:0;">
        If you didn't request a password reset, ignore this email. Your password won't change unless the reset process is completed.
      </p>
    </div>
  `;

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || "App Support"}" <${user}>`,
        to: toEmail,
        subject: "Your password reset verification code",
        text: `Your password reset code is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
        html: emailLayout(content),
    };

    try {
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("[MAIL ERROR] Failed to send OTP email:", error.message);
        throw error;
    }
};

export default transporter;
