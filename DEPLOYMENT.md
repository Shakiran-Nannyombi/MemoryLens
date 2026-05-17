# MemoryLens - Vercel Deployment Guide

## Quick Deploy to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account (free tier works)
- Your code pushed to GitHub

### 2. Deploy Steps

#### Option A: Deploy via Vercel Dashboard (Easiest)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

### 3. Environment Variables (Optional)

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GROQ_API_KEY=your_groq_key
VITE_MIDNIGHT_NETWORK=testnet
VITE_MIDNIGHT_CONTRACT_ADDRESS=your_contract_address
```

**Note:** The app works without these for demo purposes!

### 4. Demo Login Credentials

For hackathon demos, use:
- **Email:** demo@memorylens.app
- **Password:** demo123

Or click "Use Demo Login" button on the login page.

### 5. Features Working in Demo

✅ Face detection and recognition
✅ Object detection (80+ object classes)
✅ Voice assistant (speech recognition)
✅ Caregiver dashboard
✅ Privacy dashboard
✅ Midnight blockchain integration (mock mode)
✅ Storage toggle (Supabase/Midnight)
✅ Wallet connection UI

### 6. Post-Deployment

Your app will be live at: `https://your-project-name.vercel.app`

**Test the deployment:**
1. Open the URL
2. Allow camera permissions
3. Point camera at objects/people
4. Click mic button for voice assistant
5. Login with demo credentials to access dashboard

### 7. Custom Domain (Optional)

In Vercel Dashboard:
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check that `frontend/package.json` has all dependencies
- Ensure Node version is 18+ (set in Vercel settings if needed)

### Camera Not Working
- HTTPS is required for camera access (Vercel provides this automatically)
- User must grant camera permissions

### Models Loading Slowly
- First load downloads AI models (~10MB)
- Subsequent loads use browser cache

## Support

For issues, check:
- Vercel deployment logs
- Browser console for errors
- Network tab for failed requests

---

**Ready for your hackathon demo! 🚀**
