import { z } from "zod";

/** Stripe webhook event types for subscription billing */
export const stripeWebhookEventTypeSchema = z.enum([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
  "checkout.session.completed",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
]);

export type StripeWebhookEventType = z.infer<typeof stripeWebhookEventTypeSchema>;

/** Stripe event payload schema for validation */
export const stripeEventSchema = z.object({
  id: z.string(),
  object: z.literal("event"),
  type: stripeWebhookEventTypeSchema,
  data: z.object({
    object: z.record(z.unknown()),
  }),
  livemode: z.boolean(),
  created: z.number(),
});

export type StripeEventPayload = z.infer<typeof stripeEventSchema>;

/** Subscription object schema (subset) */
export const stripeSubscriptionSchema = z.object({
  id: z.string(),
  customer: z.string(),
  status: z.enum(["active", "canceled", "incomplete", "incomplete_expired", "past_due", "trialing", "unpaid"]),
  current_period_end: z.number(),
  cancel_at_period_end: z.boolean().optional(),
});

export type StripeSubscriptionPayload = z.infer<typeof stripeSubscriptionSchema>;
