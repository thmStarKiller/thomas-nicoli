import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * TwiML endpoint for conference calls
 * Twilio calls this endpoint to get instructions for joining the conference
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const conferenceName = url.searchParams.get('name');
  const participant = url.searchParams.get('participant');

  console.log('[Conference TwiML] Request for:', participant, 'in conference:', conferenceName);

  if (!conferenceName) {
    return new NextResponse('Missing conference name', { status: 400 });
  }

  // Different greetings based on who's joining
  let greeting = '';
  if (participant === 'user') {
    greeting = `
      <Say voice="alice" language="en-US">
        Please wait while we connect you with Thomas. You will be joined to the call shortly.
      </Say>
    `;
  } else if (participant === 'thomas') {
    greeting = `
      <Say voice="alice" language="fr-FR">
        Bonjour Thomas, vous avez un appel depuis votre site web. 
        Un visiteur souhaite vous parler. Connexion en cours.
      </Say>
      <Pause length="1"/>
      <Say voice="alice" language="en-US">
        Hello Thomas, you have a call from your website. 
        A visitor wants to speak with you. Connecting now.
      </Say>
    `;
  }

  // TwiML to join conference
  // Both participants join the same conference room by name
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${greeting}
  <Dial>
    <Conference
      startConferenceOnEnter="true"
      endConferenceOnExit="false"
      beep="true"
      waitUrl="http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical"
    >${conferenceName}</Conference>
  </Dial>
</Response>`;

  console.log('[Conference TwiML] Generated TwiML for:', participant);

  return new NextResponse(twiml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
