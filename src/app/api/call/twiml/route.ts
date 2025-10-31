import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * TwiML endpoint that provides call instructions to Twilio
 * This tells Twilio what to do when the call is answered
 */
export async function POST() {
  // TwiML response that connects the call to ElevenLabs agent
  const ELEVENLABS_AGENT_ID = 'jrtHx9K8suqXV9kyjlb6';
  
  // Get the host from environment or construct it
  const host = process.env.NEXT_PUBLIC_APP_URL || 'thomas-nicoli.com';
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting you to Thomas Nicoli. Please wait.</Say>
  <Connect>
    <Stream url="wss://${host}/api/call/media-stream">
      <Parameter name="agent_id" value="${ELEVENLABS_AGENT_ID}" />
    </Stream>
  </Connect>
</Response>`;

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

// Handle GET requests as well (Twilio may send GET for initial requests)
export async function GET() {
  return POST();
}
