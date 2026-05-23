import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
  }

  const user = await prisma.userAccount.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.redirect(new URL("/pricing", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
  }

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${origin}/pricing`,
  });

  return NextResponse.redirect(portal.url);
}
