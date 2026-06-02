# Frontend Deployment Guide - Vercel

## What I've Done For You:
✅ Created `.env.production` - for production environment
✅ Created `.env.local` - for local development  
✅ Created `src/config/api.ts` - centralized API configuration
✅ Created `vercel.json` - Vercel deployment config

---

## IMPORTANT: Update Your Backend URL

**Replace `your-backend-url` in `.env.production` with your actual Render backend URL:**

Example:
```
VITE_API_URL=https://library-backend-xyz.onrender.com
```

---

## Files That Need API URL Updates

You need to replace `http://localhost:5000` with `${API_BASE_URL}` in these files:

### Import statement to add at the top:
```typescript
import { API_BASE_URL } from '../config/api';
```

### Files to update:
1. `src/components/AdminMessages.tsx`
2. `src/components/AdminSidebar.tsx`
3. `src/components/Sidebar.tsx`
4. `src/components/UserMessages.tsx`
5. `src/pages/AdminBookCatalog.tsx`
6. `src/pages/AdminBookManagement.tsx`
7. `src/pages/AdminDashboard.tsx`
8. `src/pages/AdminLogin.tsx`
9. `src/pages/AdminSignup.tsx`
10. `src/pages/BookCatalog.tsx`
11. `src/pages/BorrowedBooks.tsx`
12. `src/pages/MyAccount.tsx`
13. `src/pages/StudentDashboard.tsx`
14. `src/pages/StudentLogin.tsx`
15. `src/pages/StudentSignup.tsx`
16. `src/pages/UserAccount.tsx`

### Example Change:
**Before:**
```typescript
const response = await fetch('http://localhost:5000/api/books');
```

**After:**
```typescript
import { API_BASE_URL } from '../config/api';
// ...
const response = await fetch(`${API_BASE_URL}/api/books`);
```

---

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push Your Code to GitHub:**
   ```bash
   cd LibraryManagement-main
   git add .
   git commit -m "Prepare frontend for Vercel deployment"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/)**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   
3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `project`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Add Environment Variable:**
   - Go to "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-render-backend.onrender.com`
   - Click "Deploy"

5. **Wait 2-3 minutes** for deployment to complete

6. **Your app will be live at:**
   ```
   https://your-project-name.vercel.app
   ```

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project folder:**
   ```bash
   cd project
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? (press enter for default)
   - In which directory is your code? **. (current directory)**
   
5. **Add environment variable:**
   ```bash
   vercel env add VITE_API_URL
   ```
   Enter your Render backend URL

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## Post-Deployment Checklist

✅ Update `.env.production` with real Render URL
✅ Update all API calls to use `API_BASE_URL`
✅ Push code to GitHub
✅ Deploy to Vercel
✅ Test login functionality
✅ Test book catalog loading
✅ Test admin and student features
✅ Check browser console for errors

---

## Common Issues & Fixes

### Issue: API calls failing (CORS errors)
**Fix:** Update your backend `src/server.js` to allow your Vercel domain:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-app.vercel.app'],
  credentials: true
}));
```

### Issue: 404 on page refresh
**Fix:** Already handled by `vercel.json` rewrites configuration ✅

### Issue: Environment variables not working
**Fix:** 
- Make sure variables start with `VITE_`
- Redeploy after adding env vars
- Clear browser cache

### Issue: Build fails
**Fix:** Test build locally first:
```bash
cd project
npm run build
npm run preview
```

---

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors  
3. Verify your Render backend is running
4. Test backend API directly: `https://your-backend.onrender.com/api/books`
