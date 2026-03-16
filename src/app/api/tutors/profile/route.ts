import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { z } from "zod";

const tutorProfileSchema = z.object({
  bio: z.string().optional(),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  hourlyRate: z.number().min(0, "Hourly rate must be positive"),
  experience: z.string().optional(),
  classesTaught: z.string().optional(),
  location: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "TUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(profile || {});
  } catch (error) {
    console.error("Error fetching tutor profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "TUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = tutorProfileSchema.parse(body);

    const profile = await prisma.tutorProfile.upsert({
      where: { userId: session.user.id },
      update: {
        bio: validatedData.bio,
        subjects: validatedData.subjects,
        hourlyRate: validatedData.hourlyRate,
        experience: validatedData.experience,
        classesTaught: validatedData.classesTaught,
        location: validatedData.location,
      },
      create: {
        userId: session.user.id,
        bio: validatedData.bio,
        subjects: validatedData.subjects,
        hourlyRate: validatedData.hourlyRate,
        experience: validatedData.experience,
        classesTaught: validatedData.classesTaught,
        location: validatedData.location,
      }
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("Profile update error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
