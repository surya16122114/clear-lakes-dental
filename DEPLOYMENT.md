# Deployment Guide for Clear Lakes Dental

This guide will help you deploy your Nuxt 3 application to Vercel.

## Prerequisites
 Project builds successfully (`npm run build` works)
 Git repository initialized
 Environment variables ready (from your `.env` file)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account

3. **Import your project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository (`clear-lakes-dental`)
   - Click "Import"

4. **Configure the project**:
   - **Framework Preset**: Vercel will auto-detect "Nuxt.js"
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: Leave empty (Nuxt 3 handles this automatically)
   - **Install Command**: `npm install` (auto-filled)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_KEY` = Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key

   **Important**: Add these for all environments (Production, Preview, Development)

6. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Confirm settings
   - Add environment variables when prompted

4. **Set Environment Variables** (if not set during deployment):
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Post-Deployment Checklist

- [ ] Test the deployed URL
- [ ] Verify authentication (login/signup) works
- [ ] Test adding data
- [ ] Test viewing data
- [ ] Check that environment variables are set correctly
- [ ] Verify HTTPS is working (Vercel provides this automatically)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### Environment Variables Not Working
- Double-check variable names (case-sensitive)
- Ensure variables are added to all environments
- Redeploy after adding variables

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check Supabase dashboard for authentication settings
- Ensure email/password auth is enabled in Supabase

### Database Connection Issues
- Verify RLS policies in Supabase (or disable RLS if needed)
- Check that the `entries` table exists
- Verify table schema matches your code

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production
- Other branches → Preview deployments

Each pull request gets its own preview URL!

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Nuxt 3 Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [Supabase Documentation](https://supabase.com/docs)

