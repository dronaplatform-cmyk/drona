import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username")?.toLowerCase();

    if (!username) {
      return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { username },
      select: { id: true }
    });

    return NextResponse.json({ exists: !!student });
  } catch (error) {
    console.error("Error checking username availability:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
