import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: session.user.id },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Fetch classes where the student was present
    const attendedClasses = await prisma.class.findMany({
      where: {
        studentId: student.id,
        status: "COMPLETED",
      },
      include: {
        tutor: {
          include: {
            user: {
              select: { fullname: true },
            },
          },
        },
      },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json(attendedClasses);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
