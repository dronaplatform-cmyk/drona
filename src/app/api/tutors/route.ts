import prisma from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const subject = searchParams.get("subject");
    const location = searchParams.get("location");
    const classesTaught = searchParams.get("classesTaught");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const rating = searchParams.get("rating");

    const whereClause: Prisma.TutorProfileWhereInput = {};

    if (query) {
      whereClause.OR = [
        { user: { fullname: { contains: query, mode: "insensitive" } } },
        { bio: { contains: query, mode: "insensitive" } },
      ];
    }

    if (subject) {
      const subjectsArray = subject.split(',').map(s => s.trim()).filter(Boolean);
      if (subjectsArray.length > 0) {
        whereClause.subjects = {
          hasSome: subjectsArray,
        };
      }
    }

    if (location) {
      whereClause.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (classesTaught) {
      const classes = classesTaught.split(',');
      if (classes.length > 1) {
        whereClause.OR = classes.map(c => ({
          classesTaught: { contains: c.trim(), mode: 'insensitive' }
        }));
      } else {
        whereClause.classesTaught = {
          contains: classesTaught,
          mode: "insensitive",
        };
      }
    }

    if (minPrice || maxPrice) {
      whereClause.hourlyRate = {};
      if (minPrice) whereClause.hourlyRate.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.hourlyRate.lte = parseFloat(maxPrice);
    }

    if (rating) {
        whereClause.rating = {
            gte: parseFloat(rating)
        };
    }

    const tutors = await prisma.tutorProfile.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            fullname: true,
            phoneNumber: true,
            profileImage: true, // Select profileImage
            image: true,
          },
        },
      },
    });

    return NextResponse.json(tutors);
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
