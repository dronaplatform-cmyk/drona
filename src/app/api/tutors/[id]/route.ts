import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const tutorId = params.id;

    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: {
        user: {
          select: {
            fullname: true,
            email: true, // Maybe hide email?
          },
        },
        resources: true, // Include resources
      },
    });

    if (!tutor) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json(tutor);
  } catch (error) {
    console.error("Error fetching tutor profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
