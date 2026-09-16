import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { z } from "zod";
import { UserRole } from "@/generated/prisma/client";

const createResponseSchema = z.object({
  queryId: z.string().min(1, "Query ID is required"),
  content: z.string().min(1, "Content is required"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createResponseSchema.parse(body);

    const { queryId, content } = validatedData;
    const senderId = session.user.id;
    const senderRole = session.user.role as UserRole;

    // Verify user has access to this query
    const query = await prisma.query.findUnique({
      where: { id: queryId },
    });

    if (!query) {
      return NextResponse.json({ error: "Query not found" }, { status: 404 });
    }

    // Check if user is part of the query
    let isAuthorized = false;
    if (senderRole === "TUTOR") {
      const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId: senderId } });
      if (tutorProfile && tutorProfile.id === query.tutorId) {
        isAuthorized = true;
      }
    } else if (senderRole === "PARENT") {
      if (query.parentId === senderId) {
        isAuthorized = true;
      }
    } else if (senderRole === "STUDENT") {
      if (query.studentId === senderId) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const response = await prisma.queryResponse.create({
      data: {
        queryId,
        content,
        senderId,
        senderRole,
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
