# Netlify Environment Variables Fix

## The Problem

Netlify environment variables are not automatically available to static HTML/JavaScript files.

```
Netlify Dashboard
       ↓
Environment Variables (VITE_CONVEX_URL)
       ↓
[NOT AUTOMATICALLY AVAILABLE]
       ↓
Static HTML/JS files
       ↓
convex.js still uses hardcoded URL
       ↓
Data goes to wrong place or fails
```

---

## The Solution

### How Netlify Exposes Env Vars

Netlify exposes environment variables prefixed with `VITE_` as JavaScript globals:

| Netlify Env Var | JavaScript Access |
|-----------------|-------------------|
| `VITE_CONVEX_URL` | `window.VITE_CONVEX_URL` |
| `VITE_API_KEY` | `window.VITE_API_KEY` |

---

## Changes Made

### 1. index.html - Added pre-load script

**Location:** `src/index.html` (line ~14)

```html
<!-- Convex API Client -->
<!-- Set Convex URL from Netlify env var (exposed via window.CONVEX_SITE_URL) -->
<script>
  // Netlify exposes env vars prefixed with VITE_ as window.VITE_* 
  // If not available, fallback to the default
  window.CONVEX_SITE_URL = window.VITE_CONVEX_URL || window.CONVEX_SITE_URL || 'https://striped-meadowlark-10.convex.cloud';
  console.log('Convex URL:', window.CONVEX_SITE_URL);
</script>
<script src="./convex.js"></script>
```

### 2. convex.js - Use global URL

**Location:** `src/convex.js` (line ~6)

```javascript
// Before (hardcoded):
const CONVEX_URL = "https://striped-meadowlark-10.convex.cloud";

// After (dynamic via Netlify Build):
const CONVEX_URL = window.CONVEX_SITE_URL || 'https://striped-meadowlark-10.convex.cloud';

---

## 3. netlify.toml - Build Step (CRITICAL)

Since this is a static site without a JS bundler (like Vite), Netlify environment variables are NOT available at runtime. We must inject them during the build process using `sed`.

**Location:** `netlify.toml`

```toml
[build]
  publish = "src"
  # Replace the hardcoded fallback with the actual VITE_CONVEX_URL env var during build
  command = "sed -i 's|https://striped-meadowlark-10.convex.cloud|'\"$VITE_CONVEX_URL\"'|g' src/index.html src/convex.js"
```
```

---

## How to Configure in Netlify

### Step 1: Add Environment Variable

1. Go to **Netlify Dashboard**
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add new variable:

| Key | Value |
|-----|-------|
| `VITE_CONVEX_URL` | `https://your-convex-deployment.convex.cloud` |

### Step 2: Rebuild

Trigger a new deployment (push a commit or manually rebuild)

### Step 3: Verify

Open browser console - you should see:
```
Convex URL: https://your-convex-deployment.convex.cloud
✓ LexisLaw Convex HTTP client initialized
```

---

## Alternative: Using window global directly

If you want to manually override without Netlify config:

```html
<script>
  // Manually override (for testing)
  window.CONVEX_SITE_URL = 'https://your-new-url.convex.cloud';
</script>
<script src="./convex.js"></script>
```

---

## Files Modified

| File | Change |
|------|--------|
| `src/index.html` | Added pre-load script to set Convex URL |
| `src/convex.js` | Changed hardcoded URL to use global variable |

---

## Troubleshooting

### Console shows old URL
- **Cause:** Browser cache
- **Fix:** Hard refresh (Ctrl+Shift+R) or clear cache

### Console shows "undefined"
- **Cause:** Netlify env var not set correctly
- **Fix:** Check Netlify dashboard → Environment variables

### Still not working
- **Cause:** Deployment not rebuilt
- **Fix:** Trigger a new deployment

---

*Document created: 2026-03-04*
