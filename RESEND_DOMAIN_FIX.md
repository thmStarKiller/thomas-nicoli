# Fix: Domain Not Verified Error

## The Problem
You're seeing this error:
```
The thomas-nicoli.com domain is not verified. Please verify your domain on https://resend.com/domains
```

## Quick Solution (Recommended for Testing)

Use Resend's free testing domain `resend.dev` which doesn't require verification:

### In Cloudflare Pages Environment Variables:

1. Go to: **Cloudflare Dashboard** → **Pages** → **thomas-nicoli** → **Settings** → **Environment Variables**

2. Update or add these variables for **Production**:
   ```
   RESEND_API_KEY = re_csYxA9kg_4ac9SJPUQkLU7WTWhXAh8Bbo
   RESEND_TO = your-email@example.com
   MAIL_DOMAIN = resend.dev
   ```

3. Click **"Save"**

4. Go to **Deployments** tab and click **"Retry deployment"** on the latest deployment

### Testing Locally:

Update your `.env.local`:
```bash
RESEND_API_KEY=re_csYxA9kg_4ac9SJPUQkLU7WTWhXAh8Bbo
RESEND_TO=your-email@example.com
MAIL_DOMAIN=resend.dev
```

## Long-term Solution (Production)

If you want to use your own domain like `thomas-nicoli.com`:

### Step 1: Add Domain to Resend
1. Go to https://resend.com/domains
2. Click **"Add Domain"**
3. Enter your domain: `thomas-nicoli.com`

### Step 2: Add DNS Records
Resend will give you DNS records to add. You need to add them to your domain provider (Cloudflare, GoDaddy, etc.):

**Example records:**
```
Type: TXT
Name: @
Value: resend-verification-[your-code]

Type: MX
Name: @
Value: mx1.resend.com
Priority: 10

Type: MX  
Name: @
Value: mx2.resend.com
Priority: 20
```

### Step 3: Wait for Verification
- DNS propagation takes 5-60 minutes
- Click **"Verify"** in Resend dashboard once DNS is updated
- Status should change to "Verified" ✅

### Step 4: Update Environment Variables
Once verified, update `MAIL_DOMAIN`:
```bash
MAIL_DOMAIN=thomas-nicoli.com
```

## Important Notes

### About resend.dev
- ✅ Free to use
- ✅ No verification needed
- ✅ Perfect for testing
- ⚠️ Emails come from `onboarding@resend.dev`
- ⚠️ Lower deliverability than verified domain

### About Custom Domain
- ✅ Emails come from your domain
- ✅ Better deliverability
- ✅ More professional
- ⚠️ Requires DNS configuration
- ⚠️ Takes time to verify

## Testing After Fix

1. Go to your contact page: https://thomas-nicoli.pages.dev/contact
2. Fill out the form
3. Submit
4. Check your email inbox (and spam folder)
5. Check Cloudflare Functions logs for `[lead]` messages

## Troubleshooting

If emails still don't arrive:
- Check spam folder
- Verify `RESEND_TO` is correct
- Check Cloudflare Functions logs
- Visit https://resend.com/logs to see delivery status
- Make sure you redeployed after adding env vars
