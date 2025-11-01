# Deployment Guide

## Deploying to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account (mhansen003)

2. Click "Add New" → "Project"

3. Import your GitHub repository:
   - Search for `cmg-landing`
   - Click "Import"

4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. Click "Deploy"

6. Your site will be deployed to a URL like: `https://cmg-landing-xxxx.vercel.app`

7. (Optional) Add a custom domain:
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `tools.cmgfinancial.com`)
   - Follow the DNS configuration instructions

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd C:\github\cmg-landing

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Environment Variables

If you need to add environment variables:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add any required variables
4. Redeploy the project

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to the `master` branch
- **Preview**: Every pull request

### Post-Deployment Steps

1. Test the deployed site thoroughly
2. Update the DNS records if using a custom domain
3. Share the URL with the CMG team

### Updating the Site

To update the site, simply push changes to GitHub:

```bash
git add .
git commit -m "Your update message"
git push origin master
```

Vercel will automatically detect the push and redeploy.

### Adding Video Files

When adding video files:

1. Upload videos to the `public` folder in your project
2. Update the `videoUrl` in `app/page.tsx`
3. Commit and push:
   ```bash
   git add .
   git commit -m "Add video for [tool name]"
   git push origin master
   ```

### Monitoring

- View deployment status: [Vercel Dashboard](https://vercel.com/dashboard)
- Check analytics: Project → Analytics tab
- View logs: Project → Deployments → Select deployment → View Logs

### Troubleshooting

**Build fails:**
- Check the build logs in Vercel Dashboard
- Ensure all dependencies are in package.json
- Test the build locally: `npm run build`

**Site not updating:**
- Check if the deployment succeeded in Vercel Dashboard
- Clear your browser cache
- Check if you pushed to the correct branch

**Custom domain issues:**
- Verify DNS records are correctly configured
- Wait for DNS propagation (can take up to 48 hours)
- Check domain settings in Vercel Dashboard

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
