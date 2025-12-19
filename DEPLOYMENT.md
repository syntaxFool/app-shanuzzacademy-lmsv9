# Deployment Guide - Shanuzz Academy LMS

## Overview
This guide covers deploying the Shanuzz Academy LMS to Netlify, which provides a fast, secure, and scalable hosting platform for Vue.js applications.

## Prerequisites
- A GitHub account
- A Netlify account (free tier available)
- The project pushed to GitHub
- Google Apps Script backend configured and deployed as a web app

## Step-by-Step Deployment

### 1. Prepare Your Project

#### Build the Application
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

#### Test the Build Locally
```bash
npm run preview
```

Visit `http://localhost:4173` to verify the build works correctly.

### 2. Configure Environment Variables

Create environment-specific configurations:

#### Development (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=Shanuzz Academy LMS
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

#### Production (.env.production)
```env
VITE_API_BASE_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_APP_TITLE=Shanuzz Academy LMS
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

Replace `YOUR_SCRIPT_ID` with your actual Google Apps Script ID.

### 3. Deploy to Netlify

#### Option A: Connect GitHub Repository (Recommended)

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/shanuzz-lms.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Log in to [netlify.com](https://app.netlify.com)
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose the `shanuzz-lms` repository
   - Click "Deploy site"

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

#### Option B: Manual Deployment via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir dist
   ```

### 4. Set Environment Variables on Netlify

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add the following environment variables:
   - `VITE_API_BASE_URL`: Your Google Apps Script web app URL
   - `VITE_APP_TITLE`: Shanuzz Academy LMS
   - `VITE_APP_VERSION`: 1.0.0
   - `NODE_ENV`: production

### 5. Configure CORS for Google Apps Script

In your Google Apps Script backend, ensure CORS headers are set:

```javascript
function doPost(e) {
  // ... your code ...
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', 'https://your-netlify-domain.netlify.app')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}
```

### 6. Domain Configuration

1. **Custom Domain** (optional)
   - Go to **Site settings** → **Domain management**
   - Click "Add custom domain"
   - Follow DNS configuration steps

2. **HTTPS** (automatic)
   - Netlify provides free HTTPS via Let's Encrypt
   - Automatic SSL certificate renewal

### 7. Monitor & Maintain

#### View Deployment Status
- Go to **Deploys** to see deployment history
- Check build logs for any errors

#### Enable Notifications
- Go to **Site settings** → **Notifications**
- Set up Slack, email, or webhook notifications

#### Monitor Performance
- Use Netlify Analytics to track performance
- Check Lighthouse scores in deploy previews

## Troubleshooting

### Build Failures
1. Check build logs in Netlify dashboard
2. Common issues:
   - Missing environment variables
   - Node version mismatch
   - Dependency installation failure

**Solution:**
```bash
# Clear cache and rebuild
npm ci
npm run build
```

### Blank Page After Deployment
- Check browser console for errors
- Verify API_BASE_URL is correct
- Ensure Google Apps Script CORS headers are configured

### Authentication Issues
- Verify localStorage is enabled in browser
- Check if auth token is being stored
- Confirm Google Apps Script endpoints are accessible

### Slow Performance
- Check Lighthouse scores
- Enable asset optimization in vite.config.ts
- Use CDN for images and static files

## Environment-Specific Configuration

### Development
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Testing
```bash
npm run build
npm run preview
# Test build on http://localhost:4173
```

### Production
```bash
npm run build
# Deploy dist/ folder to Netlify
```

## Git Workflow for Deployments

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# Netlify will create a deploy preview

# After approval, merge to main
git checkout main
git merge feature/new-feature
git push origin main

# Netlify automatically deploys to production
```

## Rollback to Previous Version

If deployment issues occur:

1. Go to **Deploys** in Netlify
2. Find the previous working deployment
3. Click **Publish deploy**

Your site will immediately revert to that version.

## Monitoring & Analytics

### Netlify Analytics
- Track page views, referrers, and top pages
- Monitor bandwidth usage
- Track unique visitors

### Custom Monitoring
- Set up Google Analytics for detailed insights
- Use Sentry for error tracking
- Monitor API performance

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Store sensitive data in Netlify secrets
3. **HTTPS**: Always enabled, enforced redirects
4. **Headers**: Configure security headers in netlify.toml
5. **Rate Limiting**: Implement on Google Apps Script backend

## Continuous Integration/Deployment (CI/CD)

Netlify automatically:
- Builds on every push to main branch
- Creates deploy previews for pull requests
- Notifies on build status

### Disable Auto-Deploy
If needed, go to **Site settings** → **Build & deploy** → **Deploy contexts** and disable auto-publishing.

## Support & Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Vue 3 Deployment Guide](https://vuejs.org/guide/best-practices/production-deployment.html)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Google Apps Script Limits](https://developers.google.com/apps-script/guides/services/quotas)

---

**Last Updated**: December 19, 2025
**Version**: 1.0.0
