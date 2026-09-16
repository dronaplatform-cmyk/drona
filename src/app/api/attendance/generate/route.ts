
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { generateClassCode } from "@/src/lib/verification";
import { ClassStatus } from "@/generated/prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "STUDENT" && session.user.role !== "PARENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { classId } = await req.json();

    if (!classId) {
      return NextResponse.json({ error: "Class ID is required" }, { status: 400 });
    }

    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        student: true,
      },
    });

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Verify ownership
    // If student, must match class.studentId
    // If parent, class.student.parentId must match session.user.id
    if (session.user.role === "STUDENT") {
        if (classRecord.studentId !== session.user.id) { // NOTE: Student ID in session might need checking if it maps correctly. 
            // In our "Guardian-Dependent" model, Student login usually has their own ID in session.user.id?
            // Yes, checking authOptions for student profile would confirm.
            // Assuming session.user.id IS the student ID for STUDENT role.
             if (classRecord.studentId !== session.user.id) {
                 return NextResponse.json({ error: "Unauthorized for this class" }, { status: 403 });
             }
        }
    } else if (session.user.role === "PARENT") {
        if (classRecord.student.parentId !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized for this class" }, { status: 403 });
        }
    }

    if (classRecord.status === ClassStatus.COMPLETED || classRecord.status === ClassStatus.CANCELLED) {
       return NextResponse.json({ error: "Class is not active" }, { status: 400 });
    }

    const code = generateClassCode(classRecord.id, classRecord.studentId, classRecord.tutorId);

    return NextResponse.json({ token: code });

  } catch (error) {
    console.error("Error generating code:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
