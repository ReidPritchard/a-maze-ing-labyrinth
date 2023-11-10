import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    name: "Labyrinth",
  };

  return NextResponse.json({ ...data });
}
