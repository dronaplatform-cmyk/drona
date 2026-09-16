import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let studentId: string | undefined;

    // Determine context: Direct Student Login vs Parent Switch
    if (session.user.role === "STUDENT") {
      studentId = session.user.id;
    } else if (session.user.role === "PARENT" && session.user.activeStudentId) {
      studentId = session.user.activeStudentId;
    } else {
      return NextResponse.json({ error: "Unauthorized Context" }, { status: 403 });
    }

    if (!studentId) {
       return NextResponse.json({ error: "Student ID not found" }, { status: 404 });
    }

    // Fetch Student Data (Homework, Classes)
    const studentData = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        age: true,
        school: true,
        aspirations: true,
        interests: true,
        homeworks: {
          where: { isCompleted: false },
          orderBy: { dueDate: 'asc' },
          take: 5,
          include: {
            class: {
              include: {
                tutor: {
                  include: { user: { select: { fullname: true } } }
                }
              }
            }
          }
        },
        classes: {
          where: { 
            status: 'SCHEDULED',
            scheduledAt: { 
              gte: new Date(new Date().setHours(0, 0, 0, 0)) 
            }
          },
          orderBy: { scheduledAt: 'asc' },
          take: 5,
          include: {
            tutor: {
              include: { user: { select: { fullname: true } } }
            },
            resources: true // Including resources as frontend uses it
          }
        }
      }
    });

    if (!studentData) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Structure response to match frontend StudentData interface
    const response = {
        student: {
            id: studentData.id,
            name: studentData.name,
            age: studentData.age,
            school: studentData.school,
            aspirations: studentData.aspirations,
            interests: studentData.interests
        },
        homeworks: studentData.homeworks,
        classes: studentData.classes
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
