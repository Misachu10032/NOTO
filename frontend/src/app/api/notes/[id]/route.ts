import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    // Check session
    const session = await getServerSession(authOptions);
    if (!session?.user?.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.userId;
    const body = await req.json();

    // Forward request to backend
    const res = await fetch(`http://localhost:5000/api/notes/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, userId }),
    });

    const note = await res.json();
    return NextResponse.json(note, { status: res.status });
  } catch (err) {
    console.error("PUT /api/notes/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
