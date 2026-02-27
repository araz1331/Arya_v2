"use server";

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.SALES_FROM_EMAIL ?? "onboarding@resend.dev";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{ id?: string; error?: string }> {
  const client = getResendClient();
  const { data, error } = await client.emails.send({
    from: FROM_EMAIL,
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo,
  });
  if (error) return { error: error.message };
  return { id: data?.id };
}
