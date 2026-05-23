import { auth } from "@/lib/auth";
import { stripe, PRO_PRICE_ID } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"));
  }

  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    customer_email: session.user.email ?? undefined,
    client_reference_id: session.user.id,
    metadata: { userId: session.user.id },
    success_url: `${origin}/pricing?success=true`,
    cancel_url: `${origin}/pricing?canceled=true`,
  });

  if (!checkout.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }

  return NextResponse.redirect(checkout.url);
}
