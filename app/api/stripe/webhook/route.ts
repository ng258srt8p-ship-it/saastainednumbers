import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const body = await req.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkout = event.data.object;
      const userId = checkout.metadata?.userId ?? checkout.client_reference_id;
      if (userId) {
        await prisma.userAccount.update({
          where: { id: userId },
          data: {
            subscriptionTier: "pro",
            subscriptionId: checkout.subscription as string,
            stripeCustomerId: checkout.customer as string,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const user = await prisma.userAccount.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (user) {
        const status = subscription.status;
        await prisma.userAccount.update({
          where: { id: user.id },
          data: {
            subscriptionTier: status === "active" || status === "trialing" ? "pro" : "free",
            subscriptionId: subscription.id,
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
