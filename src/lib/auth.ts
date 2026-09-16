import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/src/lib/prisma'; // Your singleton Prisma client
import bcrypt from 'bcryptjs';
import { sendLoginAttemptEmail, sendAdminLoginAttemptEmail } from '@/src/lib/mail';

// Define the NextAuth options object
export const authOptions: NextAuthOptions = {
    // 1. Adapter: Connect NextAuth to your PostgreSQL database via Prisma
    adapter: PrismaAdapter(prisma),

    // 2. Providers: Define the authentication methods
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                // Add student login fields
                studentId: { label: 'Student ID', type: 'text' },
                isStudent: { label: 'Is Student', type: 'text' }
            },

            async authorize(credentials, req) {
                // Scenario A: Student Direct Login
                if (credentials?.isStudent === 'true' && credentials.studentId && credentials.password) {
                    const student = await prisma.student.findUnique({
                        where: { username: credentials.studentId.toLowerCase() },
                        include: { parent: true }
                    });

                    if (!student) return null;

                    // Hash comparison for secure student login
                    const isStudentMatch = await bcrypt.compare(credentials.password, student.password);
                    if (!isStudentMatch) return null;

                    return {
                        id: student.id,
                        name: student.name,
                        email: null, // Students might not have email
                        role: 'STUDENT',
                        username: student.id,
                        isVerified: true,
                        createdAt: new Date(),
                        // Custom field to indicate this is a student session
                        isStudentSession: true,
                        parentId: student.parentId
                    };
                }

                // Scenario B: Parent/Tutor Login
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: { 
                        id: true, 
                        email: true, 
                        fullname: true, 
                        password: true, 
                        role: true,
                        username: true,     
                        isVerified: true,   
                        createdAt: true     
                    },
                });

                if (!user || !user.password) {
                    return null; 
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (isMatch) {
                    // Extract Device + IP from NextAuth req
                    const reqHeaders = req?.headers as Record<string, string> | undefined;
                    const userAgent = reqHeaders?.['user-agent'] || 'Unknown Device';
                    const ipAddress = reqHeaders?.['x-forwarded-for'] || 'Unknown IP';
                    
                    // If Admin, log the activity and send an admin alert instead
                    if (user.role === 'ADMIN') {
                        sendAdminLoginAttemptEmail(user.username, userAgent, ipAddress).catch(console.error);

                        prisma.adminActivityLog.create({
                            data: {
                                adminId: user.id,
                                adminUsername: user.username,
                                action: 'LOGIN',
                                deviceModel: userAgent.substring(0, 255),
                                ipAddress: ipAddress.substring(0, 255)
                            }
                        }).catch(console.error);
                    } else {
                        // Regular users just get a login attempt email
                        if (user.email) {
                            sendLoginAttemptEmail(user.email, userAgent, ipAddress).catch(console.error);
                        }
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.fullname,
                        role: user.role, 
                        username: user.username,     
                        isVerified: user.isVerified ?? false, 
                        createdAt: user.createdAt,
                        isStudentSession: false
                    };
                } else {
                    return null; 
                }
            },
        }),
    ],

    // 3. Callbacks
    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.role = user.role;
                token.username = user.username;     
                token.isVerified = user.isVerified; 
            token.createdAt = user.createdAt;
                token.isStudentSession = user.isStudentSession;
                token.parentId = user.parentId;
            }

            // Handle Profile Switching (Update session via client-side update())
            if (trigger === "update" && session?.activeStudentId) {
                token.activeStudentId = session.activeStudentId;
            }
            if (trigger === "update" && session?.activeStudentId === null) {
                delete token.activeStudentId;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string; // Ensure ID is passed
                session.user.role = token.role as string;
                session.user.username = token.username as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.createdAt = token.createdAt as Date;
                
                // Custom fields
                session.user.isStudentSession = token.isStudentSession as boolean;
                session.user.parentId = token.parentId as string | undefined;
                session.user.activeStudentId = token.activeStudentId as string | undefined;
            }
            return session;
        },  
    },

    // 4. Session Configuration
    session: {
        strategy: 'jwt', 
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // 5. Pages
    pages: {
        signIn: '/auth/login', 
        signOut: '/auth/logout', 
        verifyRequest: 'auth/verify',
        newUser: '/auth/register',
        error: '/auth/error',
    },

    // 6. Secret
    secret: process.env.NEXTAUTH_SECRET, 
};
