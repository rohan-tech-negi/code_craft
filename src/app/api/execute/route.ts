import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { language, version, filename, code } = await req.json();

    // Token is kept server-side — no NEXT_PUBLIC_ needed
    const apiToken = process.env.GLOT_API_TOKEN || "";

    if (!apiToken) {
      return NextResponse.json(
        { error: "GLOT_API_TOKEN is not configured on the server." },
        { status: 500 }
      );
    }

    const glotRes = await fetch(
      `https://run.glot.io/languages/${language}/versions/${version}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`,
        },
        body: JSON.stringify({
          files: [{ name: filename, content: code }],
        }),
      }
    );

    const data = await glotRes.json();

    if (!glotRes.ok) {
      return NextResponse.json(
        { error: data?.message || `Glot.io error: ${glotRes.status}` },
        { status: glotRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Execute API route error:", err);
    return NextResponse.json(
      { error: "Internal server error during code execution." },
      { status: 500 }
    );
  }
}
