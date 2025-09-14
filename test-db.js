import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nuhhuvwhemvaloyxojo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGhudndoZW12YWxveWR4b2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODE3MTIsImV4cCI6MjA2Njc1NzcxMn0.wZqWS7SGoiEkdRoGQXDxFfotqG-QCCP89S7RA7ytwHY";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
  console.log("Testing Supabase connection...");

  // Test 1: Check if we can connect
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.log("❌ Orders table doesn't exist or has permission issues:");
      console.log("Error code:", error.code);
      console.log("Error message:", error.message);

      if (
        error.code === "PGRST116" ||
        error.message.includes("does not exist")
      ) {
        console.log("🔍 The 'orders' table does not exist in your database");
        console.log("📋 You need to create the orders table first");
      }
    } else {
      console.log("✅ Orders table exists and accessible");
      console.log("Number of orders:", data);
    }
  } catch (err) {
    console.log("❌ Database connection failed:", err);
  }

  // Test 2: Check products table
  try {
    const { data, error } = await supabase
      .from("products")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.log("❌ Products table doesn't exist or has permission issues:");
      console.log("Error:", error.message);
    } else {
      console.log("✅ Products table exists and accessible");
      console.log("Number of products:", data);
    }
  } catch (err) {
    console.log("❌ Products table check failed:", err);
  }

  // Test 3: List all tables (this might not work with RLS)
  try {
    const { data, error } = await supabase.rpc("get_schema_tables");
    if (data) {
      console.log("📋 Available tables:", data);
    }
  } catch (err) {
    console.log("ℹ️  Could not list tables (this is normal)");
  }
}

testDatabase();
