# ElevenLabs Voice Agent Phone Call Integration

## Overview

This integration enables the ElevenLabs voice agent widget on the contact page to initiate outbound phone calls via Twilio while keeping users on the website. When a user requests a phone call through the AI agent, it triggers a Twilio call from your Twilio number (+14785002626) to your target number (+15074161239).

## How It Works

1. **User Interaction**: User chats with the ElevenLabs widget on the contact page
2. **Call Request**: User asks the AI agent to call them or initiate a phone conversation
3. **Client Tool Execution**: Widget triggers the `initiatePhoneCall` client-side tool
4. **API Call**: The tool makes a POST request to `/api/call/outbound`
5. **Twilio Integration**: Backend calls Twilio API to initiate the outbound call
6. **TwiML Response**: Twilio fetches call instructions from `/api/call/twiml`
7. **Call Connection**: The call connects your Twilio number to your target phone number
8. **User Stays on Site**: Throughout this process, the user remains on your website

## Architecture

```
┌─────────────────┐
│  User Browser   │
│   (Widget)      │
└────────┬────────┘
         │ 1. User requests call
         ▼
┌─────────────────┐
│ Client Tool     │
│ initiatePhone   │
│ Call()          │
└────────┬────────┘
         │ 2. POST /api/call/outbound
         ▼
┌─────────────────┐
│  Next.js API    │
│  Route          │
└────────┬────────┘
         │ 3. Twilio API Call
         ▼
┌─────────────────┐
│  Twilio         │
│  Service        │
└────────┬────────┘
         │ 4. GET /api/call/twiml
         ▼
┌─────────────────┐
│  TwiML Route    │
│  Returns XML    │
└────────┬────────┘
         │ 5. Connect call
         ▼
┌─────────────────┐
│  Phone Call     │
│  +14785002626   │
│       ▼         │
│  +15074161239   │
└─────────────────┘
```

## Files Created/Modified

### New Files

1. **`src/app/api/call/outbound/route.ts`**
   - API endpoint to initiate Twilio outbound calls
   - Validates phone number and Twilio credentials
   - Makes authenticated request to Twilio API
   - Returns call SID and status

2. **`src/app/api/call/twiml/route.ts`**
   - TwiML endpoint that provides call instructions
   - Returns XML response telling Twilio how to handle the call
   - Connects call to ElevenLabs agent via WebSocket stream
   - Handles both GET and POST requests from Twilio

### Modified Files

1. **`src/app/[locale]/contact/contact-content.tsx`**
   - Added `elevenlabs-convai:call` event listener
   - Configured `initiatePhoneCall` client tool
   - Tool makes fetch request to `/api/call/outbound` endpoint
   - Handles success and error responses

2. **`.env.example`**
   - Added Twilio configuration variables
   - Added ElevenLabs API key
   - Added app URL for TwiML callbacks

## Environment Variables Required

Add these to your `.env.local` file (copy from `.env.example`):

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+14785002626
TARGET_PHONE_NUMBER=+15074161239

# ElevenLabs Configuration
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App URL (for TwiML callbacks)
NEXT_PUBLIC_APP_URL=thomas-nicoli.com
```

### Getting Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Verify your **Twilio Phone Number** (+14785002626) is active
4. Note: You may need to verify your target phone number in Twilio if using a trial account

### Getting ElevenLabs API Key

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)
2. Generate or copy your API key
3. Add it to your environment variables

## ElevenLabs Agent Configuration

### Step 1: Create Client Tool in ElevenLabs Dashboard

1. Navigate to your agent settings: [ElevenLabs Agent jrtHx9K8suqXV9kyjlb6](https://elevenlabs.io/app/conversational-ai/agents/jrtHx9K8suqXV9kyjlb6)
2. Go to **Tools** → **Client Tools**
3. Click **Add Client Tool**
4. Configure the tool:

   **Name:** `initiatePhoneCall`
   
   **Description:** 
   ```
   Initiates an outbound phone call to the user. Use this when the user asks to be called or wants to speak over the phone. The call will be made from our Twilio number to connect with our team.
   ```
   
   **Parameters:**
   ```json
   {
     "type": "object",
     "properties": {
       "phoneNumber": {
         "type": "string",
         "description": "The phone number to call (in E.164 format, e.g., +15551234567)"
       }
     },
     "required": ["phoneNumber"]
   }
   ```

5. **Important**: The tool name must be **exactly** `initiatePhoneCall` (case-sensitive) to match the JavaScript handler

### Step 2: Update Agent Prompt (Optional)

Add this to your agent's system prompt to guide call behavior:

```
You are a helpful assistant for Thomas Nicoli's web development services. 

