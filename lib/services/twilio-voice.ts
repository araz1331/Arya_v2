import twilio from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!twilioClient) {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      throw new Error("TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be configured");
    }
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
}

/**
 * In-memory store for call scripts. Twilio requests TwiML when call connects.
 * Production: use Redis or DB.
 */
const callScriptStore = new Map<string, { script: string; createdAt: number }>();
const SCRIPT_TTL_MS = 10 * 60 * 1000; // 10 min

function storeCallScript(script: string): string {
  const id = crypto.randomUUID();
  callScriptStore.set(id, { script, createdAt: Date.now() });
  return id;
}

export function getCallScript(id: string): string | null {
  const entry = callScriptStore.get(id);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > SCRIPT_TTL_MS) {
    callScriptStore.delete(id);
    return null;
  }
  return entry.script;
}

export interface InitiateCallInput {
  to: string;
  script: string;
}

export async function initiateOutboundCall(input: InitiateCallInput): Promise<{ sid?: string; error?: string }> {
  if (!TWILIO_PHONE_NUMBER) {
    return { error: "TWILIO_PHONE_NUMBER not configured" };
  }

  const scriptId = storeCallScript(input.script);
  const twimlUrl = `${APP_URL}/api/twilio/voice/outbound?id=${scriptId}`;

  const client = getTwilioClient();
  try {
    const call = await client.calls.create({
      to: input.to,
      from: TWILIO_PHONE_NUMBER,
      url: twimlUrl,
    });
    return { sid: call.sid };
  } catch (err) {
    callScriptStore.delete(scriptId);
    return {
      error: err instanceof Error ? err.message : "Failed to initiate call",
    };
  }
}
