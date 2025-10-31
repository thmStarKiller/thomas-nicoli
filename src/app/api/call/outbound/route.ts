import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * API endpoint to initiate outbound phone calls via ElevenLabs + Twilio
 * Called by the ElevenLabs widget when the agent wants to make a call
 * Uses ElevenLabs' Conversational AI API to handle the full conversation
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

    // Get ElevenLabs credentials from environment variables
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
    const AGENT_ID = 'jrtHx9K8suqXV9kyjlb6';
    
    // Get agent phone number ID - you need to add this to your env vars
    // Find it in ElevenLabs Dashboard > Agent > Phone Numbers
    const AGENT_PHONE_NUMBER_ID = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID;

    if (!ELEVENLABS_API_KEY) {
      console.error('Missing ElevenLabs API key in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    if (!AGENT_PHONE_NUMBER_ID) {
      console.error('Missing ELEVENLABS_AGENT_PHONE_NUMBER_ID in environment variables');
      return NextResponse.json(
        { 
          error: 'Server configuration error: Missing agent phone number ID',
          details: 'Please add ELEVENLABS_AGENT_PHONE_NUMBER_ID to your environment variables'
        },
        { status: 500 }
      );
    }

    console.log('[API] Initiating ElevenLabs call to:', to_number);

    // Use ElevenLabs' Twilio outbound call API
    // This will make the call AND connect the ElevenLabs agent to handle the conversation
    const response = await fetch(
      'https://api.elevenlabs.io/v1/convai/twilio/outbound-call',
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: AGENT_ID,
          agent_phone_number_id: AGENT_PHONE_NUMBER_ID,
          to_number: to_number,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to initiate call', details: errorData },
        { status: response.status }
      );
    }

    const callData = await response.json();
    console.log('[API] Call initiated successfully:', callData);

    return NextResponse.json({
      success: true,
      message: callData.message || 'Call initiated successfully',
      conversation_id: callData.conversation_id,
      call_sid: callData.callSid,
    });

  } catch (error) {
    console.error('Error initiating outbound call:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