When users want to discuss projects in detail or prefer a phone conversation, you can offer to initiate a call. Use the initiatePhoneCall tool when:
- User explicitly asks to be called
- User wants to discuss complex project requirements
- User prefers voice communication over text chat

Before initiating a call:
1. Confirm the user's phone number
2. Let them know the call will come from +1 (478) 500-2626
3. Explain that you're connecting them with the team

Example dialogue:
User: "Can you call me to discuss this?"
Agent: "I'd be happy to initiate a call for you! What's the best number to reach you at?"
User: "It's +1 234 567 8900"
Agent: "Perfect! I'll have our team call you at +1 234 567 8900 from our number +1 (478) 500-2626. You should receive the call within a minute. Is now a good time?"
```

## Testing

### Local Development Testing

1. **Start ngrok tunnel** (required for Twilio webhooks):
   ```bash
   ngrok http 3000
   ```

2. **Update environment variable**:
   ```bash
   NEXT_PUBLIC_APP_URL=your-ngrok-url.ngrok.app
   ```

3. **Start Next.js dev server**:
   ```bash
   npm run dev
   ```

4. **Test the widget**:
   - Go to `http://localhost:3000/en/contact`
   - Open browser console to see logs
   - Chat with the widget and request a phone call
   - Provide a phone number when asked

5. **Check logs**:
   - Browser console: `[Widget] Initiating phone call to: +1...`
   - Terminal: Twilio API responses
   - Twilio Console: Call logs and status

### Production Testing

1. **Deploy to Cloudflare Pages** (environment variables are already set in Cloudflare)

2. **Test on live site**:
   - Visit `https://thomas-nicoli.com/en/contact`
   - Interact with the widget
   - Request a phone call

3. **Monitor**:
   - Cloudflare logs
   - Twilio console for call details
   - ElevenLabs dashboard for conversation analytics

## Troubleshooting

### "Server configuration error"
- **Cause**: Missing Twilio credentials
- **Fix**: Ensure `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set in environment variables

### "Failed to initiate call"
- **Cause**: Invalid Twilio credentials or phone numbers
- **Fix**: Verify credentials in Twilio console, check phone number format (E.164)

### "TwiML callback failed"
- **Cause**: Twilio can't reach your TwiML endpoint
- **Fix**: 
  - For local dev: Ensure ngrok is running and URL is correct
  - For production: Verify `NEXT_PUBLIC_APP_URL` is correct

### Widget tool not triggered
- **Cause**: Tool name mismatch between ElevenLabs config and JavaScript
- **Fix**: Ensure tool name is **exactly** `initiatePhoneCall` in both places (case-sensitive)

### Call connects but no audio
- **Cause**: WebSocket stream configuration issue
- **Fix**: Check that ElevenLabs agent ID is correct in TwiML route

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Rotate Twilio and ElevenLabs API keys regularly
3. **Phone Number Validation**: Consider adding server-side phone number validation
4. **Rate Limiting**: Implement rate limiting on `/api/call/outbound` to prevent abuse
5. **Authentication**: Consider adding authentication for the call API endpoint

## Cost Implications

### Twilio Costs
- **Outbound calls**: ~$0.013/minute (US)
- **Phone number rental**: ~$1.00/month
- Monitor usage in [Twilio Console](https://console.twilio.com/us1/billing/usage)

### ElevenLabs Costs
- **Conversational AI**: Based on your subscription plan
- **API usage**: Check [ElevenLabs Pricing](https://elevenlabs.io/pricing)

## Next Steps

### Immediate
1. ✅ Add environment variables to `.env.local`
2. ⬜ Configure client tool in ElevenLabs dashboard
3. ⬜ Test on local development
4. ⬜ Add environment variables to Cloudflare Pages
5. ⬜ Deploy and test on production

### Optional Enhancements
- Add phone number validation with libphonenumber
- Implement call analytics and logging
- Add confirmation modal before initiating call
- Store call history in database
- Add webhook to track call status updates
- Implement call recording (with consent)
- Add SMS fallback option

## Support

For issues:
- **Twilio**: [Twilio Support](https://support.twilio.com/)
- **ElevenLabs**: [ElevenLabs Discord](https://discord.gg/elevenlabs)
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)

## References

- [ElevenLabs Widget Documentation](https://elevenlabs.io/docs/conversational-ai/widget)
- [ElevenLabs Client Tools](https://elevenlabs.io/docs/conversational-ai/customization/tools/client-tools)
- [Twilio Voice API](https://www.twilio.com/docs/voice/api)
- [Twilio TwiML](https://www.twilio.com/docs/voice/twiml)
- [ElevenLabs Twilio Integration Guide](https://elevenlabs.io/docs/conversational-ai/guides/twilio)
