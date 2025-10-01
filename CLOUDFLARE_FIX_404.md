# Fixing Cloudflare Pages 404 and "Static Site" Issues

## 🚨 Problem
You're seeing:
- "You can not tail this deployment as it does not have a Pages Function" 
- 404 errors on all pages
- Deployment succeeds but site doesn't work

## 🔍 Root Cause
Cloudflare is building your site with the **standard Next.js build** instead of the **Cloudflare Pages adapter**. This creates a static site without the necessary routing and serverless functions.

## ✅ Solution: Update Build Configuration

### Step 1: Go to Cloudflare Pages Settings
1. Open https://dash.cloudflare.com/
2. Navigate to **Workers & Pages** → Your project (`thomas-nicoli`)
3. Go to **Settings** → **Builds & deployments**

### Step 2: Update Build Settings
Click **Configure Production deployments** and change:

**BEFORE (Wrong):**
```
Build command: npm run build:cloudflare
Build output directory: .next
```

**AFTER (Correct):**
```
Build command: npm run pages:build
Build output directory: .vercel/output/static
```

### Step 3: Environment Variables
Make sure these are set in **Settings** → **Environment variables**:

#### Required for Build:
- `NODE_VERSION` = `18` (or higher)

#### Required for Runtime:
- `OPENAI_API_KEY` = your OpenAI API key
- `GOOGLE_API_KEY` = your Google API key (for Gemini)
- `GEMINI_MODEL` = `gemini-2.5-pro`
- `RESEND_API_KEY` = your Resend API key
- `RESEND_TO` = your email address
- `MAIL_DOMAIN` = your mail domain
- `SITE_URL` = `https://thomas-nicoli.pages.dev` (or your custom domain)
- `DEFAULT_LOCALE` = `es`

#### Required Compatibility Flags:
Go to **Settings** → **Functions** → **Compatibility flags**
- Add: `nodejs_compat`

### Step 4: Trigger Rebuild
1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment
   
   OR
   
3. Make a small commit and push to GitHub to trigger auto-deploy

## 📊 What Changed?

### Build Command: `npm run pages:build`
This runs `@cloudflare/next-on-pages` which:
- Converts Next.js App Router to Cloudflare Workers format
- Creates proper routing configuration (`_routes.json`)
- Bundles API routes as edge functions
- Handles middleware correctly

### Output Directory: `.vercel/output/static`
The Cloudflare adapter outputs to this directory (Vercel's build cache format), which includes:
- Static assets
- Prerendered pages
- Serverless function configurations
- Routing rules

## 🧪 Verify Success

After redeploying, you should see:
1. ✅ Build logs show `@cloudflare/next-on-pages` running
2. ✅ Deployment type shows **Pages with Functions** (not static)
3. ✅ You can access pages like `/en` and `/es`
4. ✅ API routes work: `/api/chat`, `/api/lead`
5. ✅ No 404 errors on routes

## 🔧 Alternative: Standard Build (If Adapter Fails)

If the adapter approach continues to cause issues, you can use standard Next.js build but you'll lose some edge function capabilities:

```
Build command: npm run build
Build output directory: .next
Framework preset: Next.js
```

**Trade-offs:**
- ❌ API routes might not work properly
- ❌ Middleware might have issues
- ✅ Static pages will work
- ✅ Faster build times

## 📝 Technical Details

### Why This Happens
Next.js is designed for Vercel, which has native Next.js support. Cloudflare Pages needs an adapter to convert Next.js conventions to Cloudflare's Workers/Pages platform.

Without the adapter:
- Routes are treated as static files → 404 for dynamic routes
- API routes aren't converted to Workers → API calls fail
- Middleware doesn't run → internationalization breaks

### The Adapter's Job
`@cloudflare/next-on-pages` bridges the gap by:
1. Analyzing your Next.js build output
2. Creating Cloudflare Workers for each route
3. Generating `_routes.json` for routing
4. Bundling dependencies for edge runtime
5. Creating proper cache headers

## 🆘 Still Having Issues?

### Check Build Logs
Look for these indicators of success:
```
✓ Generating _routes.json
✓ Vercel Output API Build
✓ Completed @cloudflare/next-on-pages
```

### Common Errors

**"Cannot find module '@cloudflare/next-on-pages'"**
- Solution: Rebuild after package.json update (we just fixed this)

**"Edge runtime not supported"**
- Check that API routes have `export const runtime = 'edge'`
- Check middleware has edge runtime export

**"nodejs_compat not enabled"**
- Add `nodejs_compat` to compatibility flags in Cloudflare settings

### Debug Steps
1. Check build output directory exists: `.vercel/output/static`
2. Verify `_routes.json` was created
3. Test API routes with curl: `curl https://your-site.pages.dev/api/chat`
4. Check Functions tab in Cloudflare dashboard

## 📚 Resources
- [Cloudflare Next.js Guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages Docs](https://github.com/cloudflare/next-on-pages)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
