# 3-Way Conference Call Integration

## Overview

This system creates **3-way conference calls** between:
- 👤 **Website Visitor** (on their phone)
- 👨‍💼 **Thomas** (+33749062192)
- 🤖 **ElevenLabs Agent** (moderating)

## How It Works

### User Flow
1. Visitor opens website widget and talks to AI agent
2. Visitor: "I want to speak with Thomas"
3. Agent: "What's your phone number?"
4. Visitor provides their phone number
5. Agent creates conference call
6. **Visitor's phone rings** → they answer and join conference
7. **Thomas's phone rings** → he answers and joins conference
8. All three parties are now connected!

### Technical Flow
```
Widget conversation → Agent asks for phone number
                            ↓
                    User provides: +1234567890
                            ↓
            createConferenceCall client tool triggered
                            ↓
        POST /api/call/outbound with user_phone_number
                            ↓
            API creates unique conference: "thomas-call-123"
                            ↓
        Twilio calls user → joins conference
                            ↓
        Twilio calls Thomas → joins conference
                            ↓
                Conference connected!
```

## Components

### 1. Widget Client Tool (`contact-content.tsx`)
**Function**: `createConferenceCall`
- Collects user's phone number
- Sends to `/api/call/outbound`
- Returns success message

### 2. Conference API (`/api/call/outbound/route.ts`)
**Endpoint**: `POST /api/call/outbound`
- Receives `user_phone_number`
- Creates unique conference name
- Calls user's phone (TwiML: `/api/call/conference?participant=user`)
- Calls Thomas's phone (TwiML: `/api/call/conference?participant=thomas`)

### 3. Conference TwiML (`/api/call/conference/route.ts`)
**Endpoint**: `GET /api/call/conference?name=X&participant=Y`
- Provides greeting based on participant
- Joins participant to conference room
- Plays hold music while waiting

## Environment Variables

Add these to **Cloudflare Pages**:

```bash
# Twilio Credentials (from Twilio Console)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio Phone Number (makes the calls)
TWILIO_PHONE_NUMBER=+14785002626

# Your website URL
NEXT_PUBLIC_APP_URL=https://thomas-nicoli.com

# ElevenLabs API Key
ELEVENLABS_API_KEY=sk_your_key_here
```

**Note**: You NO longer need `ELEVENLABS_AGENT_PHONE_NUMBER_ID` since we're using Twilio directly for conferences.

## Setup Steps

### Step 1: Update ElevenLabs Agent Tool

1. Go to: https://elevenlabs.io/app/conversational-ai
2. Click on your agent
3. Go to **Tools** tab
4. **Delete** or **disable** the old `initiatePhoneCall` tool
5. Create **new Client Tool**:
   - **Name**: `createConferenceCall`
   - **Description**: "Creates a 3-way conference call connecting the user with Thomas. Ask for the user's phone number first."
   - **Parameters**:
     - Name: `userPhoneNumber`
     - Type: `string`
     - Description: "The user's phone number in international format (e.g., +1234567890)"
     - Required: `true`

### Step 2: Update Agent Prompt

Add to your agent's system prompt:
```
When a user wants to speak with Thomas:
1. Ask for their phone number in international format (e.g., +1 555 123 4567)
2. Confirm the number with them
3. Use the createConferenceCall tool with their phone number
4. Tell them: "Great! I'm calling you now at [number] and connecting you with Thomas. Please answer your phone."
```

### Step 3: Configure Twilio Geo-Permissions

Since we're calling international numbers:

1. Go to: https://console.twilio.com/us1/develop/voice/settings/geo-permissions
2. Enable **France (+33)** for Voice calls
3. Enable any other countries your users might call from (e.g., **United States**, **Canada**)
4. Click **Save**
5. Wait 5 minutes for changes to propagate

### Step 4: Add Environment Variables to Cloudflare

1. Go to Cloudflare Pages dashboard
2. Select your project
3. **Settings** > **Environment variables**
4. Add all required variables (see list above)
5. **Save**

### Step 5: Deploy

```bash
git add -A
git commit -m "feat: implement 3-way conference calling"
git push
```

Cloudflare will deploy automatically (~2 minutes).

## Testing

