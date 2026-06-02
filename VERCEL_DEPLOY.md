# Quick Vercel Deployment Guide

## ✅ What's Been Done

All frontend files have been updated to use your Render backend:
- Backend URL: `https://library-management-1-d3dx.onrender.com`
- All API calls now use `API_BASE_URL` from `src/config/api.ts`
- Environment files created (`.env.production` and `.env.local`)
- Vercel configuration file created (`vercel.json`)

## 🚀 Deploy to Vercel (3 Steps)

### Step 1: Push to GitHub
```bash
cd LibraryManagement-main
git add .
git commit -m "Configure frontend for production deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure settings:
   - **Root Directory:** `project`
   - **Framework:** Vite
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://library-management-1-d3dx.onrender.com`

6. Click **"Deploy"**

### Step 3: Test Your App

Once deployed (2-3 minutes), test:
- ✅ Login/Signup pages load
- ✅ Book catalog displays
- ✅ Admin dashboard works
- ✅ Notifications system functions

Your app will be live at: `https://your-project-name.vercel.app`

## 🔧 If You Need to Update Backend URL Later

Just edit this file:
```
project/.env.production
```

Then redeploy on Vercel (automatic if using Git integration).

---

**Note:** Free Render backend sleeps after inactivity. First request may take 30-60 seconds to wake up.
