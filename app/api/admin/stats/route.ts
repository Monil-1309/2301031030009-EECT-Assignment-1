import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    // Get total orders count
    const { count: totalOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (ordersError) {
      console.error("Error counting orders:", ordersError);
    }

    // Get total revenue from completed orders
    const { data: revenueData, error: revenueError } = await supabase
      .from("orders")
      .select("total_amount")
      .eq("payment_status", "completed");

    if (revenueError) {
      console.error("Error calculating revenue:", revenueError);
    }

    const totalRevenue =
      revenueData?.reduce(
        (sum, order) => sum + Number(order.total_amount),
        0
      ) || 0;

    // Get pending orders count
    const { count: pendingOrders, error: pendingError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("order_status", "pending_payment");

    if (pendingError) {
      console.error("Error counting pending orders:", pendingError);
    }

    // Get total products count
    const { count: totalProducts, error: productsError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (productsError) {
      console.error("Error counting products:", productsError);
    }

    // Get recent orders for the dashboard
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from("orders")
      .select("id, customer_name, total_amount, order_status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentOrdersError) {
      console.error("Error fetching recent orders:", recentOrdersError);
    }

    return NextResponse.json({
      stats: {
        totalOrders: totalOrders || 0,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders || 0,
        totalProducts: totalProducts || 0,
      },
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    console.error("Admin stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
