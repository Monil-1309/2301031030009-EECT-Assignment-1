import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://nuhhuvwhemvaloyxojo.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGhudndoZW12YWxveWR4b2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODE3MTIsImV4cCI6MjA2Njc1NzcxMn0.wZqWS7SGoiEkdRoGQXDxFfotqG-QCCP89S7RA7ytwHY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  created_at: string
  updated_at?: string
}

export interface ContactSubmission {
  id?: string
  name: string
  email: string
  phone?: string
  message: string
  created_at?: string
}
