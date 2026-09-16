import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { razorpay } from "@/src/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorId, amount } = await req.json();

    if (!tutorId || !amount) {
      return NextResponse.json({ error: "Missing tutorId or amount" }, { status: 400 });
    }

    // Optional: Verify tutor exists and rate matches
    /*
    const tutor = await prisma.tutorProfile.findUnique({ where: { userId: tutorId } });
    if (!tutor) return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    */

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
