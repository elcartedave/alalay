import { main } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide valid message data" },
        { status: 400 }
      );
    }

    const message = await main(body);
    return NextResponse.json({ success: true, message });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
