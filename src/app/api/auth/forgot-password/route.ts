import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { generateSecureToken } from "@/src/lib/tokens";
import { sendPasswordResetEmail } from "@/src/helpers/sendPasswordResetEmail";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Do not reveal if user exists
            return NextResponse.json({ message: "If an account exists, a reset email has been sent." }, { status: 200 });
        }

        const resetToken = generateSecureToken();
        const resetTokenExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: resetToken,
                passwordResetTokenExpiry: resetTokenExpiry,
            },
        });

        await sendPasswordResetEmail(email, resetToken);

        return NextResponse.json({ message: "If an account exists, a reset email has been sent." }, { status: 200 });

    } catch (error: any) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
