"use server";

import { generateThinkingContent } from "@/lib/services/gemini";

export interface SalesHunterInput {
  roleTitle: string;
  experienceLevel: string;
  industry: string;
  companySize: string;
  keySkills: string;
}

export async function huntSalesCandidates(input: SalesHunterInput): Promise<string> {
  const systemInstruction = `You are an expert sales recruiter and candidate hunter for HireArya. 
Your job is to help recruiters find and engage top sales talent. 
Be specific, actionable, and professional. Format output in clear sections with markdown.`;

  const prompt = `As a sales candidate hunter, generate a comprehensive candidate sourcing brief for the following role:

**Role:** ${input.roleTitle}
**Experience Level:** ${input.experienceLevel}
**Industry:** ${input.industry}
**Company Size:** ${input.companySize}
**Key Skills Required:** ${input.keySkills}

Provide:
1. **Ideal Candidate Profile** - 3-4 bullet points describing the perfect candidate
2. **Where to Find Them** - Specific sourcing channels, LinkedIn search strings, job boards, or communities
3. **Outreach Message Template** - A short, personalized cold outreach message (2-3 sentences) that would resonate with passive sales candidates
4. **Red Flags to Avoid** - 2-3 warning signs when screening candidates
5. **Interview Questions** - 3-4 questions to assess sales aptitude and fit

Keep it concise and actionable. Use markdown formatting.`;

  const result = await generateThinkingContent({
    prompt,
    systemInstruction,
    maxOutputTokens: 2048,
  });

  return result.text;
}

export async function generateOutreachMessage(
  roleTitle: string,
  companyName: string,
  candidateContext?: string
): Promise<string> {
  const prompt = `Write a compelling, personalized cold outreach message (2-3 sentences) for a sales recruiter to send to a potential candidate.

Role: ${roleTitle}
Company: ${companyName}
${candidateContext ? `Candidate context: ${candidateContext}` : ""}

Requirements:
- Personal, not generic
- Create curiosity without overselling
- Include a clear, low-friction call-to-action
- Professional but warm tone`;

  const result = await generateThinkingContent({
    prompt,
    maxOutputTokens: 512,
  });

  return result.text;
}
