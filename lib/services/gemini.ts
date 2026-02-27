"use server";

import { GoogleGenerativeAI, type GenerateContentResult } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Gemini 3.1 Flash / 2.5 Flash - use gemini-2.5-flash for thinking capabilities
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

let geminiClient: GoogleGenerativeAI | null = null;

/**
 * Singleton Gemini client for HireArya platform.
 * Uses Gemini 3.1 Flash (or 2.5 Flash) for fast, cost-efficient AI responses with thinking.
 */
function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return geminiClient;
}

export type ThinkingLevel = "minimal" | "low" | "medium" | "high";

export interface GenerateThinkingContentOptions {
  prompt: string;
  thinkingLevel?: ThinkingLevel;
  systemInstruction?: string;
  maxOutputTokens?: number;
}

export interface ThinkingContentResult {
  text: string;
  thinkingContent?: string;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

/**
 * Generates AI content with optional thinking/reasoning output.
 * Gemini 2.5/3.1 Flash supports thinking; when SDK adds thinkingConfig, enable it here.
 */
export async function generateThinkingContent(
  options: GenerateThinkingContentOptions
): Promise<ThinkingContentResult> {
  const {
    prompt,
    systemInstruction,
    maxOutputTokens = 8192,
  } = options;

  const genAI = getGeminiClient();

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      maxOutputTokens,
    },
  });

  const chat = model.startChat({
    history: [],
    ...(systemInstruction && { systemInstruction }),
  });

  const result: GenerateContentResult = await chat.sendMessage(prompt);
  const response = result.response;

  if (!response) {
    throw new Error("No response from Gemini");
  }

  const text = response.text();
  const candidates = response.candidates ?? [];
  const firstCandidate = candidates[0];
  const content = firstCandidate?.content;

  let thinkingContent: string | undefined;
  if (content?.parts) {
    const thinkingPart = content.parts.find(
      (p) => "thought" in p && typeof (p as { thought?: string }).thought === "string"
    );
    if (thinkingPart && "thought" in thinkingPart) {
      thinkingContent = (thinkingPart as { thought: string }).thought;
    }
  }

  const usageMetadata = response.usageMetadata
    ? {
        promptTokenCount: response.usageMetadata.promptTokenCount,
        candidatesTokenCount: response.usageMetadata.candidatesTokenCount,
        totalTokenCount: response.usageMetadata.totalTokenCount,
      }
    : undefined;

  return {
    text,
    thinkingContent,
    usageMetadata,
  };
}

/**
 * Simple text generation without thinking output.
 */
export async function generateContent(prompt: string): Promise<string> {
  const result = await generateThinkingContent({
    prompt,
    thinkingLevel: "minimal",
  });
  return result.text;
}
