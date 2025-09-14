import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    // Save razorpay_order_id to the latest order (assumes order just created in /api/orders)
    // Find the latest order for this customer with payment_status 'pending' and no razorpay_order_id
    const { data: latestOrder, error: fetchError } = await supabase
      .from("orders")
      .select("id")
      .eq("customer_email", customerInfo.email)
      .eq("payment_status", "pending")
      .is("razorpay_order_id", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!fetchError && latestOrder) {
      await supabase
        .from("orders")
        .update({ razorpay_order_id: order.id })
        .eq("id", latestOrder.id);
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message, details: error },
      { status: 500 }
    );
  }
}
