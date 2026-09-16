// redundant
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // You have the data instantly!
  console.log(session.user.id); 
  console.log(session.user.role);

  return NextResponse.json({ message: "Success" });
}