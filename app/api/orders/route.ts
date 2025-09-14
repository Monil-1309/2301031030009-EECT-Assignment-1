import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Debug: Log incoming request body
    console.log("[ORDER API] Incoming POST body:", JSON.stringify(body));
    const { items, customerInfo, totalAmount, paymentMethod } = body;

    // Generate order ID
    const orderId = `ELX${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Create order in database
    const orderData = {
      id: orderId,
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      customer_city: customerInfo.city,
      customer_pincode: customerInfo.pincode,
      customer_state: customerInfo.state,
      items: items,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending_payment",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Debug: Log orderData before insert
    console.log("Order data to insert:", orderData);

    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      // Debug: Log full error object
      console.error("Full error object:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "Failed to create order",
          details: error.message,
          supabaseError: error,
        },
        { status: 500 }
      );
    }

    // Debug: Log successful insert
    console.log("Order inserted successfully:", data);

    // Send order confirmation email (optional)
    // await sendOrderConfirmationEmail(orderData);

    return NextResponse.json({
      id: data.id,
      totalAmount: data.total_amount,
      customerInfo: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone,
      },
      items: data.items,
      status: data.order_status,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Orders API" });
}
