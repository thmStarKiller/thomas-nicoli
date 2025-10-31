# Quick Setup Checklist - 3-Way Conference Calls

## ✅ What We Built

**Old System**: Agent called Thomas, user stayed in widget (not connected)

**New System**: Agent collects user's phone number → Creates conference → Calls both user and Thomas → Everyone talks together

---

## 🚀 Setup Steps (Do These Now!)

### ☑️ Step 1: Add Twilio Credentials to Cloudflare

You need your Twilio credentials (not ElevenLabs anymore):

1. **Get Twilio credentials**:
   - Go to: https://console.twilio.com/
   - Copy **Account SID** (starts with `AC...`)
   - Copy **Auth Token** (click to reveal)

2. **Add to Cloudflare**:
   - Go to: https://dash.cloudflare.com/
   - Find your `thomas-nicoli` project
   - **Settings** > **Environment variables**
   - Add these 3 variables:
     - `TWILIO_ACCOUNT_SID` = `AC...`
     - `TWILIO_AUTH_TOKEN` = `your_auth_token`
     - `TWILIO_PHONE_NUMBER` = `+14785002626`
   - Keep existing: `ELEVENLABS_API_KEY` and `NEXT_PUBLIC_APP_URL`
   - **Remove**: `ELEVENLABS_AGENT_PHONE_NUMBER_ID` (no longer needed)
   - Click **Save**

---

### ☑️ Step 2: Enable Geo-Permissions in Twilio

Enable countries you'll be calling:

1. Go to: https://console.twilio.com/us1/develop/voice/settings/geo-permissions
2. Enable these for **Voice**:
   - ✅ **France** (+33) - for Thomas
   - ✅ **United States** (+1) - for US users
   - ✅ **Canada** (+1) - for Canadian users
   - ✅ Any other countries your users might call from
3. Click **Save**
4. **Wait 5 minutes** for changes to activate

---

### ☑️ Step 3: Update ElevenLabs Agent Tool

**Delete old tool**:
1. Go to: https://elevenlabs.io/app/conversational-ai
2. Click your agent
3. **Tools** tab
4. Find `initiatePhoneCall` → **Delete** or **Disable**

**Create new tool**:
1. Click **Add Tool** → **Client Tool**
2. Configure:
   - **Name**: `createConferenceCall`
   - **Description**: `Creates a 3-way conference call connecting the user with Thomas. Ask for the user's phone number first.`
   - **Parameters**:
     - Name: `userPhoneNumber`
     - Type: `string`
     - Description: `The user's phone number in international format`
     - Required: ✅ Yes
3. Click **Save**

---

### ☑️ Step 4: Update Agent Prompt

Add to your agent's system prompt:

```
When a user wants to speak with Thomas:
1. Ask for their phone number in international format (e.g., +1 555 123 4567 for US, +33 7 49 06 21 92 for France)
2. Confirm the number is correct
3. Use createConferenceCall tool with their phone number
4. Tell them: "Perfect! I'm calling you now at [number] and connecting you with Thomas. Please answer your phone in a few seconds."
```

---

### ☑️ Step 5: Wait for Deployment

- Cloudflare is currently deploying (takes ~2 minutes)
- Check status: https://dash.cloudflare.com/
- Wait for "Success" status

---

## 🧪 Testing

Once deployment completes:

1. **Visit**: https://thomas-nicoli.com/en/contact
2. **Click widget** and say: "I want to talk to Thomas"
3. **Agent asks**: "What's your phone number?"
4. **Provide number**: "+1 555 123 4567" (or your real number)
5. **Agent creates call**
6. **YOUR phone should ring** within 5-10 seconds
7. **Answer your phone**
8. **THOMAS's phone rings** (+33 7 49 06 21 92)
9. **Thomas answers**
10. **You're connected!** Talk to each other

---

## 📋 Environment Variables Summary

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `TWILIO_ACCOUNT_SID` | `AC...` | Twilio Console homepage |
| `TWILIO_AUTH_TOKEN` | Your token | Twilio Console (click to reveal) |
| `TWILIO_PHONE_NUMBER` | `+14785002626` | Your Twilio phone number |
| `ELEVENLABS_API_KEY` | `sk_...` | ElevenLabs Dashboard |
| `NEXT_PUBLIC_APP_URL` | `https://thomas-nicoli.com` | Your domain |
| ~~`ELEVENLABS_AGENT_PHONE_NUMBER_ID`~~ | ❌ **Remove this** | No longer needed |

---

## 🔍 If Something Goes Wrong

### "Missing Twilio credentials"
→ Add `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` to Cloudflare

### Phones don't ring
→ Wait 5 mins after enabling Twilio geo-permissions
→ Check phone number format: `+[country code][number]`

### One phone rings but not the other
→ Check Twilio Call Logs: https://console.twilio.com/us1/monitor/logs/calls
→ Enable geo-permissions for both countries

### Agent doesn't ask for phone number
→ Update agent prompt to mention asking for phone number
→ Save and test again

---

## 🎯 Expected Behavior

When working correctly:

1. ✅ User asks to talk to Thomas
2. ✅ Agent asks for phone number
3. ✅ User provides number
4. ✅ Agent confirms and creates call
5. ✅ User's phone rings (they answer)
6. ✅ Thomas's phone rings (he answers)
7. ✅ All parties hear each other clearly
8. ✅ Conference stays active until everyone hangs up

---

## 📞 What Happens Behind The Scenes

```
User: "I want to talk to Thomas"
  ↓
Agent: "What's your phone number?"
  ↓
User: "+15551234567"
  ↓
createConferenceCall(userPhoneNumber: "+15551234567")
  ↓
API creates conference: "thomas-call-1730000000"
  ↓
Twilio calls +15551234567 → "Please wait, connecting you..."
  ↓
Twilio calls +33749062192 → "Bonjour Thomas, appel du site web..."
  ↓
Both join conference → Connected!
```

---

## ✅ Checklist

Before testing, verify:

- [ ] Twilio credentials added to Cloudflare
- [ ] Geo-permissions enabled for France + user countries (waited 5 mins)
- [ ] Old `initiatePhoneCall` tool deleted/disabled in ElevenLabs
- [ ] New `createConferenceCall` tool created with `userPhoneNumber` parameter
- [ ] Agent prompt updated to ask for phone number
- [ ] Cloudflare deployment successful (check dashboard)
- [ ] Ready to test!

---

**Need help?** Check `CONFERENCE_CALL_SETUP.md` for detailed troubleshooting.
