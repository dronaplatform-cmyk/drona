import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendStudentCredentialsEmail } from "@/src/lib/mail";

// Schema for creating a student
const createStudentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
  
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const body = await req.json();
    const validatedData = createStudentSchema.parse(body);

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const student = await prisma.student.create({
      data: {
        name: validatedData.name,
        password: hashedPassword,
        parentId: session.user.id,
      },
    });

    // Send credentials to parent
    if (session.user.email) {
      try {
        await sendStudentCredentialsEmail(
          session.user.email,
          student.name,
          student.id,
          validatedData.password
        );
      } catch (emailError) {
        console.error("Failed to send student credentials email:", emailError);
      }
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: (error as z.ZodError).issues }, { status: 400 });
    }
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      where: {
        parentId: session.user.id,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
