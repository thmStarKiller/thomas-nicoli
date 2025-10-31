# Quick Setup Guide - Phone Calling

## ✅ What We Changed

**Old System**: We were calling Twilio API directly, but the call would connect without the agent speaking.

**New System**: We use ElevenLabs' API which handles BOTH the call AND the agent conversation automatically.

## 🚀 Next Steps (Do These Now!)

### 1. Get Your Agent Phone Number ID

1. Go to: https://elevenlabs.io/app/conversational-ai
2. Click on your agent
3. Go to **Phone Numbers** tab
4. Click on your phone number (+14785002626)
5. Copy the **Phone Number ID** (looks like: `pn_...`)

### 2. Add Environment Variable to Cloudflare

1. Go to: https://dash.cloudflare.com/
2. Find your `thomas-nicoli` project
3. Go to **Settings** > **Environment variables**
4. Click **Add variable**
5. Add:
   - **Name**: `ELEVENLABS_AGENT_PHONE_NUMBER_ID`
   - **Value**: `pn_...` (the ID you copied)
6. Click **Save**

### 3. Enable France Geo-Permissions in Twilio

1. Go to: https://console.twilio.com/us1/develop/voice/settings/geo-permissions
2. Find **France (+33)** in the list
3. Check the box for **Voice**
4. Click **Save**
5. **Wait 5 minutes** for changes to take effect

### 4. Update ElevenLabs Tool Configuration

1. Go to your ElevenLabs agent: https://elevenlabs.io/app/conversational-ai
2. Click **Tools** tab
3. Find `initiatePhoneCall` client tool
4. Change parameter to:
   - **Type**: `constant_value`
   - **Value**: `+33749062192`
5. Save

## 🧪 Testing

Once you've completed the steps above:

1. Visit: https://thomas-nicoli.com/en/contact
2. Click the widget
3. Say: **"Can you call Thomas?"**
4. Your phone should ring within 10 seconds
5. When you answer, the ElevenLabs agent will speak and handle the conversation

## 📋 Checklist

- [ ] Got agent phone number ID from ElevenLabs
- [ ] Added `ELEVENLABS_AGENT_PHONE_NUMBER_ID` to Cloudflare
- [ ] Enabled France geo-permissions in Twilio
- [ ] Updated ElevenLabs tool to use `constant_value` with `+33749062192`
- [ ] Waited 5 minutes for Twilio geo-permissions
- [ ] Tested the call

## 🔍 If Something Goes Wrong

Check browser console (F12) for logs:
- `[Widget] ✅ Call initiated successfully!` = Good!
- `[Widget] ❌ Error:` = Check the error message

Common errors:
- **"Missing agent phone number ID"** → Add env variable to Cloudflare
- **"Failed to initiate call"** → Check ElevenLabs API key
- **Call queues but doesn't ring** → Wait for Twilio geo-permissions (5 mins)

## 📞 Expected Behavior

When working correctly:
1. User asks agent to call Thomas
2. Widget shows success in console
3. Your phone (+33749062192) rings within 5-10 seconds
4. You answer
5. ElevenLabs agent greets you and explains it's a call from the website
6. Agent continues the conversation naturally

## 🎯 Environment Variables Summary

You need **2 variables** in Cloudflare:

| Variable | Where to Find |
|----------|---------------|
| `ELEVENLABS_API_KEY` | ElevenLabs Dashboard > API Keys |
| `ELEVENLABS_AGENT_PHONE_NUMBER_ID` | ElevenLabs > Agent > Phone Numbers |

**Note**: You DON'T need Twilio credentials anymore! ElevenLabs handles that.
