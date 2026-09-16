import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const classRecord = await prisma.class.findUnique({
      where: { id },
      include: {
        student: true,
        tutor: {
            include: {
                user: {
                    select: { fullname: true }
                }
            }
        },
        resources: true,
      },
    });

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Access Control
    // Tutor: Must be the assigned tutor
    // Student: Must be the assigned student
    // Parent: Must be the parent of the assigned student
    let hasAccess = false;
    
    // Check if user is the tutor
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (tutorProfile && classRecord.tutorId === tutorProfile.id) {
        hasAccess = true;
    } else if (session.user.role === "STUDENT" && classRecord.studentId === session.user.id) {
        hasAccess = true;
    } else if (session.user.role === "PARENT" && classRecord.student.parentId === session.user.id) {
        hasAccess = true;
    }

    if (!hasAccess) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(classRecord);

  } catch (error) {
    console.error("Error fetching class:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
