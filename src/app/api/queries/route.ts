import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { z } from "zod";
import { UserRole } from "@/generated/prisma/client";

const createQuerySchema = z.object({
  content: z.string().min(1, "Content is required"),
  tutorId: z.string().optional(), // Required if sender is Parent/Student
  studentId: z.string().optional(), // Required if sender is Tutor (for student context)
  parentId: z.string().optional(), // Required if sender is Tutor (for parent context)
  context: z.enum(["TUTOR_PARENT", "TUTOR_STUDENT"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createQuerySchema.parse(body);

    const { content, tutorId, studentId, parentId, context } = validatedData;
    const senderId = session.user.id;
    const senderRole = session.user.role as UserRole;

    // Additional validation based on role
    let finalTutorId = tutorId;
    let finalStudentId = studentId;
    let finalParentId = parentId;

    if (senderRole === "TUTOR") {
      // If sender is Tutor, they must provide studentId or parentId depending on context
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: senderId },
      });
      if (!tutorProfile) {
        return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
      }
      finalTutorId = tutorProfile.id;

      if (context === "TUTOR_STUDENT" && !studentId) {
        return NextResponse.json({ error: "Student ID required for Tutor-Student query" }, { status: 400 });
      }
      if (context === "TUTOR_PARENT" && !parentId) {
        return NextResponse.json({ error: "Parent ID required for Tutor-Parent query" }, { status: 400 });
      }
    } else if (senderRole === "PARENT") {
      finalParentId = senderId;
      if (!tutorId) {
        return NextResponse.json({ error: "Tutor ID required" }, { status: 400 });
      }
      // Parent can only send TUTOR_PARENT context
      if (context !== "TUTOR_PARENT") {
        return NextResponse.json({ error: "Invalid context for Parent" }, { status: 400 });
      }
    } else if (senderRole === "STUDENT") {
      // Student ID is usually in a separate table, but for now let's assume we can get it or use userId if linked
      // Wait, Student model is separate. session.user.id is the User ID (if student has User account) OR Student ID?
      // In this app, Students seem to be created by Parents and might not have full User accounts initially, 
      // OR they have limited access.
      // Let's check auth logic. If logged in as Student, session.user.id is likely the Student ID or User ID.
      // Based on previous files, Student has a 'studentId' field (custom ID) and 'id' (UUID).
      // Let's assume session.user.id is the Student's UUID.
      
      // We need to verify if the session user is a student.
      // For now, let's assume session.user.id maps to Student.id if role is STUDENT.
      finalStudentId = senderId; 
      
      if (!tutorId) {
        return NextResponse.json({ error: "Tutor ID required" }, { status: 400 });
      }
      if (context !== "TUTOR_STUDENT") {
        return NextResponse.json({ error: "Invalid context for Student" }, { status: 400 });
      }
    }

    const query = await prisma.query.create({
      data: {
        content,
        senderId,
        senderRole,
        tutorId: finalTutorId!,
        studentId: finalStudentId,
        parentId: finalParentId,
        context,
      },
    });

    return NextResponse.json(query, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating query:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, id: userId } = session.user;
    let whereClause: any = {};

    if (role === "TUTOR") {
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId },
      });
      if (!tutorProfile) {
        return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
      }
      whereClause = { tutorId: tutorProfile.id };
    } else if (role === "PARENT") {
      whereClause = { parentId: userId };
    } else if (role === "STUDENT") {
      whereClause = { studentId: userId };
    }

    const queries = await prisma.query.findMany({
      where: whereClause,
      include: {
        tutor: {
          include: { user: { select: { fullname: true } } }
        },
        student: { select: { name: true } },
        parent: { select: { fullname: true } },
        responses: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
