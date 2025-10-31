# Phone Call Integration Setup Checklist

## ✅ Phase 1: Code Implementation (COMPLETED)
- [x] Created `/api/call/outbound` endpoint
- [x] Created `/api/call/twiml` endpoint  
- [x] Added client tool handler to contact widget
- [x] Updated `.env.example` with required variables
- [x] Created comprehensive documentation
- [x] Built and tested code compilation
- [x] Committed and pushed to GitHub

## ⬜ Phase 2: ElevenLabs Configuration (YOUR TASKS)

### Step 1: Create Client Tool in ElevenLabs Dashboard
1. Go to: https://elevenlabs.io/app/conversational-ai/agents/jrtHx9K8suqXV9kyjlb6
2. Navigate to: **Tools** → **Client Tools** → **Add Client Tool**
3. Fill in the following:

**Tool Name:** (MUST be exact)
```
initiatePhoneCall
```

**Tool Description:**
```
Initiates an outbound phone call to the user. Use this when the user asks to be called or wants to speak over the phone. The call will be made from our Twilio number to connect with our team.
```

**Parameters Schema:**
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

4. Click **Save**

### Step 2: Update Agent Prompt (Optional but Recommended)
Add this to your agent's system prompt:

```
When users want to discuss projects in detail or prefer a phone conversation, you can offer to initiate a call. Use the initiatePhoneCall tool when:
- User explicitly asks to be called
- User wants to discuss complex project requirements  
- User prefers voice communication over text chat

Before initiating a call:
1. Confirm the user's phone number
2. Let them know the call will come from +1 (478) 500-2626
3. Explain that you're connecting them with the team

Example:
User: "Can you call me?"
Agent: "I'd be happy to initiate a call! What's the best number to reach you at?"
User: "+1 234 567 8900"
Agent: "Perfect! I'll have our team call you at +1 234 567 8900 from +1 (478) 500-2626. You should receive the call within a minute."
```

## ⬜ Phase 3: Environment Variables Setup

### On Cloudflare Pages Dashboard

1. Go to: https://dash.cloudflare.com/
2. Navigate to: **Workers & Pages** → **thomas-nicoli** → **Settings** → **Environment variables**
3. Add the following variables for **Production**:

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+14785002626
TARGET_PHONE_NUMBER=+15074161239
ELEVENLABS_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=thomas-nicoli.com
```

4. Click **Save** (deployment will trigger automatically)

### Where to Find These Values

**Twilio Credentials:**
- Dashboard: https://console.twilio.com/
- **Account SID**: Top of dashboard
- **Auth Token**: Click "View" next to Auth Token
- **Phone Number**: Active Numbers → Manage → Active numbers

**ElevenLabs API Key:**
- Dashboard: https://elevenlabs.io/app/settings/api-keys
- Click "Generate API Key" or copy existing one

## ⬜ Phase 4: Testing

### Test on Production (After Cloudflare Deploy)

1. **Wait for deployment** (~2-3 minutes after env var save)
2. **Visit:** https://thomas-nicoli.com/en/contact
3. **Open browser console** (F12)
4. **Chat with widget:**
   - "Hi, can you call me?"
   - Provide test phone number when asked
   - Check console for logs: `[Widget] Initiating phone call to: +1...`

5. **Verify call:**
   - You should receive call on +15074161239
   - Call comes from +14785002626
   - Check Twilio console for call logs

### Expected Flow

```
User on website → Chats with AI → Requests call → AI asks for number
→ User provides number → AI triggers initiatePhoneCall tool 
→ API calls Twilio → Twilio calls +15074161239 from +14785002626
→ Call connects → User stays on website the whole time ✨
```

## ⬜ Phase 5: Monitoring

### Check These After First Test Call

- [ ] **Cloudflare Logs:** Functions → Logs & Analytics
- [ ] **Twilio Console:** https://console.twilio.com/us1/monitor/logs/calls
- [ ] **ElevenLabs Analytics:** Check conversation history for tool usage
- [ ] **Browser Console:** Look for any JavaScript errors

### Cost Tracking

- **Twilio:** ~$0.013/minute for US calls
- **Monitor usage:** https://console.twilio.com/us1/billing/usage
- **Set alerts:** Consider setting up usage alerts in Twilio

## 🎯 Success Criteria

Integration is successful when:
- [ ] Client tool appears in ElevenLabs dashboard
- [ ] All environment variables are set in Cloudflare
- [ ] Widget loads without errors on contact page
- [ ] User can request a call through chat
- [ ] API successfully calls Twilio
- [ ] Twilio connects the call
- [ ] Call is received on target number
- [ ] User never leaves the website

## 📋 Quick Reference

**Widget Location:** `/en/contact` and `/es/contact`
**API Endpoints:** 
- `/api/call/outbound` - Initiates call
- `/api/call/twiml` - TwiML instructions

**Agent ID:** jrtHx9K8suqXV9kyjlb6
**Twilio From:** +14785002626  
**Twilio To:** +15074161239

**Documentation:** See `PHONE_CALL_INTEGRATION.md` for full details

## 🐛 Troubleshooting

**No tool in widget:**
→ Tool name must be exactly `initiatePhoneCall` (case-sensitive)

**"Server configuration error":**
→ Check environment variables in Cloudflare

**Call doesn't connect:**
→ Verify phone numbers in E.164 format (+1XXXXXXXXXX)
→ Check Twilio console for error logs

**TwiML error:**
→ Ensure `NEXT_PUBLIC_APP_URL=thomas-nicoli.com` (no https://)

## 📞 Support Contacts

- **Twilio Support:** https://support.twilio.com/
- **ElevenLabs Discord:** https://discord.gg/elevenlabs
- **Documentation:** See `PHONE_CALL_INTEGRATION.md`
