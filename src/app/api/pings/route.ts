import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
export async function GET() {

    const [tutors,parents,students] = 
    [
        await prisma.user.count({
            where: {
                role: "TUTOR"
            }
        }),
        await prisma.user.count({
            where: {
                role: "PARENT"
            }
        }),
        await prisma.student.count()
    ]
    
    ;
    return NextResponse.json({tutors,parents,students, total_users: tutors+parents+students});
}