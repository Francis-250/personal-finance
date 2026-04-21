import nodemailer from "nodemailer";

export const Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail(options: {
  from: string;
  to: string;
  purpose: string;
  url?: string;
}) {
  const { from, to, purpose, url } = options;

  if (purpose === "RESET_OTP") {
    await Transporter.sendMail({
      from,
      to,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${url}">${url}</a>
             <p>This link is valid for 1 hour.</p>`,
    });
  } else if (purpose === "VERIFY_EMAIL") {
    await Transporter.sendMail({
      from,
      to,
      subject: "Verify Your Email Address",
      html: `<p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
             <a href="${url}">${url}</a>
             <p>This link is valid for 24 hours.</p>`,
    });
  } else {
    console.error("Purpose currently not set");
  }
}
