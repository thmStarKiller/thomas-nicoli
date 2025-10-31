# Phone Call Integration - ElevenLabs + Twilio# ElevenLabs Voice Agent Phone Call Integration



## Architecture Overview## Overview



This integration allows website visitors to trigger phone calls through the ElevenLabs voice agent widget. The system uses **ElevenLabs' built-in Twilio integration** to handle both the call AND the conversation.This integration enables the ElevenLabs voice agent widget on the contact page to initiate outbound phone calls via Twilio while keeping users on the website. When a user requests a phone call through the AI agent, it triggers a Twilio call from your Twilio number (+14785002626) to your target number (+15074161239).



**Key Components:**## How It Works

1. **ElevenLabs Conversational AI**: Provides the voice agent and manages the entire conversation

2. **Twilio Phone Number**: Enables outbound phone calling (+14785002626)1. **User Interaction**: User chats with the ElevenLabs widget on the contact page

3. **Client Tool**: JavaScript integration that triggers calls from the widget2. **Call Request**: User asks the AI agent to call them or initiate a phone conversation

4. **Next.js API Route**: Proxies requests to ElevenLabs API3. **Client Tool Execution**: Widget triggers the `initiatePhoneCall` client-side tool

4. **API Call**: The tool makes a POST request to `/api/call/outbound`

## How It Works5. **Twilio Integration**: Backend calls Twilio API to initiate the outbound call

6. **TwiML Response**: Twilio fetches call instructions from `/api/call/twiml`

```7. **Call Connection**: The call connects your Twilio number to your target phone number

User talks to widget → Agent triggers "initiatePhoneCall" client tool8. **User Stays on Site**: Throughout this process, the user remains on your website

                                ↓

                    JavaScript event handler catches call## Architecture

                                ↓

                    POST to /api/call/outbound with phone number```

                                ↓┌─────────────────┐

                    API calls ElevenLabs Twilio outbound call API│  User Browser   │

                                ↓│   (Widget)      │

                    ElevenLabs makes call via Twilio & connects agent└────────┬────────┘

                                ↓         │ 1. User requests call

                    Thomas's phone rings with agent speaking         ▼

```┌─────────────────┐

│ Client Tool     │

## Component Structure│ initiatePhone   │

│ Call()          │

### 1. ElevenLabs Widget (`contact-content.tsx`)└────────┬────────┘

Located in: `src/app/[locale]/contact/contact-content.tsx`         │ 2. POST /api/call/outbound

         ▼

**Responsibilities:**┌─────────────────┐

- Loads ElevenLabs widget script│  Next.js API    │

- Registers client tool `initiatePhoneCall`│  Route          │

- Catches `elevenlabs-convai:call` events from widget└────────┬────────┘

- Sends phone number to API endpoint         │ 3. Twilio API Call

         ▼

**Key Features:**┌─────────────────┐

- Widget retry logic (polls every 500ms until found)│  Twilio         │

- Event listener attached to widget element (not document)│  Service        │

- Flexible parameter extraction (supports multiple param names)└────────┬────────┘

- Comprehensive console logging         │ 4. GET /api/call/twiml

         ▼

### 2. API Endpoint (`/api/call/outbound/route.ts`)┌─────────────────┐

Located in: `src/app/api/call/outbound/route.ts`│  TwiML Route    │

│  Returns XML    │

**Responsibilities:**└────────┬────────┘

- Receives phone number from widget         │ 5. Connect call

- Calls ElevenLabs Twilio outbound call API         ▼

- Returns conversation ID and call SID┌─────────────────┐

│  Phone Call     │

**Edge Runtime Features:**│  +14785002626   │

- Compatible with Cloudflare Pages│       ▼         │

- Fast response times│  +15074161239   │

- No need for custom TwiML endpoints└─────────────────┘

```

**API Call:**

```typescript## Files Created/Modified

POST https://api.elevenlabs.io/v1/convai/twilio/outbound-call

Headers: { 'xi-api-key': 'sk_...' }### New Files

Body: {

  "agent_id": "jrtHx9K8suqXV9kyjlb6",1. **`src/app/api/call/outbound/route.ts`**

  "agent_phone_number_id": "pn_...",   - API endpoint to initiate Twilio outbound calls

  "to_number": "+33749062192"   - Validates phone number and Twilio credentials

}   - Makes authenticated request to Twilio API

```   - Returns call SID and status



## Environment Variables2. **`src/app/api/call/twiml/route.ts`**

   - TwiML endpoint that provides call instructions

Add these to your **Cloudflare Pages** environment variables:   - Returns XML response telling Twilio how to handle the call

   - Connects call to ElevenLabs agent via WebSocket stream

