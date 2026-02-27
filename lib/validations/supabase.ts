import { z } from "zod";

/** Agent config JSONB schema */
export const agentConfigSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(128000).optional(),
  tools: z.array(z.record(z.unknown())).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentConfig = z.infer<typeof agentConfigSchema>;

/** User profile schema */
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  fullName: z.string().max(255).optional(),
  avatarUrl: z.string().url().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/** Agent schema for create/update */
export const agentSchema = z.object({
  name: z.string().min(1).max(255),
  config: agentConfigSchema.optional(),
  userId: z.string().uuid(),
});

export type AgentInput = z.infer<typeof agentSchema>;

/** Billing status schema */
export const billingStatusSchema = z.enum([
  "free",
  "active",
  "past_due",
  "canceled",
  "trialing",
]);

export type BillingStatus = z.infer<typeof billingStatusSchema>;
