import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay credentials:", {
        keyId: !!keyId,
        keySecret: !!keySecret,
      });
      return NextResponse.json(
        { error: "Razorpay credentials not configured properly" },
        { status: 500 }
      );
    }

    // Initialize Razorpay inside the function to avoid build-time issues
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    console.log("RAZORPAY_KEY_ID:", keyId);
    console.log("RAZORPAY_KEY_SECRET:", keySecret ? "***" : "missing");

    const body = await request.json();
    const { amount, currency = "INR", receipt, customerInfo, items } = body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
      payment_capture: true,
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}
