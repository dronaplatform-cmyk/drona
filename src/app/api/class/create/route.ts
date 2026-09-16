
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { z } from "zod";

const createClassSchema = z.object({
  tutorId: z.string().min(1, "Tutor ID is required"),
  studentId: z.string().min(1, "Student ID is required"),
  schedules: z.array(z.string().datetime()).min(1, "At least one scheduled time is required"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createClassSchema.parse(body);

    // Verify parent owns the student
    const student = await prisma.student.findUnique({
      where: { id: validatedData.studentId },
    });

    if (!student || student.parentId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized student access" }, { status: 403 });
    }

    // Bulk create using transaction
    const createdClasses = await prisma.$transaction(
      validatedData.schedules.map((scheduledAt) => 
        prisma.class.create({
          data: {
            tutorId: validatedData.tutorId,
            studentId: validatedData.studentId,
            scheduledAt: scheduledAt,
            status: "SCHEDULED",
          }
        })
      )
    );

    return NextResponse.json({ count: createdClasses.length }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: (error as z.ZodError).issues }, { status: 400 });
    }
    console.error("Error creating class:", error);
    return NextResponse.json(error, { status: 500 });
  }
}
