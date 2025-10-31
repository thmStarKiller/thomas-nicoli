import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * TwiML endpoint that provides call instructions to Twilio
 * This tells Twilio to forward the call to Thomas's phone number
 */
export async function POST(request: Request) {
  // For outbound calls initiated from the website, we want to:
  // 1. Say a greeting to Thomas
  // 2. Provide information about who's calling from the website
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="fr-FR">
    Bonjour Thomas, vous recevez un appel depuis votre site web thomas-nicoli.com. 
    Un visiteur souhaite vous parler. Connexion en cours.
  </Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">
    This is a call from your website. A visitor wants to speak with you.
  </Say>
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
