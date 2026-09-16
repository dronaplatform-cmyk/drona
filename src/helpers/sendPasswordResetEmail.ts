import { resend } from '@/src/lib/resend';

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev', // Update this with your verified domain
            to: email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });
        console.log('Password reset email sent:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error };
    }
};
