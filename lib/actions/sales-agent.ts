"use server";

import { generateThinkingContent } from "@/lib/services/gemini";

const SALES_SYSTEM = `You are an expert B2B sales strategist and deal-closer. You work across ALL industries—SaaS, manufacturing, healthcare, retail, professional services, etc. Your job is to help salespeople identify buyers, contact them, hold effective conversations, and close deals. Be specific, actionable, and industry-appropriate. Format output in clear sections with markdown.`;

// =============================================================================
// 1. FIND PROSPECTS - Identify ideal buyers
// =============================================================================

export interface FindProspectsInput {
  productOrService: string;
  industry: string;
  targetCompanySize: string;
  geography?: string;
  budgetSignals?: string;
}

export async function findProspects(input: FindProspectsInput): Promise<string> {
  const prompt = `Identify ideal buyers (prospects) for this product/service:

**Product/Service:** ${input.productOrService}
**Target Industry:** ${input.industry}
**Company Size:** ${input.targetCompanySize}
${input.geography ? `**Geography:** ${input.geography}` : ""}
${input.budgetSignals ? `**Budget/Spend Signals:** ${input.budgetSignals}` : ""}

Provide:
1. **Ideal Customer Profile (ICP)** - Who exactly should buy this? Job titles, company characteristics, pain points
2. **Where to Find Them** - Specific channels: LinkedIn search strings, industry events, communities, databases, trade publications
3. **Qualification Criteria** - BANT or similar: what makes a prospect ready to buy?
4. **Trigger Events** - What company changes (funding, hiring, expansion) indicate buying intent?
5. **Prospect List Ideas** - 5-7 example companies or segments to target (use realistic examples for the industry)

Keep it actionable and industry-specific. Use markdown.`;

  const result = await generateThinkingContent({
    prompt,
    systemInstruction: SALES_SYSTEM,
    maxOutputTokens: 2048,
  });
  return result.text;
}

// =============================================================================
// 2. OUTREACH - Contact prospects
// =============================================================================

export interface OutreachInput {
  productOrService: string;
  prospectContext: string;
  channel: "email" | "linkedin" | "cold-call";
  tone?: "professional" | "casual" | "urgent";
}

export async function generateOutreach(input: OutreachInput): Promise<string> {
  const channelTips = {
    email: "Keep under 100 words. Subject line matters. One clear CTA.",
    linkedin: "Shorter than email. Conversational. No hard sell. Connection request + follow-up.",
    "cold-call": "Opening script (15-30 sec). Handle gatekeeper. One key question to qualify.",
  };

  const prompt = `Generate a cold outreach message to contact a prospect.

**Product/Service:** ${input.productOrService}
**Prospect Context:** ${input.prospectContext}
**Channel:** ${input.channel}
**Tone:** ${input.tone || "professional"}

Channel-specific tips: ${channelTips[input.channel]}

Provide:
1. **Subject/Opening** (if email/LinkedIn)
2. **Message Body** - Personalized, creates curiosity, low-friction CTA
3. **Follow-up** - What to say if no response (1-2 lines)
4. **Objection Pre-handling** - One common objection and a brief response

Make it feel human, not templated. Industry-appropriate.`;

  const result = await generateThinkingContent({
    prompt,
    systemInstruction: SALES_SYSTEM,
    maxOutputTokens: 1024,
  });
  return result.text;
}

// =============================================================================
// 3. CONVERSATION - Hold communication, handle objections
// =============================================================================

export interface ConversationInput {
  productOrService: string;
  prospectObjection: string;
  stage: "discovery" | "demo" | "proposal" | "negotiation";
}

export async function handleConversation(input: ConversationInput): Promise<string> {
  const prompt = `A prospect said: "${input.prospectObjection}"

**Product/Service:** ${input.productOrService}
**Sales Stage:** ${input.stage}

Provide:
1. **Empathy First** - Acknowledge their concern (1 sentence)
2. **Response** - How to address the objection (2-3 sentences)
3. **Redirect** - A question to move the conversation forward
4. **If They Push Back** - A backup response
5. **Discovery Question** - One question to uncover deeper needs

Be consultative, not pushy. Industry-appropriate.`;

  const result = await generateThinkingContent({
    prompt,
    systemInstruction: SALES_SYSTEM,
    maxOutputTokens: 1024,
  });
  return result.text;
}

// =============================================================================
// 4. CLOSE - Close deals
// =============================================================================

export interface CloseInput {
  productOrService: string;
  dealContext: string;
  prospectHesitation?: string;
}

export async function closeDeal(input: CloseInput): Promise<string> {
  const prompt = `Help close this deal.

**Product/Service:** ${input.productOrService}
**Deal Context:** ${input.dealContext}
${input.prospectHesitation ? `**Prospect Hesitation:** ${input.prospectHesitation}` : ""}

Provide:
1. **Closing Technique** - Which close to use (assumptive, summary, urgency, etc.) and why
2. **Closing Script** - Exact words to say (2-4 sentences)
3. **Handle "I need to think about it"** - Response + next step
4. **Handle "We need to check with [other stakeholder]"** - How to get commitment
5. **Next Step** - Clear, specific ask to move to close

Be direct but not aggressive. Create urgency without pressure.`;

  const result = await generateThinkingContent({
    prompt,
    systemInstruction: SALES_SYSTEM,
    maxOutputTokens: 1536,
  });
  return result.text;
}
