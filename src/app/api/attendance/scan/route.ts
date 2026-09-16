import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token, classId } = await req.json();

    if (!token || !classId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    if (classRecord.tutorId !== session.user.id) { // Assuming tutorProfile.id is linked or we check via user.id
       // Wait, session.user.id is User ID, class.tutorId is TutorProfile ID.
       // Need to fetch TutorProfile ID for current user.
       const tutorProfile = await prisma.tutorProfile.findUnique({
         where: { userId: session.user.id }
       });
       
       if (!tutorProfile || classRecord.tutorId !== tutorProfile.id) {
         return NextResponse.json({ error: "Not your class" }, { status: 403 });
       }
    }

    if (classRecord.attendanceToken !== token) {
      return NextResponse.json({ error: "Invalid QR Code" }, { status: 400 });
    }

    // Mark as Completed
    await prisma.class.update({
      where: { id: classId },
      data: { 
        status: "COMPLETED",
        attendanceToken: null // Invalidate token after use
      },
    });

    return NextResponse.json({ success: true, message: "Attendance Marked" });

  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
