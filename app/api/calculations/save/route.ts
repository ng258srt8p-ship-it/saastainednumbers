import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { slug, inputs, outputs } = body;
    const { prisma } = await import("@/lib/prisma");
    await prisma.calculationRecord.create({
      data: {
        userId: session.user.id,
        calculatorSlug: slug,
        inputs: JSON.stringify(inputs),
        outputs: JSON.stringify(outputs),
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
