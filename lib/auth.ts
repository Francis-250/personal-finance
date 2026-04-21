import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, phoneNumber, username } from "better-auth/plugins";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./nodemailer";

interface UserUrlProps {
  url: string;
  user: {
    email: string;
    id: string;
    emailVerified?: boolean;
  };
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ url, user }: UserUrlProps) {
      sendEmail({
        from: process.env.EMAIL_USER as string,
        to: user.email,
        purpose: "RESET_OTP",
        url: url,
      }).catch((err) => console.error("Failed to send reset email:", err));
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ url, user }: UserUrlProps) {
      sendEmail({
        from: process.env.EMAIL_USER as string,
        to: user.email,
        purpose: "VERIFY_EMAIL",
        url: url,
      }).catch((err) => console.error("Failed to send verify email:", err));
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin({
      adminRoles: ["admin"],
      allowImpersonation: true,
      allowUserDelete: true,
      allowRoleChange: true,
      defaultRole: "user",
    }),
    username(),
    phoneNumber(),
    nextCookies(),
  ],
});
