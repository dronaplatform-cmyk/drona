import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { secretKey, fullname, email, password, phoneNumber } = await req.json();

    if (secretKey !== process.env.NEXTAUTH_SECRET) {
        return NextResponse.json({ error: "Invalid setup sequence key" }, { status: 403 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
        return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
        data: {
            fullname: String(fullname),
            email: String(email),
            password: hashedPassword,
            role: "ADMIN",
            phoneNumber: String(phoneNumber),
            username: String(email).split('@')[0],
        }
    });

    return NextResponse.json({ message: "Admin created successfully", adminId: newAdmin.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create admin";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
