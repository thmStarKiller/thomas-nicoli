# Deploying to Cloudflare Pages

This guide explains how to deploy your Next.js application to Cloudflare Pages with full support for API routes, streaming, and edge functions.

## 📋 Prerequisites

- A Cloudflare account (free tier works fine)
- Node.js 18+ installed locally
- Git repository connected to GitHub (already done ✅)

## 🚀 Deployment Options

### Option 1: Automatic Deployment via GitHub (Recommended)

This is the easiest method - Cloudflare will automatically build and deploy on every push.

#### Step 1: Connect to Cloudflare Pages

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to **Workers & Pages** → **Create application** → **Pages**

2. **Connect to Git**
   - Click **Connect to Git**
   - Select **GitHub** and authorize Cloudflare
   - Choose the repository: `thmStarKiller/thomas-nicoli`

3. **Configure Build Settings**
   ```
   Project name: thomas-nicoli
   Production branch: main
   
   Build command: npm run pages:build
   Build output directory: .vercel/output/static
   
   Root directory: (leave empty)
   ```

4. **Set Environment Variables**
   - Click **Environment variables (advanced)**
   - Add the following variables:

   ```
   OPENAI_API_KEY=<your-openai-key>
   GOOGLE_API_KEY=<your-google-key>
   GEMINI_MODEL=gemini-2.5-pro
   RESEND_API_KEY=<your-resend-key>
   RESEND_TO=<your-email>
   SITE_URL=https://thomas-nicoli.pages.dev
   NODE_VERSION=18
   ```

   > **Note**: You can add different values for Production vs Preview environments

5. **Deploy**
   - Click **Save and Deploy**
   - Wait 3-5 minutes for the build to complete
   - Your site will be live at `https://thomas-nicoli.pages.dev`

#### Step 2: Configure Custom Domain (Optional)

1. Go to **Custom domains** in your Pages project
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `thomas-nicoli.com`)
4. Follow DNS configuration instructions
5. Cloudflare will automatically provision SSL certificate

---

### Option 2: Manual Deployment via Wrangler CLI

For more control or CI/CD pipelines.

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

#### Step 2: Authenticate

```bash
wrangler login
```

This will open a browser window to authenticate with Cloudflare.

#### Step 3: Build and Deploy

```bash
# Build the Next.js app for Cloudflare
npm run build:cloudflare

# Deploy to Cloudflare Pages
npm run pages:deploy
```

#### Step 4: Set Environment Variables

```bash
# Production variables
wrangler pages secret put OPENAI_API_KEY
wrangler pages secret put GOOGLE_API_KEY
wrangler pages secret put RESEND_API_KEY
# ... etc

# Or use bulk upload
wrangler pages secret bulk .env.production
```

---

## 🔧 Configuration Details

### Next.js Configuration

The `next.config.ts` has been configured for Cloudflare:

```typescript
{
  experimental: {
    serverComponentsExternalPackages: ['minisearch'],
  },
  images: {
    unoptimized: true, // Cloudflare has its own image optimization
  },
}
```

### API Routes

Your API routes (`/api/chat` and `/api/lead`) will automatically run on Cloudflare's edge network using Workers.

**Edge Runtime Features:**
- Global deployment (low latency worldwide)
- Automatic scaling
- Streaming responses supported ✅
- OpenAI SDK compatible ✅

### Environment Variables

Required variables:
- `OPENAI_API_KEY` - For AI chat functionality
- `GOOGLE_API_KEY` - For Gemini fallback
- `GEMINI_MODEL` - Model name (default: `gemini-2.5-pro`)
- `RESEND_API_KEY` - For contact form emails
- `RESEND_TO` - Your email address
- `SITE_URL` - Your site URL for proper redirects

Optional:
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` - Analytics
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - Analytics

### Build Commands

Available npm scripts:

```bash
npm run build:cloudflare  # Build for Cloudflare (standard Next.js build)
npm run pages:build       # Build using @cloudflare/next-on-pages
npm run pages:deploy      # Deploy to Cloudflare Pages
npm run pages:dev         # Test locally with Cloudflare Workers runtime
```

---

## 🧪 Testing Locally with Cloudflare Runtime

To test your app with Cloudflare's Workers runtime before deploying:

```bash
# Build for Cloudflare
npm run pages:build

# Run local dev server with Workers runtime
npm run pages:dev
```

This spins up a local server at `http://localhost:8788` that mimics the Cloudflare Pages environment.

---

## 🔍 Monitoring and Logs

### View Deployment Logs

1. Go to Cloudflare Dashboard → **Workers & Pages**
2. Select your project
3. Click on a deployment to see build logs

### Real-time Analytics

Cloudflare provides:
- **Web Analytics**: Page views, visitors, bandwidth
- **Workers Analytics**: Request volume, CPU time, errors
- Available in dashboard under **Analytics**

