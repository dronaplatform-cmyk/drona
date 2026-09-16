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

    const { searchParams } = new URL(req.url);
    const context = searchParams.get("context");

    if (!context) {
      return NextResponse.json({ error: "Context is required" }, { status: 400 });
    }

    const userRole = session.user.role;
    let recipients: any[] = [];

    if (userRole === "TUTOR") {
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: session.user.id },
      });

      if (!tutorProfile) {
        return NextResponse.json({ error: "Tutor profile not found" }, { status: 404 });
      }

      if (context === "TUTOR_STUDENT") {
        // Fetch students taught by this tutor
        recipients = await prisma.student.findMany({
          where: {
            classes: {
              some: {
                tutorId: tutorProfile.id,
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
        });
      } else if (context === "TUTOR_PARENT") {
        // Fetch parents of students taught by this tutor
        // This is a bit more complex, need to go through students
        const students = await prisma.student.findMany({
          where: {
            classes: {
              some: {
                tutorId: tutorProfile.id,
              },
            },
          },
          include: {
            parent: {
              select: {
                id: true,
                fullname: true,
              },
            },
          },
        });
        
        // Deduplicate parents
        const uniqueParents = new Map();
        students.forEach(s => {
          if (s.parent) {
            uniqueParents.set(s.parent.id, s.parent);
          }
        });
        recipients = Array.from(uniqueParents.values());
      }
    } else if (userRole === "PARENT") {
      if (context === "TUTOR_PARENT") {
        // Fetch tutors of children
        const students = await prisma.student.findMany({
          where: { parentId: session.user.id },
          include: {
            classes: {
              include: {
                tutor: {
                  include: {
                    user: {
                      select: {
                        fullname: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const uniqueTutors = new Map();
        students.forEach(s => {
          s.classes.forEach(c => {
            if (c.tutor) {
              uniqueTutors.set(c.tutor.id, {
                id: c.tutor.id,
                name: c.tutor.user.fullname,
              });
            }
          });
        });
        recipients = Array.from(uniqueTutors.values());
      }
    } else if (userRole === "STUDENT") {
      if (context === "TUTOR_STUDENT") {
        // Fetch tutors teaching this student
        const student = await prisma.student.findUnique({
          where: { id: session.user.id },
          include: {
            classes: {
              include: {
                tutor: {
                  include: {
                    user: {
                      select: {
                        fullname: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (student) {
          const uniqueTutors = new Map();
          student.classes.forEach((c) => {
            if (c.tutor) {
              uniqueTutors.set(c.tutor.id, {
                id: c.tutor.id,
                name: c.tutor.user.fullname,
              });
            }
          });
          recipients = Array.from(uniqueTutors.values());
        }
      }
    }

    return NextResponse.json(recipients);
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
