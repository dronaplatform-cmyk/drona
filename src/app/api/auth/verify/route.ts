import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Verification token is required" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        verficationToken: token,
        verficationTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired verification token" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verficationToken: null,
        verficationTokenExpiry: null,
      },
    });

    // Determine redirect URL based on role
    const loginPath = user.role === 'TUTOR' ? '/auth/login/tutor' : '/auth/login/parent';
    const redirectUrl = new URL(loginPath, req.url);
    redirectUrl.searchParams.set('verified', 'true');

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
