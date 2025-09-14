import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      totalAmount: data.total_amount,
      customerInfo: {
        name: data.customer_name,
        email: data.customer_email,
        phone: data.customer_phone,
        address: data.customer_address,
        city: data.customer_city,
        pincode: data.customer_pincode,
        state: data.customer_state,
      },
      items: data.items,
      paymentMethod: data.payment_method,
      paymentStatus: data.payment_status,
      status: data.order_status,
      transactionId: data.transaction_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { paymentStatus, orderStatus, transactionId } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (paymentStatus) updateData.payment_status = paymentStatus;
    if (orderStatus) updateData.order_status = orderStatus;
    if (transactionId) updateData.transaction_id = transactionId;

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Order updated successfully", data });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
