"use server";

import { generateThinkingContent } from "@/lib/services/gemini";
import { sendEmail } from "@/lib/services/email";
import { initiateOutboundCall } from "@/lib/services/twilio-voice";
import { logEvent } from "@/lib/services/reporting";

// =============================================================================
// AI SALES EMAIL - Generate + Send
// =============================================================================

export interface SendSalesEmailInput {
  to: string;
  prospectName?: string;
  prospectContext?: string;
  productOrService: string;
  subject?: string;
}

export async function sendSalesEmail(input: SendSalesEmailInput): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  preview?: string;
}> {
  const prompt = `Write a personalized cold sales email for this prospect.

**Product/Service:** ${input.productOrService}
**Prospect Email:** ${input.to}
${input.prospectName ? `**Prospect Name:** ${input.prospectName}` : ""}
${input.prospectContext ? `**Prospect Context:** ${input.prospectContext}` : ""}

Requirements:
- Subject line (compelling, under 60 chars)
- Body: 150-250 words, personal, creates curiosity, one clear CTA
- Professional but warm
- No generic templates
- HTML format with <p> tags

Output format:
SUBJECT: [subject line]
BODY:
[HTML body]`;

  const result = await generateThinkingContent({
    prompt,
    maxOutputTokens: 1024,
  });

  const text = result.text;
  const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
  const bodyMatch = text.match(/BODY:\s*([\s\S]+)/i);

  const subject = input.subject ?? (subjectMatch?.[1]?.trim() || "Quick question");
  const html = bodyMatch?.[1]?.trim() || text.replace(/SUBJECT:[\s\S]*?BODY:/i, "").trim();

  if (!html) {
    return { success: false, error: "Could not generate email content" };
  }

  const { id, error } = await sendEmail({
    to: input.to,
    subject,
    html: `<div style="font-family: sans-serif; line-height: 1.6;">${html}</div>`,
  });

  if (error) {
    return { success: false, error, preview: `Subject: ${subject}\n\n${html.slice(0, 500)}...` };
  }

  await logEvent("sales_email_sent", "sales", {
    to: input.to,
    subject,
    prospectName: input.prospectName,
    messageId: id,
  });

  return { success: true, messageId: id, preview: `Subject: ${subject}\n\nSent to ${input.to}` };
}

// =============================================================================
// AI SALES CALL - Generate script + Initiate Twilio call
// =============================================================================

export interface InitiateSalesCallInput {
  to: string;
  productOrService: string;
  prospectContext?: string;
  callDuration?: "short" | "medium" | "long";
}

export async function initiateSalesCall(input: InitiateSalesCallInput): Promise<{
  success: boolean;
  callSid?: string;
  error?: string;
  script?: string;
}> {
  const durationGuide = {
    short: "30-45 seconds. Opening hook, one value prop, soft CTA.",
    medium: "60-90 seconds. Hook, 2 value props, discovery question, CTA.",
    long: "90-120 seconds. Full pitch, objection pre-handling, CTA.",
  };

  const prompt = `Write a cold sales call script to be read by an AI voice. The prospect will hear this.

**Product/Service:** ${input.productOrService}
**Prospect Context:** ${input.prospectContext || "Decision maker at target company"}

**Duration:** ${durationGuide[input.callDuration || "medium"]}

Requirements:
- Natural, conversational tone (spoken, not written)
- No bullet points or markdown - plain flowing text
- Start with a strong hook (their pain or opportunity)
- Create curiosity, not pressure
- End with a low-friction CTA (e.g. "Can I send you a short demo?" or "Worth a 15-min call next week?")
- No "um", "like", filler words
- Output ONLY the script text, nothing else`;

  const result = await generateThinkingContent({
    prompt,
    maxOutputTokens: 512,
  });

  const script = result.text.trim().replace(/\n+/g, " ");

  const { sid, error } = await initiateOutboundCall({
    to: input.to,
    script,
  });

  if (error) {
    return { success: false, error, script };
  }

  await logEvent("sales_call_made", "sales", {
    to: input.to,
    callSid: sid,
    duration: input.callDuration,
    scriptPreview: script.slice(0, 200),
  });

  return { success: true, callSid: sid, script };
}
