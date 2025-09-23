import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.userId;

  // Call your Flask backend with userId
  const res = await fetch(`http://localhost:5000/api/notes?userId=${userId}`);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch notes from backend" },
      { status: res.status }
    );
  }

  const notes = await res.json();
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.userId;
  const body = await req.json();

  // Include userId when sending to backend
  const res = await fetch("http://localhost:5000/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, userId }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to create note" }, { status: res.status });
  }

  const note = await res.json();
  return NextResponse.json(note);
}
