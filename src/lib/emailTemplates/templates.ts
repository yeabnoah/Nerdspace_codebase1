import { baseTemplate } from "./baseTemplate";

export const passwordResetTemplate = (url: string) => {
  const content = `
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password for your NerdSpace account. For your security, no changes have been made to your account yet.</p>
        
        <div class="note">
            <strong style="color: #FFFFFF; display: block; margin-bottom: 4px;">🔒 Security Note:</strong>
            If you didn't request this password reset, please secure your account by changing your password immediately.
        </div>

        <div style="text-align: center;">
            <a href="${url}" class="button">Reset Password</a>
        </div>
        
        <p style="color: #71717A; font-size: 14px;">This password reset link will expire in 24 hours for security reasons. Need help? Contact our support team.</p>
    `;
  return baseTemplate(content);
};

export const emailVerificationTemplate = (url: string) => {
  const content = `
        <h2>Welcome to NerdSpace!</h2>
        <p>We're thrilled to have you join our community of creators and builders. To get started and unlock all features, please verify your email address.</p>
        
        <div style="text-align: center; margin: 32px 0;">
            <a href="${url}" class="button">Verify Email Address</a>
        </div>

        <div class="note">
            <strong style="color: #FFFFFF; display: block; margin-bottom: 4px;">✨ What's Next:</strong>
            <ul style="color: #D4D4D8; margin: 8px 0; padding-left: 20px;">
                <li>Explore projects from other creators</li>
                <li>Share your own creations</li>
                <li>Connect with fellow builders</li>
            </ul>
        </div>
        
        <p style="color: #71717A; font-size: 14px;">If you didn't create an account with us, you can safely ignore this email.</p>
    `;
  return baseTemplate(content);
};

export const magicLinkTemplate = (url: string) => {
  const content = `
        <h2>Sign In to NerdSpace</h2>
        <p>Welcome back! Use the secure link below to sign in to your NerdSpace account. For your security, this link will only be valid for the next 10 minutes.</p>

        <div style="text-align: center;">
            <a href="${url}" class="button">Sign In Securely</a>
        </div>

        <div class="note">
            <strong style="color: #FFFFFF; display: block; margin-bottom: 4px;">🔐 Security Tip:</strong>
            Never share this link with anyone. Our team will never ask for your login link.
        </div>
        
        <p style="color: #71717A; font-size: 14px;">If you didn't request this login link, you can safely ignore this email. Someone may have typed your email address by mistake.</p>
    `;
  return baseTemplate(content);
};
