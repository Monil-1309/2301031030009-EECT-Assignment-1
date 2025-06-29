import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Google Sheets integration
    const googleSheetsUrl =
      "https://docs.google.com/spreadsheets/d/17ozC4KHAqBOKq0B7pimU0RjA6ltcGrfPDpJgAO-Rvzk/edit?usp=sharing"

    // In a real implementation, you would use Google Sheets API or Apps Script
    // For now, we'll just log the data and return success
    console.log("Contact form submission:", {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString(),
    })

    // You would implement the actual Google Sheets integration here
    // using Google Apps Script webhook or Google Sheets API

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json({ success: false, message: "Error submitting form" }, { status: 500 })
  }
}
