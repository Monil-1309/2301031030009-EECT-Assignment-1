import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      // Update order in database as paid
      // Find order by razorpay_order_id (should be stored in your orders table as a field, e.g., razorpay_order_id)
      const { error } = await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          order_status: "confirmed",
          transaction_id: razorpay_payment_id,
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (error) {
        return NextResponse.json({
          status: "success",
          db: "update-failed",
          error: error.message,
        });
      }
      return NextResponse.json({ status: "success" });
    } else {
      // Log transaction as failed
      return NextResponse.json({ status: "failed" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
