import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASSWORD, 
  },
});

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev', // Use your verified domain once configured
    to: email,
    subject: 'Verify your email - Drona',
    html: `
      <h2>Welcome to Drona!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${confirmLink}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};

export const sendStudentCredentialsEmail = async (parentEmail: string, studentName: string, studentId: string, studentPass: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Drona EdTech" <${process.env.SMTP_USER}>`,
      to: parentEmail,
      subject: 'Student Account Created - Drona',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Student Account Details</h2>
          <p>A new student account has been created for <strong>${studentName}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin-bottom: 8px;"><strong>Username:</strong> ${studentId}</p>
            <p><strong>Password:</strong> ${studentPass}</p>
          </div>
          <p>The student can login to the platform using these exact credentials.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Drona Team</strong></p>
        </div>
      `,
    });
    console.log("Student credentials sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending student credentials email", error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Drona EdTech" <${process.env.SMTP_USER}>`, 
      to: email, 
      subject: "Welcome to Drona!", 
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4F46E5;">Welcome to Drona, ${name}!</h2>
          <p>We are thrilled to have you join our platform. Empowering education through authentic connections between parents and tutors is our mission.</p>
          <p>Feel free to explore your dashboard and get started.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Drona Team</strong></p>
        </div>
      `, 
    });
    console.log("Welcome email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending welcome email", error);
    return false;
  }
};

export const sendLoginAttemptEmail = async (email: string, deviceModel: string, ipAddress: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Drona EdTech" <${process.env.SMTP_USER}>`, 
      to: email, 
      subject: "New Login Attempt to Your Drona Account", 
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #E11D48;">Security Alert: New Login Attempt</h2>
          <p>We noticed a new login to your Drona account.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul style="list-style-type: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>Device:</strong> ${deviceModel || 'Unknown Device'}</li>
              <li style="margin-bottom: 8px;"><strong>IP Address:</strong> ${ipAddress || 'Unknown IP'}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
            </ul>
          </div>
          <p>If this was you, you can safely ignore this email. If you don't recognize this activity, please change your password immediately and contact support.</p>
          <br />
          <p>Best regards,</p>
          <p><strong>The Drona Team Security</strong></p>
        </div>
      `, 
    });
    console.log("Login attempt email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending login attempt email", error);
    return false;
  }
};

export const sendAdminLoginAttemptEmail = async (adminUsername: string, deviceModel: string, ipAddress: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Drona Security" <${process.env.SMTP_USER}>`, 
      to: "drona.platform@gmail.com", 
      subject: `🚨 Admin Login Alert: ${adminUsername}`, 
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #E11D48;">Security Alert: Admin Login Attempt</h2>
          <p>An administrative user has successfully logged into the platform.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <ul style="list-style-type: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>Admin Username:</strong> ${adminUsername}</li>
              <li style="margin-bottom: 8px;"><strong>Device:</strong> ${deviceModel || 'Unknown Device'}</li>
              <li style="margin-bottom: 8px;"><strong>IP Address:</strong> ${ipAddress || 'Unknown IP'}</li>
              <li><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
            </ul>
          </div>
          <p>If you don't recognize this activity, please investigate immediately.</p>
        </div>
      `, 
    });
    console.log("Admin login alert sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending admin login alert", error);
    return false;
  }
};
