import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {

        const { email } = await req.json();
        const userExist = await prisma.user.findUnique({ where: { email } });
        if(userExist){

           return NextResponse.json({ exists: true, user: userExist }, { status: 200 });
        } else {
          return NextResponse.json({ exists: false }, { status: 200 });
        }


    } catch (error) {
console.error('Error checking user existence:', error);
        return NextResponse.json({ error: 'Error checking user existence : : : Internal Server Error' }, { status: 500 });
    }
}