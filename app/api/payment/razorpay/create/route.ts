import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
  console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);
  try {
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
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }
}
