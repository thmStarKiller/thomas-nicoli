# Resend Email Service Setup

## 📧 Overview
Your contact form is configured to send emails using [Resend](https://resend.com/), a modern email API for developers.

## ✅ Current Status
- ✅ Resend SDK integrated in `/api/lead` route
- ✅ Beautiful HTML email template with gradient header
- ✅ Plain text fallback for email clients
- ✅ Form validation with Zod schema
- ✅ Edge runtime compatible
- ✅ GDPR-compliant consent checkbox

## 🔧 Environment Variables Required

Add these to your Cloudflare Pages environment variables:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_TO=your-email@example.com
MAIL_DOMAIN=your-domain.com
```

### Getting Your Resend API Key:

1. **Sign up for Resend**: https://resend.com/signup
2. **Verify your domain**:
   - Go to Domains → Add Domain
   - Add DNS records (TXT, CNAME, MX) to your domain provider
   - Wait for verification (usually 5-10 minutes)
3. **Create API Key**:
   - Go to API Keys → Create API Key
   - Name it (e.g., "Production - thomas-nicoli.com")
   - Copy the key (starts with `re_`)
4. **Add to Cloudflare**:
   - Go to your Cloudflare Pages project
   - Settings → Environment variables
   - Add `RESEND_API_KEY` with your key
   - Add `RESEND_TO` with your email address
   - Add `MAIL_DOMAIN` with your verified domain

## 📋 Email Template Features

The email includes:
- **Gradient header** with "🎯 New Lead Submission" title
- **Formatted contact info table**:
  - Name with 👤 icon
  - Email (clickable mailto link)
  - Company (if provided)
  - Website (clickable link, if provided)
- **Message box** with border and background
- **Reply button** that opens email client
- **Footer** with timestamp and source info
- **Responsive design** works on desktop and mobile

## 🧪 Testing

### Local Development (without Resend):
When `RESEND_API_KEY` is not set, the API will:
- Log the form data to console
- Return `{ok: true, sent: false}`
- Allow form testing without sending emails

### With Resend API Key:
1. Fill out the contact form on `/contact`
2. Submit the form
3. Check your `RESEND_TO` email inbox
4. You should receive a beautifully formatted email

### Test Email Content:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "company": "Test Company",
  "website": "https://example.com",
  "message": "This is a test message to verify email delivery.",
  "consent": true
}
```

## 📊 Monitoring

### Check Email Delivery:
1. **Resend Dashboard**: https://resend.com/emails
   - See all sent emails
   - Check delivery status
   - View bounce/complaint rates
   - Read error logs

### Check Cloudflare Logs:
1. Go to Cloudflare Pages → Functions
2. View real-time logs
3. Look for `[lead]` log entries
4. Check for any Resend errors

## 🔒 Security Best Practices

1. **Never commit API keys** to git
2. **Use environment variables** for all secrets
3. **Validate form input** (already implemented with Zod)
4. **Require consent** (already implemented)
5. **Rate limit** (consider adding Cloudflare rate limiting rules)

## 💰 Pricing

Resend offers:
- **Free tier**: 100 emails/day, 3,000/month
- **Pro**: $20/month for 50,000 emails/month
- **Enterprise**: Custom pricing

For a freelance website, the free tier should be more than sufficient!

## 🚨 Troubleshooting

### "Resend error" in logs:
- **Check API key** is correct and not expired
- **Verify domain** in Resend dashboard
- **Check DNS records** are properly configured
- **Ensure `MAIL_DOMAIN`** matches verified domain

### Emails not arriving:
- **Check spam folder** in your inbox
- **Verify `RESEND_TO`** email address is correct
- **Check Resend dashboard** for delivery status
- **Test with different email providers** (Gmail, Outlook, etc.)

### Form validation errors:
- **Name**: minimum 2 characters
- **Email**: must be valid email format
- **Message**: minimum 10 characters
- **Consent**: must be checked

## 🎨 Customizing the Email Template

To modify the email design, edit:
```
src/app/api/lead/route.ts
```

Look for the `htmlEmail` template string. You can:
- Change colors (currently blue-purple gradient)
- Modify layout and spacing
- Add/remove fields
- Change icons and emojis
- Adjust typography

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)

## ✅ Production Checklist

Before going live:
- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] API key generated
- [ ] Environment variables set in Cloudflare
- [ ] Test email sent successfully
- [ ] Emails arriving in inbox (not spam)
- [ ] Form validation working
- [ ] Mobile email display tested
- [ ] Auto-reply configured (optional)
- [ ] Email signatures added (optional)

---

**Ready to receive leads!** 🚀
