# 🚀 Quick Setup Guide for Resend Emails

## ❗ YOU NEED TO DO THIS TO RECEIVE EMAILS

Your contact form is ready, but you need to configure Resend in production.

### Step 1: Get Resend API Key

1. Go to https://resend.com
2. Sign up for free account
3. Go to **API Keys** → **Create API Key**
4. Copy the key (starts with `re_`)

### Step 2: Add Environment Variables to Cloudflare

1. Go to **Cloudflare Dashboard**
2. Navigate to: **Pages** → **thomas-nicoli** → **Settings** → **Environment Variables**
3. Add these 3 variables for **Production**:

```bash
RESEND_API_KEY=re_your_actual_key_here
RESEND_TO=your-email@gmail.com
MAIL_DOMAIN=resend.dev
```

**Important Notes:**
- Replace `re_your_actual_key_here` with your actual Resend API key
- Replace `your-email@gmail.com` with the email where you want to receive leads
- Use `resend.dev` as the domain (it's pre-verified and works immediately)

### Step 3: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Retry deployment"** on the latest build
3. Wait for deployment to complete

### Step 4: Test

1. Visit your live site: https://thomas-nicoli.pages.dev/contact
2. Fill out the contact form
3. Submit
4. Check your email (and spam folder!)

---

## 🔍 How to Check if It Worked

### Method 1: Check Cloudflare Logs

1. Go to Cloudflare Pages → thomas-nicoli
2. Click on latest deployment
3. Click **"View logs"** or **"Functions"** tab
4. Look for logs starting with `[lead]`

You should see:
```
[lead] Received request
[lead] Valid data received for: test@example.com
[lead] Environment check: { hasApiKey: true, hasRecipient: true, ... }
[lead] Sending email...
[lead] Email sent successfully! ID: xxxxx
```

### Method 2: Check Resend Dashboard

1. Go to https://resend.com/emails
2. You should see your email in the list
3. Status should be "Delivered" ✅

---

## ❌ Troubleshooting

### "Email service not configured" error

**Problem:** Missing environment variables

**Solution:** Make sure you added all 3 variables in Cloudflare (see Step 2) and redeployed

### Form says "success" but no email

**Problem:** Environment variables not set for Production environment

**Solution:**
1. In Cloudflare, make sure variables are added to **Production** (not Preview)
2. Redeploy the site

### Email goes to spam

**Solution:** 
1. Check your spam folder
2. Mark it as "Not spam"
3. Future emails will go to inbox

---

## 💡 Pro Tips

1. **Use resend.dev domain first** - It's pre-verified and works immediately
2. **Check Cloudflare logs** - They show exactly what's happening
3. **Test with a simple email first** - Use your personal email to test
4. **Verify in Resend dashboard** - See real-time email status

---

## 📧 Want to use your own domain?

Later, you can use your own domain (like `thomas-nicoli.pages.dev`):

1. Go to Resend → **Domains** → **Add Domain**
2. Add DNS records to Cloudflare DNS:
   - TXT record for SPF
   - CNAME records for DKIM
3. Wait for verification (up to 24 hours)
4. Update `MAIL_DOMAIN` in Cloudflare environment variables
5. Redeploy

But for now, just use `resend.dev` - it works out of the box! ✨

---

## Need More Help?

Read the detailed troubleshooting guide: `RESEND_TROUBLESHOOTING.md`