```bash   - Handles both GET and POST requests from Twilio

# ElevenLabs API Key (from ElevenLabs dashboard)

ELEVENLABS_API_KEY=sk_...### Modified Files



# Agent Phone Number ID (from ElevenLabs Dashboard > Agent > Phone Numbers)1. **`src/app/[locale]/contact/contact-content.tsx`**

# This is the ID of the Twilio phone number associated with your agent   - Added `elevenlabs-convai:call` event listener

ELEVENLABS_AGENT_PHONE_NUMBER_ID=pn_...   - Configured `initiatePhoneCall` client tool

```   - Tool makes fetch request to `/api/call/outbound` endpoint

   - Handles success and error responses

### How to Find Agent Phone Number ID

2. **`.env.example`**

1. Go to: https://elevenlabs.io/app/conversational-ai   - Added Twilio configuration variables

2. Click on your agent   - Added ElevenLabs API key

3. Go to **Phone Numbers** tab   - Added app URL for TwiML callbacks

4. Click on your connected Twilio phone number (+14785002626)

5. Copy the Phone Number ID (format: `pn_...`)## Environment Variables Required

6. Add it to Cloudflare Pages environment variables

Add these to your `.env.local` file (copy from `.env.example`):

**Note**: You DO NOT need `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, or `TWILIO_PHONE_NUMBER` anymore. ElevenLabs handles the Twilio integration directly.

```bash

## Setup Steps# Twilio Configuration

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

### Step 1: Connect Twilio to ElevenLabsTWILIO_AUTH_TOKEN=your_auth_token_here

TWILIO_PHONE_NUMBER=+14785002626

1. In ElevenLabs Dashboard, go to your agentTARGET_PHONE_NUMBER=+15074161239

2. Navigate to **Phone Numbers** tab

3. Click **Add Phone Number**# ElevenLabs Configuration

4. Select **Twilio** as providerELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

5. Connect your Twilio account (+14785002626)

6. Copy the resulting Phone Number ID# App URL (for TwiML callbacks)

NEXT_PUBLIC_APP_URL=thomas-nicoli.com

### Step 2: Configure ElevenLabs Client Tool```



In your agent's settings:### Getting Twilio Credentials



