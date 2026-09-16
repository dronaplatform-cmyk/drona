import { resend } from '@/src/lib/resend';
import VerficationEmail from '@/src/components/emails/VerficationEmail';

export const sendVerificationEmail = async (email: string, username: string, token: string) => {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev', // Update this with your verified domain
            to: email,
            subject: 'Verify your email address',
            react: VerficationEmail({ validationCode: token }),
        });
        console.log('Verification email sent:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error };
    }
};
