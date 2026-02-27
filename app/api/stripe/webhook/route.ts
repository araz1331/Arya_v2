"use server";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeClient } from "@/lib/services/stripe";
import {
  stripeWebhookEventTypeSchema,
  stripeEventSchema,
  type StripeWebhookEventType,
} from "@/lib/validations";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Stripe webhook route - MUST use raw body for signature verification.
 * Next.js App Router does not parse body by default; req.text() returns raw string.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch (err) {
    console.error("Webhook: Failed to read request body", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const signatureHeader = (await headers()).get("stripe-signature");
  if (!signatureHeader) {
    return NextResponse.json(
      { error: "Missing Stripe-Signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signatureHeader,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Zod validation of event structure
  const parseResult = stripeEventSchema.safeParse({
    id: event.id,
    object: event.object,
    type: event.type,
    data: event.data,
    livemode: event.livemode,
    created: event.created,
  });

  if (!parseResult.success) {
    console.warn("Webhook: Event failed Zod validation", parseResult.error.flatten());
    // Still process - Stripe may send new event types; we validate known ones
  }

  const eventType = event.type as StripeWebhookEventType;
  const knownTypes = stripeWebhookEventTypeSchema.options;

  if (!knownTypes.includes(eventType)) {
    console.log(`Webhook: Unhandled event type: ${eventType}`);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Webhook: No handler for ${eventType}`);
    }
  } catch (err) {
    console.error(`Webhook: Error handling ${eventType}`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleSubscriptionChange(_subscription: Stripe.Subscription): Promise<void> {
  // TODO: Sync subscription status to billing_status table
}

async function handleSubscriptionDeleted(_subscription: Stripe.Subscription): Promise<void> {
  // TODO: Update billing_status to canceled
}

async function handleInvoicePaid(_invoice: Stripe.Invoice): Promise<void> {
  // TODO: Record payment, extend access
}

async function handleInvoicePaymentFailed(_invoice: Stripe.Invoice): Promise<void> {
  // TODO: Notify user, update billing_status to past_due
}

async function handleCheckoutCompleted(_session: Stripe.Checkout.Session): Promise<void> {
  // TODO: Activate subscription for customer
}

async function handlePaymentIntentSucceeded(_paymentIntent: Stripe.PaymentIntent): Promise<void> {
  // TODO: Record one-time payment if applicable
}

async function handlePaymentIntentFailed(_paymentIntent: Stripe.PaymentIntent): Promise<void> {
  // TODO: Log failure, notify
}