1. Go to **Tools** tab1. Go to [Twilio Console](https://console.twilio.com/)

2. Find or create `initiatePhoneCall` client tool2. Find your **Account SID** and **Auth Token** on the dashboard

3. Set configuration:3. Verify your **Twilio Phone Number** (+14785002626) is active

   - **Name**: `initiatePhoneCall`4. Note: You may need to verify your target phone number in Twilio if using a trial account

   - **Description**: "Initiates a phone call to Thomas"

   - **Parameter Type**: `constant_value`### Getting ElevenLabs API Key

   - **Value**: `+33749062192` (Thomas's French number)

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/settings/api-keys)

**Why constant_value?**: The agent always calls Thomas (same number), so we don't need the LLM to decide dynamically.2. Generate or copy your API key

3. Add it to your environment variables

### Step 3: Enable France Geo-Permissions in Twilio

## ElevenLabs Agent Configuration

Since we're calling a French number from a US number:

### Step 1: Create Client Tool in ElevenLabs Dashboard

1. Go to: https://console.twilio.com/us1/develop/voice/settings/geo-permissions

2. Find **France (+33)** in the list1. Navigate to your agent settings: [ElevenLabs Agent jrtHx9K8suqXV9kyjlb6](https://elevenlabs.io/app/conversational-ai/agents/jrtHx9K8suqXV9kyjlb6)

3. Check the box to enable for **Voice** calls2. Go to **Tools** → **Client Tools**

4. Click **Save**3. Click **Add Client Tool**

5. Wait ~5 minutes for changes to propagate4. Configure the tool:



### Step 4: Add Environment Variables to Cloudflare   **Name:** `initiatePhoneCall`

   

1. Go to your Cloudflare Pages project   **Description:** 

2. Navigate to **Settings** > **Environment variables**   ```

3. Add **both** variables:   Initiates an outbound phone call to the user. Use this when the user asks to be called or wants to speak over the phone. The call will be made from our Twilio number to connect with our team.

   - `ELEVENLABS_API_KEY`   ```

   - `ELEVENLABS_AGENT_PHONE_NUMBER_ID`   

4. Click **Save**   **Parameters:**

   ```json

### Step 5: Deploy   {

     "type": "object",

```bash     "properties": {

git add -A       "phoneNumber": {

git commit -m "feat: use ElevenLabs API for phone calls with agent conversation"         "type": "string",

git push         "description": "The phone number to call (in E.164 format, e.g., +15551234567)"

```       }

     },

Cloudflare will automatically deploy within ~2 minutes.     "required": ["phoneNumber"]

   }

## Testing the Integration   ```



### 1. Open the Contact Page5. **Important**: The tool name must be **exactly** `initiatePhoneCall` (case-sensitive) to match the JavaScript handler

Visit: https://thomas-nicoli.com/en/contact

### Step 2: Update Agent Prompt (Optional)

### 2. Interact with Widget

Click the ElevenLabs widget and say:Add this to your agent's system prompt to guide call behavior:

- "Can you call Thomas?"

- "I'd like to speak with Thomas on the phone"```

- "Call Thomas for me"You are a helpful assistant for Thomas Nicoli's web development services. 



### 3. Check Console LogsWhen users want to discuss projects in detail or prefer a phone conversation, you can offer to initiate a call. Use the initiatePhoneCall tool when:

Open browser DevTools (F12) and look for:- User explicitly asks to be called

- User wants to discuss complex project requirements

```- User prefers voice communication over text chat

[Widget] Widget found! Setting up event listener...

[Widget] Client tools registered successfully!Before initiating a call:

[Widget] 🔥 initiatePhoneCall CALLED WITH PARAMS: { phoneNumber: '+33749062192' }1. Confirm the user's phone number

[Widget] Calling API with phone number: +337490621922. Let them know the call will come from +1 (478) 500-2626

[Widget] API response: { success: true, conversation_id: '...', call_sid: '...' }3. Explain that you're connecting them with the team

[Widget] ✅ Call initiated successfully!

```Example dialogue:

User: "Can you call me to discuss this?"

### 4. Verify Call ConnectsAgent: "I'd be happy to initiate a call for you! What's the best number to reach you at?"

- Thomas's phone should ring within 5-10 secondsUser: "It's +1 234 567 8900"

- When answered, the ElevenLabs agent should speakAgent: "Perfect! I'll have our team call you at +1 234 567 8900 from our number +1 (478) 500-2626. You should receive the call within a minute. Is now a good time?"

- The agent should handle the full conversation```



### 5. Check ElevenLabs Dashboard## Testing

Go to: https://elevenlabs.io/app/conversational-ai

- Navigate to **Conversations** tab### Local Development Testing

- You should see the call listed with conversation transcript

1. **Start ngrok tunnel** (required for Twilio webhooks):

## Troubleshooting   ```bash

   ngrok http 3000

### Error: "Missing agent phone number ID"   ```



**Cause**: `ELEVENLABS_AGENT_PHONE_NUMBER_ID` not set in Cloudflare2. **Update environment variable**:

   ```bash

**Solution**:   NEXT_PUBLIC_APP_URL=your-ngrok-url.ngrok.app

1. Find the ID in ElevenLabs Dashboard > Agent > Phone Numbers   ```

2. Add it to Cloudflare Pages environment variables

3. Redeploy3. **Start Next.js dev server**:

   ```bash

### Error: "Failed to initiate call"   npm run dev

   ```

**Cause**: Invalid API key or agent not configured

4. **Test the widget**:

**Solution**:   - Go to `http://localhost:3000/en/contact`

- Verify `ELEVENLABS_API_KEY` is correct (starts with `sk_`)   - Open browser console to see logs

- Ensure agent ID `jrtHx9K8suqXV9kyjlb6` exists   - Chat with the widget and request a phone call

- Check ElevenLabs dashboard for API errors   - Provide a phone number when asked



### Call Initiated But Phone Doesn't Ring5. **Check logs**:

   - Browser console: `[Widget] Initiating phone call to: +1...`

**Possible Causes**:   - Terminal: Twilio API responses

1. France geo-permissions not enabled in Twilio   - Twilio Console: Call logs and status

2. Phone number format incorrect

3. Twilio account balance insufficient### Production Testing



**Solutions**:1. **Deploy to Cloudflare Pages** (environment variables are already set in Cloudflare)

- Enable France in Twilio geo-permissions (wait 5 mins)

- Verify phone number format: `+33749062192` (with country code)2. **Test on live site**:

- Check Twilio account balance   - Visit `https://thomas-nicoli.com/en/contact`

   - Interact with the widget

### "Phone number is required"   - Request a phone call



**Cause**: ElevenLabs tool not sending parameters correctly3. **Monitor**:

   - Cloudflare logs

**Solution**:   - Twilio console for call details

- In ElevenLabs Dashboard, set tool parameter to `constant_value`   - ElevenLabs dashboard for conversation analytics

- Set value to `+33749062192`

- Save and test again## Troubleshooting



## Console Logging### "Server configuration error"

- **Cause**: Missing Twilio credentials

The integration includes comprehensive logging for debugging:- **Fix**: Ensure `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are set in environment variables



**Widget Logs** (`[Widget]` prefix):### "Failed to initiate call"

- Widget initialization- **Cause**: Invalid Twilio credentials or phone numbers

- Event listener attachment- **Fix**: Verify credentials in Twilio console, check phone number format (E.164)

- Tool calls and parameters

- API responses### "TwiML callback failed"

- **Cause**: Twilio can't reach your TwiML endpoint

**API Logs** (`[API]` prefix):- **Fix**: 

- ElevenLabs API requests  - For local dev: Ensure ngrok is running and URL is correct

- Response data  - For production: Verify `NEXT_PUBLIC_APP_URL` is correct

- Error details

### Widget tool not triggered

Check both browser console AND Cloudflare Pages logs for full visibility.- **Cause**: Tool name mismatch between ElevenLabs config and JavaScript

- **Fix**: Ensure tool name is **exactly** `initiatePhoneCall` in both places (case-sensitive)

## Phone Numbers

### Call connects but no audio

| Number | Purpose | Provider |- **Cause**: WebSocket stream configuration issue

|--------|---------|----------|- **Fix**: Check that ElevenLabs agent ID is correct in TwiML route

| +14785002626 | Outbound calling (agent's number) | Twilio (connected to ElevenLabs) |

| +33749062192 | Thomas's French mobile | External |## Security Considerations



## Key Differences from Previous Setup1. **Environment Variables**: Never commit `.env.local` to version control

2. **API Keys**: Rotate Twilio and ElevenLabs API keys regularly

### ❌ Old Approach (Direct Twilio API)3. **Phone Number Validation**: Consider adding server-side phone number validation

- Called Twilio API directly from our code4. **Rate Limiting**: Implement rate limiting on `/api/call/outbound` to prevent abuse

- Needed custom TwiML endpoint (`/api/call/twiml`)5. **Authentication**: Consider adding authentication for the call API endpoint

- Had to manage Twilio credentials in our app

- Call connected but agent wasn't speaking## Cost Implications

- Complex setup with multiple moving parts

### Twilio Costs

### ✅ New Approach (ElevenLabs API)- **Outbound calls**: ~$0.013/minute (US)

- ElevenLabs handles the entire Twilio integration- **Phone number rental**: ~$1.00/month

- Agent automatically speaks when call connects- Monitor usage in [Twilio Console](https://console.twilio.com/us1/billing/usage)

- Single API endpoint (`/api/call/outbound`)

- Only need ElevenLabs API key### ElevenLabs Costs

- Simpler, more reliable architecture- **Conversational AI**: Based on your subscription plan

- **API usage**: Check [ElevenLabs Pricing](https://elevenlabs.io/pricing)

## Security Notes

## Next Steps

- **API Keys**: Stored in environment variables (never in code)

- **Edge Runtime**: Fast response times on Cloudflare network### Immediate

- **HTTPS**: All API calls encrypted1. ✅ Add environment variables to `.env.local`

- **Validation**: Phone number validated before calling2. ⬜ Configure client tool in ElevenLabs dashboard

- **Client Tool**: Configured with constant value (prevents abuse)3. ⬜ Test on local development

4. ⬜ Add environment variables to Cloudflare Pages

## File Structure5. ⬜ Deploy and test on production



```### Optional Enhancements

src/- Add phone number validation with libphonenumber

├── app/- Implement call analytics and logging

│   ├── [locale]/- Add confirmation modal before initiating call

│   │   └── contact/- Store call history in database

│   │       └── contact-content.tsx    # Widget integration- Add webhook to track call status updates

│   └── api/- Implement call recording (with consent)

│       └── call/- Add SMS fallback option

│           └── outbound/

│               └── route.ts           # ElevenLabs API proxy## Support

└── components/

    └── nexus-ai/                      # (unused for phone calls)For issues:

```- **Twilio**: [Twilio Support](https://support.twilio.com/)

- **ElevenLabs**: [ElevenLabs Discord](https://discord.gg/elevenlabs)

## Support- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)



If you encounter issues:## References

1. Check browser console for `[Widget]` logs

2. Check Cloudflare Pages logs for `[API]` logs- [ElevenLabs Widget Documentation](https://elevenlabs.io/docs/conversational-ai/widget)

3. Check ElevenLabs Dashboard > Conversations- [ElevenLabs Client Tools](https://elevenlabs.io/docs/conversational-ai/customization/tools/client-tools)

4. Check Twilio Console > Call Logs- [Twilio Voice API](https://www.twilio.com/docs/voice/api)

5. Verify all environment variables are set correctly- [Twilio TwiML](https://www.twilio.com/docs/voice/twiml)

- [ElevenLabs Twilio Integration Guide](https://elevenlabs.io/docs/conversational-ai/guides/twilio)
