import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: ENV.MAIL_HOST,
    port: ENV.MAIL_PORT,
    secure: false,
    auth: {
      user: ENV.MAIL_USER,
      pass: ENV.MAIL_PASS,
    },
  });
};

// Send email to admin when contact form is submitted
export const sendContactNotification = async ({ firstName, lastName, email, message, company }) => {
  if (!ENV.MAIL_USER || !ENV.ADMIN_EMAIL) return;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Portfolio Contact" <${ENV.MAIL_FROM}>`,
    to: ENV.ADMIN_EMAIL,
    subject: `New message from ${firstName} ${lastName || ""}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 8px;">${firstName} ${lastName || ""}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Email:</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          ${company ? `
          <tr>
            <td style="padding: 8px; font-weight: bold;">Company:</td>
            <td style="padding: 8px;">${company}</td>
          </tr>` : ""}
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 8px;">${message}</td>
          </tr>
        </table>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Received at ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  });
};

// Send auto reply to the person who submitted the form
export const sendAutoReply = async ({ firstName, email }) => {
  if (!ENV.MAIL_USER) return;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Portfolio" <${ENV.MAIL_FROM}>`,
    to: email,
    subject: "Thanks for reaching out!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hi ${firstName},</h2>
        <p>Thank you for your message. I have received it and will get back to you as soon as possible.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated reply. Please do not respond to this email.
        </p>
      </div>
    `,
  });
};

// Send password reset or admin invite email
export const sendAdminInvite = async ({ name, email, password }) => {
  if (!ENV.MAIL_USER) return;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Portfolio Admin" <${ENV.MAIL_FROM}>`,
    to: email,
    subject: "Your Admin Account Details",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome ${name},</h2>
        <p>Your admin account has been created. Here are your login details:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 100px;">Email:</td>
            <td style="padding: 8px;">${email}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Password:</td>
            <td style="padding: 8px;">${password}</td>
          </tr>
        </table>
        <p style="color: #e74c3c; font-size: 13px; margin-top: 16px;">
          Please change your password after your first login.
        </p>
      </div>
    `,
  });
};