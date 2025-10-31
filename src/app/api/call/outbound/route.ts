import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * API endpoint to initiate outbound calls via Twilio
 * Called by ElevenLabs widget client tool
 */
export async function POST(request: Request) {
  try {
    const { to_number } = await request.json();

    // Validate phone number
    if (!to_number) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Get Twilio credentials from environment variables
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+14785002626';
    const TARGET_PHONE_NUMBER = process.env.TARGET_PHONE_NUMBER || '+15074161239';

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      console.error('Missing Twilio credentials in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Twilio API call using fetch (Edge Runtime compatible)
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;
    
    const formData = new URLSearchParams({
      To: TARGET_PHONE_NUMBER, // Your phone number to receive the call
      From: TWILIO_PHONE_NUMBER, // Twilio phone number
      Url: `https://${request.headers.get('host')}/api/call/twiml`, // TwiML endpoint
    });

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twilio API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to initiate call', details: errorText },
        { status: response.status }
      );
    }

    const callData = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Call initiated successfully',
      call_sid: callData.sid,
      status: callData.status,
    });

  } catch (error) {
    console.error('Error initiating outbound call:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
