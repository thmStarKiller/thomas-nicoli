import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * API endpoint to create a 3-way conference call
 * Called by the ElevenLabs widget when the agent wants to connect user with Thomas
 * 
 * Flow:
 * 1. Creates a Twilio conference room
 * 2. Calls user's phone and adds to conference
 * 3. Calls Thomas's phone and adds to conference
 * 4. Agent can moderate from widget or join conference
 */
export async function POST(request: Request) {
  try {
    const { user_phone_number } = await request.json();

    // Validate phone number
    if (!user_phone_number) {
      return NextResponse.json(
        { error: 'User phone number is required' },
        { status: 400 }
      );
    }

    // Get Twilio credentials from environment variables
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+14785002626';
    const THOMAS_PHONE_NUMBER = '+33749062192';
    const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thomas-nicoli.com';

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      console.error('[API] Missing Twilio credentials in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Twilio credentials' },
        { status: 500 }
      );
    }

    console.log('[API] Creating conference call for user:', user_phone_number);

    // Generate unique conference name
    const conferenceName = `thomas-call-${Date.now()}`;
    const baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`;
    const authHeader = 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

    // Step 1: Call user's phone and add to conference
    console.log('[API] Calling user at:', user_phone_number);
    const userCallParams = new URLSearchParams({
      To: user_phone_number,
      From: TWILIO_PHONE_NUMBER,
      Url: `${NEXT_PUBLIC_APP_URL}/api/call/conference?name=${encodeURIComponent(conferenceName)}&participant=user`,
    });

    const userCallResponse = await fetch(`${baseUrl}/Calls.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: userCallParams.toString(),
    });

    if (!userCallResponse.ok) {
      const errorText = await userCallResponse.text();
      console.error('[API] Failed to call user:', errorText);
      return NextResponse.json(
        { error: 'Failed to call user', details: errorText },
        { status: userCallResponse.status }
      );
    }

    const userCallData = await userCallResponse.json();
    console.log('[API] User call initiated:', userCallData.sid);

    // Step 2: Call Thomas's phone and add to conference
    console.log('[API] Calling Thomas at:', THOMAS_PHONE_NUMBER);
    const thomasCallParams = new URLSearchParams({
      To: THOMAS_PHONE_NUMBER,
      From: TWILIO_PHONE_NUMBER,
      Url: `${NEXT_PUBLIC_APP_URL}/api/call/conference?name=${encodeURIComponent(conferenceName)}&participant=thomas`,
    });

    const thomasCallResponse = await fetch(`${baseUrl}/Calls.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: thomasCallParams.toString(),
    });

    if (!thomasCallResponse.ok) {
      const errorText = await thomasCallResponse.text();
      console.error('[API] Failed to call Thomas:', errorText);
      return NextResponse.json(
        { error: 'Failed to call Thomas', details: errorText },
        { status: thomasCallResponse.status }
      );
    }

    const thomasCallData = await thomasCallResponse.json();
    console.log('[API] Thomas call initiated:', thomasCallData.sid);

    return NextResponse.json({
      success: true,
      message: 'Conference call created successfully',
      conference_name: conferenceName,
      user_call_sid: userCallData.sid,
      thomas_call_sid: thomasCallData.sid,
      user_phone: user_phone_number,
      thomas_phone: THOMAS_PHONE_NUMBER,
    });

  } catch (error) {
    console.error('Error initiating outbound call:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