### Error Tracking

Check logs in real-time:

```bash
wrangler pages deployment tail
```

Or view in dashboard under **Logs** tab.

---

## 🚨 Troubleshooting

### Build Fails

**Issue**: Build command fails with module errors

**Solution**: Ensure `NODE_VERSION=18` is set in environment variables

```bash
# Check build locally first
npm run build:cloudflare
```

### API Routes Not Working

**Issue**: API routes return 404 or 500 errors

**Solution**: 
1. Verify environment variables are set correctly
2. Check that API routes use edge-compatible code
3. Review build output for errors

```bash
# Test API route locally
curl https://your-site.pages.dev/api/chat
```

### Streaming Not Working

**Issue**: Chat responses don't stream

**Solution**: Verify response headers in `src/app/api/chat/route.ts`:

```typescript
headers: {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  'Connection': 'keep-alive',
}
```

### Environment Variables Not Loading

**Issue**: Features fail due to missing env vars

**Solution**:
1. Go to Pages project → **Settings** → **Environment variables**
2. Ensure variables are set for correct environment (Production/Preview)
3. Redeploy to pick up new variables

---

## 🎯 Performance Optimization

### Image Optimization

Cloudflare Pages includes automatic image optimization:
- Automatic WebP/AVIF conversion
- Responsive image sizing
- CDN caching

To enable, update `next.config.ts`:

```typescript
images: {
  loader: 'custom',
  loaderFile: './cloudflare-image-loader.js',
}
```

### Caching Strategy

Cloudflare automatically caches static assets. For API routes:

```typescript
// Add cache headers in API routes
export const runtime = 'edge';
export const revalidate = 60; // Cache for 60 seconds
```

### Edge Functions

Your API routes run on Cloudflare's edge network (300+ locations worldwide):
- Average response time: 50-100ms
- Automatic scaling to handle traffic spikes
- No cold starts

---

## 📊 Comparison: Vercel vs Cloudflare Pages

| Feature | Vercel | Cloudflare Pages |
|---------|--------|------------------|
| **Free Tier** | 100GB bandwidth | Unlimited bandwidth |
| **Edge Locations** | ~100 | 300+ |
| **Build Minutes** | 6,000/month | 500/month |
| **API Routes** | Serverless Functions | Edge Workers |
| **Cold Starts** | 50-200ms | None |
| **Image Optimization** | Built-in | Built-in |
| **Analytics** | Basic | Advanced (free) |
| **DDoS Protection** | Yes | Yes (enterprise-grade) |

**Cloudflare Advantages:**
- ✅ Unlimited bandwidth on free tier
- ✅ More edge locations (better global performance)
- ✅ No cold starts for edge functions
- ✅ Built-in DDoS protection
- ✅ Advanced analytics included

**Vercel Advantages:**
- ✅ More generous build minutes
- ✅ Better Next.js integration (official)
- ✅ Easier deployment (zero config)

---

## 🔐 Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use Cloudflare's encrypted secrets for sensitive data
- ✅ Rotate API keys regularly
- ✅ Use different keys for production vs preview

### API Rate Limiting

Consider adding rate limiting to API routes:

```typescript
// Example rate limiting middleware
import { RateLimiter } from '@cloudflare/workers-types';

export const runtime = 'edge';

// Limit to 10 requests per minute per IP
const rateLimiter = new RateLimiter({
  limit: 10,
  window: 60,
});
```

### CORS Configuration

API routes already include proper CORS headers:

```typescript
headers: {
  'Access-Control-Allow-Origin': process.env.SITE_URL,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
```

---

## 🎉 Post-Deployment Checklist

After successful deployment:

- [ ] Test homepage loads correctly
- [ ] Test all navigation links work
- [ ] Test AI chat functionality (`/en/chat`, `/es/chat`)
- [ ] Test contact form submits emails
- [ ] Test language switching (EN/ES)
- [ ] Test responsive design on mobile
- [ ] Verify SEO meta tags are correct
- [ ] Check sitemap.xml is accessible
- [ ] Test API routes return expected data
- [ ] Monitor analytics and error logs

---

## 📞 Support

### Cloudflare Pages Support

- Documentation: https://developers.cloudflare.com/pages/
- Community Discord: https://discord.gg/cloudflaredev
- Status Page: https://www.cloudflarestatus.com/

### Next.js on Cloudflare

- Guide: https://developers.cloudflare.com/pages/framework-guides/nextjs/
- GitHub: https://github.com/cloudflare/next-on-pages

---

## 🚀 Quick Deploy Commands

```bash
# Complete deployment workflow
npm run build:cloudflare && npm run pages:deploy

# Or use automatic GitHub deployment (recommended)
git push origin main
```

---

**Your app is now ready for Cloudflare Pages! 🎊**

The configuration is complete - just push to GitHub and Cloudflare will handle the rest!
