# 📧 Resend Email Troubleshooting Guide

## ❌ Problem: Not Receiving Emails in Production

### ✅ Quick Fix Checklist

1. **Set Environment Variables in Cloudflare Pages**
   
   Go to: Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
   
   Add these **PRODUCTION** variables:
   ```bash
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   RESEND_TO=your-email@example.com
   MAIL_DOMAIN=thomas-nicoli.pages.dev
   ```

2. **Get Your Resend API Key**
   
   - Go to https://resend.com/api-keys
   - Create a new API key
   - Copy the key (starts with `re_`)
   - Add it to Cloudflare environment variables

3. **Verify Domain in Resend**
   
   - Go to https://resend.com/domains
   - Add your domain: `thomas-nicoli.pages.dev`
   - Add DNS records to Cloudflare DNS:
     - SPF record
     - DKIM record
     - DMARC record (optional but recommended)
   
   **OR** use Resend's default domain:
   - Set `MAIL_DOMAIN=resend.dev`
   - Emails will come from: `noreply@resend.dev`

4. **Redeploy After Setting Variables**
   
   After adding environment variables in Cloudflare:
   - Go to Deployments tab
   - Click "Retry deployment" on the latest build
   - OR push a new commit to trigger a rebuild

---

## 🔍 Debugging Steps

### Step 1: Check Cloudflare Logs

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click on latest deployment
3. Click "View logs"
4. Look for `[lead]` messages when you submit the form

You should see:
```
[lead] Received request
[lead] Valid data received for: test@example.com
[lead] Environment check: {...}
[lead] Sending email...
[lead] Email sent successfully! ID: xxxxx
```

### Step 2: Check Resend Dashboard

1. Go to https://resend.com/emails
2. Check if email appears in the list
3. Look at the status:
   - ✅ **Delivered** - Success!
   - ⏳ **Sent** - Still processing
   - ❌ **Bounced** - Check recipient email
   - ❌ **Failed** - Check error message

### Step 3: Test API Endpoint Directly

Use this curl command to test the API:

```bash
curl -X POST https://thomas-nicoli.pages.dev/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from curl",
    "consent": true
  }'
```

Expected response:
```json
{
  "ok": true,
  "sent": true,
  "emailId": "xxxxx-xxxxx-xxxxx"
}
```

### Step 4: Check Environment Variables Are Set

The logs will show:
```
[lead] Environment check: {
  hasApiKey: true,
  hasRecipient: true,
  hasDomain: true,
  apiKeyLength: 50,
  domain: "thomas-nicoli.pages.dev"
}
```

If any are `false`, the environment variables are missing!

---

## 🚨 Common Issues & Solutions

### Issue 1: "Email service not configured"

**Cause:** Missing `RESEND_API_KEY` or `RESEND_TO` in Cloudflare environment variables

**Solution:**
1. Go to Cloudflare Pages Settings → Environment Variables
2. Add both variables for **Production**
3. Redeploy the site

### Issue 2: Emails sending but not arriving

**Cause:** Domain not verified or SPF/DKIM records not set

**Solution:**
- Option A: Use Resend's shared domain
  ```bash
  MAIL_DOMAIN=resend.dev
  ```
  
- Option B: Verify your custom domain
  1. Add DNS records in Cloudflare DNS
  2. Wait for verification (can take up to 24 hours)

### Issue 3: "Failed to send email" in logs

**Cause:** Invalid API key or API rate limit exceeded

**Solution:**
1. Check your API key is correct (no extra spaces)
2. Verify key in Resend dashboard
3. Check you haven't hit the free tier limit (100 emails/day)

### Issue 4: Form shows success but no email

**Cause:** API returns 200 but email fails silently

**Solution:** Check the improved logs - they now show actual errors

---

## ✨ Improved Features in New Code

1. **Better Error Messages**
   - Shows exactly which environment variable is missing
   - Returns detailed error messages to help debugging

2. **Comprehensive Logging**
   - Every step is logged with `[lead]` prefix
   - Easy to trace in Cloudflare logs

3. **Reply-To Support**
   - Emails now include `replyTo: data.email`
   - You can reply directly to the sender from your email client

4. **Email ID Tracking**
   - Returns Resend email ID in response
   - You can look up the email in Resend dashboard

5. **Validation Error Details**
   - Shows specific validation errors
   - Helps debug form issues

---

## 📋 Production Setup Checklist

- [ ] Get Resend API key from https://resend.com/api-keys
- [ ] Add `RESEND_API_KEY` to Cloudflare Pages environment variables
- [ ] Add `RESEND_TO` (your email) to Cloudflare environment variables
- [ ] Add `MAIL_DOMAIN` to Cloudflare environment variables
- [ ] Redeploy the site after adding variables
- [ ] Test the contact form
- [ ] Check Cloudflare logs for `[lead]` messages
- [ ] Verify email arrives in inbox (check spam folder!)
- [ ] Check Resend dashboard for email status

---

## 🎯 Quick Test Commands

### Test locally (with .env.local):
```bash
npm run dev
# Open http://localhost:3000/contact
# Fill and submit form
# Check terminal logs
```

### Test production API:
```bash
# Replace with your actual domain
curl -X POST https://thomas-nicoli.pages.dev/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@test.com",
    "message": "Testing 12345",
    "consent": true
  }' | jq
```

### Check Cloudflare logs:
1. Cloudflare Dashboard → Pages → thomas-nicoli
2. Latest deployment → "View logs"
3. Search for `[lead]`

---

## 💡 Tips

1. **Start with Resend's shared domain** (`resend.dev`) - it's already verified and works immediately
2. **Check spam folder** - first emails might go to spam
3. **Use Cloudflare logs** - they're your best friend for debugging
4. **Test with curl** - faster than filling forms repeatedly
5. **Monitor Resend dashboard** - see real-time email status

---

## 📞 Need Help?

If emails still don't work after following this guide:

1. Check Cloudflare Functions logs (full error trace)
2. Check Resend dashboard (email delivery status)
3. Verify environment variables are in **Production** (not Preview)
4. Make sure you redeployed after adding env vars

**Common oversight:** Adding env vars but forgetting to redeploy! 🔄
