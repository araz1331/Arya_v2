import { NextRequest, NextResponse } from "next/server";
import { getCallScript } from "@/lib/services/twilio-voice";

/**
 * Twilio requests this URL when outbound call connects.
 * Returns TwiML to play the AI-generated script.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Error: Missing script.</Say><Hangup/></Response>',
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  const script = getCallScript(id);
  if (!script) {
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response><Say>This call could not be completed.</Say><Hangup/></Response>',
      { headers: { "Content-Type": "text/xml" } }
    );
  }

  // Twilio <Say> has 4000 char limit. Escape XML entities.
  const escapeXml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  const safeScript = escapeXml(script).slice(0, 3900);

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">${safeScript}</Say>
  <Pause length="2"/>
  <Say voice="alice" language="en-US">Thank you for your time. Goodbye.</Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
