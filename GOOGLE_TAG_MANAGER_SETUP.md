# Google Analytics & Tag Manager Setup Guide

This guide explains how Google Analytics 4 (GA4) and Google Tag Manager (GTM) are implemented on your website.

---

## ✅ What's Already Implemented

### Google Analytics 4 (GA4)
Your website has **direct GA4 tracking** implemented with Measurement ID: **G-TRSDJXRJD9**

### Google Tag Manager (GTM)
Your website also has **GTM** implemented with container ID: **GTM-57HZSFXQ**

> **Note**: You can use both GA4 and GTM together. GTM provides more flexibility for adding additional tracking tags beyond just Google Analytics.

### Implementation Details

Both tracking systems are added in `src/app/layout.tsx`:

1. **In the `<head>` section**:
   - GTM script
   - GA4 gtag.js script
2. **After the `<body>` tag**:
   - GTM noscript fallback iframe

---

## 🔧 Configuration

### Environment Variables (Optional)

You can override the default IDs using environment variables:

**In Cloudflare Pages:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add the following:
   - `NEXT_PUBLIC_GTM_ID` = `GTM-57HZSFXQ`
   - `NEXT_PUBLIC_GA4_ID` = `G-TRSDJXRJD9`
3. Save and deploy

**For local development:**
Add to your `.env.local` file:
```bash
NEXT_PUBLIC_GTM_ID=GTM-57HZSFXQ
NEXT_PUBLIC_GA4_ID=G-TRSDJXRJD9
```

> **Note**: If you don't set these variables, they will default to the values above.

---

## 📊 Google Analytics 4 (GA4)

### Verify GA4 is Working

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property with ID **G-TRSDJXRJD9**
3. Go to **Reports** → **Realtime**
4. Visit your website in another tab: `https://thomas-nicoli.com`
5. You should see yourself as an active user in real-time ✅

### What GA4 Tracks Automatically

- **Page views** - Every page visit
- **Scroll depth** - How far users scroll
- **Outbound clicks** - Clicks on external links
- **File downloads** - PDF, ZIP downloads
- **Video engagement** - If you have embedded videos
- **Site search** - If you implement search tracking

---

## � Google Tag Manager (GTM)

### 1. Access Your GTM Container

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Sign in with your Google account
3. Select your container: **GTM-57HZSFXQ**

### 2. Add Tags

You can now add various tracking tags through GTM:

- **Google Analytics 4 (GA4)**
- **Google Ads Conversion Tracking**
- **Facebook Pixel**
- **LinkedIn Insight Tag**
- **Custom JavaScript**
- And many more...

### 3. Set Up Triggers

Common triggers you can use:

- **Page View** - Fires on every page load
- **Click** - Track button clicks, link clicks
- **Form Submission** - Track contact form submissions
- **Scroll Depth** - Track how far users scroll
- **Custom Events** - Track specific user actions

### 4. Test Your Tags

Before publishing:

1. Click **Preview** in GTM
2. Enter your website URL: `https://thomas-nicoli.com`
3. Browse your site to test if tags fire correctly
4. Check the GTM debugger panel

### 5. Publish Changes

Once tested:

1. Click **Submit** in GTM
2. Add a version name (e.g., "Initial Setup - GA4 Added")
3. Click **Publish**

---

## 🎯 Recommended Tags to Add

### Google Analytics 4 (Recommended)

1. In GTM, click **Tags** → **New**
2. Choose **Google Analytics: GA4 Configuration**
3. Enter your GA4 Measurement ID (format: `G-XXXXXXXXXX`)
4. Set trigger to **All Pages**
5. Save and publish

### Google Ads Conversion Tracking

1. In GTM, click **Tags** → **New**
2. Choose **Google Ads Conversion Tracking**
3. Enter your Conversion ID and Label
4. Set trigger based on your conversion action (e.g., form submission)
5. Save and publish

---

## 🔍 Verify GTM is Working

### Method 1: Browser DevTools

1. Open your website: `https://thomas-nicoli.com`
2. Right-click → **Inspect** → **Console** tab
3. Type: `dataLayer`
4. You should see an array with GTM events

### Method 2: Google Tag Assistant

1. Install [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Navigate to your website
3. Click the extension icon
4. You should see **GTM-57HZSFXQ** detected

### Method 3: View Page Source

1. Go to `https://thomas-nicoli.com`
2. Right-click → **View Page Source**
3. Search for `GTM-57HZSFXQ`
4. You should find the GTM script in the `<head>` and noscript in the `<body>`

---

## 📈 Tracking Contact Form Submissions

To track when users submit your contact form:

### In GTM:

1. **Create a Trigger:**
   - Type: **Form Submission**
   - Name: "Contact Form Submit"
   - Fires on: **All Forms** (or specific form ID)

2. **Create a Tag:**
   - Type: **Google Analytics: GA4 Event**
   - Event name: `form_submit`
   - Parameters:
     - `form_name`: `contact`
     - `page_location`: `{{Page URL}}`
   - Trigger: Use the "Contact Form Submit" trigger

3. **Test and Publish**

---

## 🌍 Multi-Language Tracking

Your site has English and Spanish versions. You can track language preference:

### Add a Custom Variable in GTM:

1. Go to **Variables** → **New User-Defined Variable**
2. Variable Type: **JavaScript Variable**
3. Variable Name: `currentLanguage`
4. JavaScript Variable: `window.location.pathname.split('/')[1]`
5. Save

Now you can use `{{currentLanguage}}` in your tags to see which language version users are viewing.

---

## 🔒 Privacy & GDPR Compliance

### Important Considerations:

1. **Cookie Consent**: Ensure you have a cookie consent banner if targeting EU users
2. **Data Processing Agreement**: Sign Google's DPA in GTM settings
3. **Privacy Policy**: Update your privacy policy to mention GTM tracking

### Conditional Tag Firing (Optional):

You can configure tags to only fire after user consent using:
- GTM Consent Mode
- Custom JavaScript variable checking consent status

---

## 🛠️ Advanced Features

### Custom Events

You can fire custom events from your code:

```typescript
// Example: Track when user opens Nexus AI chat
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'chat_opened',
  chat_language: 'en',
  timestamp: new Date().toISOString()
});
```

Then create a trigger in GTM for the `chat_opened` event.

### E-commerce Tracking

If you add e-commerce features, you can track:
- Product views
- Add to cart
- Purchases
- Revenue

---

## 📚 Resources

- [Google Tag Manager Help Center](https://support.google.com/tagmanager)
- [GTM Fundamentals Course](https://analytics.google.com/analytics/academy/course/5)
- [Data Layer Documentation](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [GTM Debugging Guide](https://support.google.com/tagmanager/answer/6107056)

---

## ⚠️ Troubleshooting

### GTM Not Loading

1. Check browser console for errors
2. Verify `NEXT_PUBLIC_GTM_ID` is set correctly
3. Ensure ad blockers are disabled
4. Check network tab to see if GTM script is loaded

### Tags Not Firing

1. Use GTM Preview mode
2. Check trigger conditions
3. Verify tag configuration
4. Check browser console for JavaScript errors

### Multiple GTM Containers

If you accidentally have multiple GTM containers:
- Keep only one `NEXT_PUBLIC_GTM_ID`
- Remove duplicate GTM code
- Clear browser cache

---

**✨ Your GTM is now ready to use!**

The container **GTM-57HZSFXQ** is active on your website and will start collecting data as soon as you add tags in the GTM dashboard.
