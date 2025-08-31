import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderId = formData.get("orderId") as string;
    const transactionId = formData.get("transactionId") as string;
    const paymentProof = formData.get("paymentProof") as File | null;

    if (!orderId || !transactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if order exists
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let proofUrl = null;

    // Upload payment proof if provided
    if (paymentProof) {
      const fileExt = paymentProof.name.split(".").pop();
      const fileName = `payment-proof-${orderId}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, paymentProof);

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(fileName);
        proofUrl = urlData.publicUrl;
      }
    }

    // Update order with payment details
    const updateData: any = {
      transaction_id: transactionId,
      payment_status: "verification_pending",
      order_status: "payment_submitted",
      updated_at: new Date().toISOString(),
    };

    if (proofUrl) {
      updateData.payment_proof_url = proofUrl;
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order:", updateError);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    // Send notification to admin (optional)
    // await notifyAdminNewPayment(orderId, transactionId);

    return NextResponse.json({
      message: "Payment proof submitted successfully",
      orderId,
      status: "verification_pending",
    });
  } catch (error) {
    console.error("Error verifying UPI payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
