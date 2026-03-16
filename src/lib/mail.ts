import { Resend } from 'resend';

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
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: parentEmail,
    subject: 'Student Account Created - Drona',
    html: `
      <h2>Student Account Details</h2>
      <p>A new student account has been created for <strong>${studentName}</strong>.</p>
      <p><strong>Student ID:</strong> ${studentId}</p>
      <p><strong>Password:</strong> ${studentPass}</p>
      <p>The student can login using these credentials.</p>
    `,
  });
};
