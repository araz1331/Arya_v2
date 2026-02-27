"use server";

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

let stripeClient: Stripe | null = null;

/**
 * Singleton Stripe client for HireArya platform.
 * Subscription-focused billing with Acacia API version.
 */
function getStripeClient(): Stripe {
  if (!stripeClient) {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(STRIPE_SECRET_KEY, {
      // @ts-expect-error - Pin to 2025-01-27.acacia per platform spec; SDK types expect 2025-02-24
      apiVersion: "2025-01-27.acacia",
      typescript: true,
    });
  }
  return stripeClient;
}

export { getStripeClient };

export type StripeClient = Stripe;
