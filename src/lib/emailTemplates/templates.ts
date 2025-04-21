import { baseTemplate } from "./baseTemplate";

export const passwordResetTemplate = (url: string) => {
  const content = `
        <h2>Reset Your Password</h2>
        <p>You've requested to reset your password. Click the button below to set a new password:</p>
        <a href="${url}" class="button" style="color: white;">Reset Password</a>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours for security reasons.</p>
    `;
  return baseTemplate(content);
};

export const emailVerificationTemplate = (url: string) => {
  const content = `
        <h2>Welcome to Nerdspace!</h2>
        <p>Thank you for signing up. Please verify your email address to get started:</p>
        <a href="${url}" class="button" style="color: white;">Verify Email</a>
        <p>If you didn't create an account with us, you can safely ignore this email.</p>
    `;
  return baseTemplate(content);
};

export const magicLinkTemplate = (url: string) => {
  const content = `
        <h2>Login to Nerdspace</h2>
        <p>Click the button below to sign in to your account. This link is valid for the next 10 minutes:</p>
        <a href="${url}" class="button" style="color: white;">Sign In</a>
        <p>If you didn't request this login link, please ignore this email.</p>
    `;
  return baseTemplate(content);
};
