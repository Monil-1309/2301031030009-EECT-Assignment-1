import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getCategoriesList() {
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("name", { ascending: true });
  if (error) return [];
  return data?.map((c) => c.name) || [];
}