### Test Scenario
1. Visit: https://thomas-nicoli.com/en/contact
2. Click the widget
3. Say: "I want to talk to Thomas"
4. Agent asks: "What's your phone number?"
5. Provide your number: "+1 555 123 4567"
6. Agent confirms and creates call
7. **Your phone should ring within 5 seconds**
8. Answer your phone
9. **Thomas's phone rings**
10. Thomas answers
11. You're both connected in a conference call!

### Expected Console Logs

**Widget**:
```
[Widget] Widget found! Setting up event listener...
[Widget] 🔥 createConferenceCall CALLED WITH PARAMS: { userPhoneNumber: '+15551234567' }
[Widget] Creating conference call with user at: +15551234567
[Widget] ✅ Conference call created successfully!
```

**API** (Cloudflare Logs):
```
[API] Creating conference call for user: +15551234567
[API] Calling user at: +15551234567
[API] User call initiated: CA...
[API] Calling Thomas at: +33749062192
[API] Thomas call initiated: CA...
```

**TwiML**:
```
[Conference TwiML] Request for: user in conference: thomas-call-1730000000
[Conference TwiML] Generated TwiML for: user
[Conference TwiML] Request for: thomas in conference: thomas-call-1730000000
[Conference TwiML] Generated TwiML for: thomas
```

## Troubleshooting

### Error: "Missing Twilio credentials"
**Solution**: Add `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` to Cloudflare environment variables.

### Call Created But Phones Don't Ring
**Possible Causes**:
1. Geo-permissions not enabled
2. Phone number format incorrect
3. Twilio account balance insufficient

**Solutions**:
- Enable caller/receiver countries in Twilio geo-permissions
- Use international format: `+[country code][number]` (e.g., `+15551234567`)
- Check Twilio account balance

### One Phone Rings But Not The Other
**Check**:
- Twilio Call Logs: https://console.twilio.com/us1/monitor/logs/calls
- Look for error messages on specific call SID
- Verify both numbers have geo-permissions enabled

### Conference Created But No Audio
**Possible Issues**:
- TwiML endpoint not reachable
- Conference name mismatch
- NAT/firewall blocking audio (rare)

**Solutions**:
- Check Cloudflare deployment status
- Verify `NEXT_PUBLIC_APP_URL` is correct
- Check Twilio debugger for TwiML errors

## Phone Numbers

| Number | Purpose | Provider |
|--------|---------|----------|
| +14785002626 | Outbound calling (makes the calls) | Twilio |
| +33749062192 | Thomas's French mobile | External |
| User's number | Provided by website visitor | External |

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   └── contact/
│   │       └── contact-content.tsx    # Widget + createConferenceCall tool
│   └── api/
│       └── call/
│           ├── outbound/
│           │   └── route.ts           # Conference creation API
│           └── conference/
│               └── route.ts           # TwiML for conference joining
```

## Key Differences from Previous Setup

### ❌ Old Approach (Agent Calls Thomas)
- Agent made outbound call to Thomas
- User stayed in widget (not connected)
- Thomas spoke to agent, not user
- User and Thomas never connected

### ✅ New Approach (3-Way Conference)
- Agent collects user's phone number
- System calls both user and Thomas
- Both join Twilio conference room
- User and Thomas speak directly to each other
- Agent can monitor or drop off

## Security & Privacy

- **Phone Numbers**: User's number only used for this call, not stored
- **Conference Names**: Unique per call (timestamp-based)
- **Conference Cleanup**: Conferences auto-end when everyone hangs up
- **HTTPS**: All API calls encrypted
- **Credentials**: Stored in environment variables (never in code)

## Cost Estimate

**Per Conference Call** (approximate):
- 1 call to user's phone: ~$0.013/min (US) or varies by country
- 1 call to Thomas's phone (France): ~$0.026/min
- Conference hosting: Included in call costs
- **Total**: ~$0.039/min for US → France conference

Check current Twilio pricing: https://www.twilio.com/voice/pricing

## Support

If issues persist:
1. Check browser console for `[Widget]` logs
2. Check Cloudflare Pages logs for `[API]` logs  
3. Check Twilio Console > Call Logs
4. Check Twilio Debugger for detailed error messages
5. Verify all environment variables are set correctly
