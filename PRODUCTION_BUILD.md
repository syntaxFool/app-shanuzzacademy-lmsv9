# Production Build Guide - Security & Performance

This guide explains how to set up a secure, production-ready build of Shanuzz Academy LMS v9.

## Supply Chain Security

The `index.html` uses **stable CDN scripts** for development. For production, use local builds and SRI verification.

### Current Setup
- ✅ **Tailwind CSS v3** - CDN for dev, local build for production
- ✅ **Phosphor Icons** - Latest stable version
- ✅ **Chart.js v4.4.0** - Pinned version

## Development vs. Production

### Development (Local Testing)

If you get CORS errors with Live Server (http://127.0.0.1:5500):

**Option A: Use a proper HTTP server** (Recommended)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Then open: http://localhost:8000
```

**Option B: Disable Live Server security checks**
- Some local servers have stricter CORS policies
- Using `python -m http.server` avoids this entirely

### Production (Deployment)

#### Prerequisites
```bash
npm install -D tailwindcss postcss
```

#### Setup
1. Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

2. Create `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. Create `input.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Build
```bash
npx tailwindcss -i input.css -o dist/output.css --minify
```

#### Update HTML
Replace the Tailwind CDN script with:
```html
<link rel="stylesheet" href="dist/output.css">
```

### Option 2: Keep CDN (Development/Rapid Deployment)

If using the CDN in production, the current setup is secure with:
- Version pinning (v3.4.1)
- SRI integrity hash verification
- Crossorigin attribute for CORS protection

## Additional Security Recommendations

### 1. Content Security Policy (CSP)
Add this header in your web server configuration or `<meta>` tag:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://cdn.tailwindcss.com https://unpkg.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://script.google.com;
">
```

### 2. Dependency Updates
Monitor for security updates:
```bash
npm outdated
npm audit
```

### 3. HTTPS Only
Ensure all external resources are loaded over HTTPS (not HTTP).

### 4. Subresource Integrity Verification
To compute SRI hashes for new versions:
```bash
# Linux/macOS
curl https://cdn.jsdelivr.net/npm/package@version/file.js | openssl dgst -sha384 -binary | openssl enc -base64 -A

# Or use online tool: https://www.srihash.org/
```

## Deployment Checklist

- [ ] Tailwind CSS: Use local build or verify CDN SRI hash
- [ ] Phosphor Icons: Verify v2.1.1 with SRI hash
- [ ] Chart.js: Verify v4.4.0 with SRI hash
- [ ] All scripts have `crossorigin="anonymous"`
- [ ] Google Apps Script URL uses HTTPS
- [ ] Content-Security-Policy header configured
- [ ] HTTPS enabled on all domains
- [ ] Regular security audits scheduled

## Version Pinning Strategy

For long-term maintenance, prefer these versions:
- **Tailwind CSS**: v3.4.x (LTS-like stability)
- **Phosphor Icons**: v2.1.x (stable icon set)
- **Chart.js**: v4.4.x (stable charting)

When updating, always:
1. Verify changelog for breaking changes
2. Recompute SRI hashes
3. Test thoroughly in development
4. Update this documentation
5. Tag release with version bump
