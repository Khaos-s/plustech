// services/emailService.js
import nodemailer from 'nodemailer';

const createSMTPTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false, // true if port 465
    auth: {
      user: process.env.SMTP_USER,   // 👈 use SMTP creds, not Gmail
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendVerificationEmail = async (email, verificationLink) => {
  const transporter = createSMTPTransporter(); // 👈 use SMTP here

  const mailOptions = {
    from: `"PLUSTECH" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your PLUSTECH Account',
    html: `
      <h2>Welcome to PLUSTECH</h2>
      <p>Please verify your account:</p>
      <a href="${verificationLink}" target="_blank">Verify Email</a>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  const transporter = createSMTPTransporter(); // 👈 same for reset email

  const mailOptions = {
    from: `"PLUSTECH" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your PLUSTECH Password',
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw error;
  }
};
