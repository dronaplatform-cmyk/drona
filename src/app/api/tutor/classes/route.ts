import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!tutorProfile) {
      return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
    }

    const classes = await prisma.class.findMany({
      where: {
        tutorId: tutorProfile.id,
      },
      include: {
        student: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("----------------------------\nError fetching classes:\n----------------------------\n", error);
    return NextResponse.json(error, { status: 500 });
  }
}
