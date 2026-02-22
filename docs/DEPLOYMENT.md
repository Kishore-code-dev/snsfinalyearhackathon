# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Quick Deploy (30 Minutes Total)

This guide will help you deploy your MVP to production with ZERO infrastructure management.

---

## 📦 DEPLOYMENT STACK

| Component | Service | Why | Cost |
|-----------|---------|-----|------|
| Frontend | Vercel | Zero-config Next.js, Auto SSL | FREE |
| Backend | Railway | Python/FastAPI, Auto deploy | $5/month |
| Database | Supabase | PostgreSQL + Auth + Storage | FREE (up to 500MB) |
| Domain | Namecheap | Professional URL | $10/year |

**Total Monthly Cost: ~$5** (can start with $0 using free tiers everywhere)

---

## 🎯 STEP 1: Deploy Backend to Railway (10 min)

### 1.1 Create Railway Account
- Go to: https://railway.app
- Sign up with GitHub

### 1.2 Create New Project
```bash
# In your terminal
cd c:/Users/kisho/sly
railway login
railway init
railway link
```

### 1.3 Add Environment Variables
In Railway dashboard, add:
```
OPENAI_API_KEY=your-key-here (optional for now)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 1.4 Deploy
```bash
railway up
```

You'll get a URL like: `https://your-app.railway.app`

---

## 🎯 STEP 2: Deploy Frontend to Vercel (5 min)

### 2.1 Install Vercel CLI
```powershell
npm i -g vercel
```

### 2.2 Deploy
```bash
cd c:/Users/kisho/sly
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- What's your project's name? **invoicely-ai**
- In which directory is your code? **.**
- Want to override settings? **N**

### 2.3 Set Environment Variable
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-app.railway.app
```

### 2.4 Redeploy with Env
```bash
vercel --prod
```

You'll get: `https://invoicely-ai.vercel.app`

---

## 🎯 STEP 3: Set Up Supabase Database (15 min)

### 3.1 Create Supabase Project
- Go to: https://supabase.com
- Create new project
- Choose region (closest to you)
- Wait 2 minutes for provisioning

### 3.2 Run Database Schema
1. Go to Supabase Dashboard → SQL Editor
2. Paste content from `backend/schema.sql`
3. Click "Run"

### 3.3 Get Credentials
In Supabase Dashboard → Settings → API:
- Copy `Project URL`
- Copy `anon/public key`

### 3.4 Update Railway
Add to Railway environment variables:
```
SUPABASE_URL=<your_project_url>
SUPABASE_KEY=<your_anon_key>
```

Redeploy Railway.

---

## 🎯 STEP 4: Update Frontend API URL

### 4.1 Create Environment File
```bash
# In c:/Users/kisho/sly
echo NEXT_PUBLIC_API_URL=https://your-app.railway.app > .env.local
```

### 4.2 Update API Calls
Already done! Your components use:
```typescript
fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/v1/process-invoice`)
```

### 4.3 Redeploy Vercel
```bash
vercel --prod
```

---

## 🎯 STEP 5: Optional - Custom Domain

### 5.1 Buy Domain (Namecheap)
- Example: `invoicely.ai` ($10/year)

### 5.2 Add to Vercel
- Vercel Dashboard → Your Project → Settings → Domains
- Add your domain
- Follow DNS instructions

### 5.3 SSL Certificate
Automatically handled by Vercel (free)

---

## ✅ POST-DEPLOYMENT CHECKLIST

After deployment, test:

1. **Frontend loads**: Visit your Vercel URL
2. **Dashboard works**: Navigate through pages
3. **API connection**: Process a test invoice
4. **Database persistence**: Check if logs appear in Supabase
5. **Error handling**: Try invalid inputs

---

## 🔐 PRODUCTION SECURITY (Phase 2)

### Add Authentication
```bash
npm install @clerk/nextjs
```

Follow: https://clerk.com/docs/quickstarts/nextjs

### Enable Row Level Security (RLS)
In Supabase SQL Editor:
```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_decisions ENABLE ROW LEVEL SECURITY;
```

### Add Rate Limiting
In `backend/main.py`:
```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
```

---

## 📊 MONITORING

### Vercel Analytics
- Automatic (free)
- Dashboard → Analytics

### Railway Metrics
- Dashboard → Deployments → Metrics
- See CPU, Memory, Network

### Supabase Logs
- Dashboard → Logs
- Real-time database queries

---

## 💰 COST BREAKDOWN

### Free Tier (Recommended for MVP)
- ✅ Vercel: Unlimited bandwidth
- ✅ Railway: $5/month (500 hours)
- ✅ Supabase: 500MB database, 2GB bandwidth
- **Total: $5/month**

### Scale (100 users/day)
- Vercel: Free (under 100GB bandwidth)
- Railway: $10/month (need more compute)
- Supabase: Free (under limits)
- **Total: $10/month**

### Enterprise (1000+ users/day)
- Vercel Pro: $20/month
- Railway: $20-50/month (auto-scale)
- Supabase Pro: $25/month
- **Total: $65-95/month**

---

## 🆘 TROUBLESHOOTING

### Frontend not connecting to backend?
```bash
# Check CORS in backend/main.py
origins = [
    "https://invoicely-ai.vercel.app",  # Add your production URL
]
```

### Database connection failing?
- Check Supabase credentials
- Verify IP allowlist (should be disabled for Railway

)
- Check connection string format

### PDF uploads not working?
- Railway needs Tesseract installed
- Add to `railway.toml`:
```toml
[build]
buildCommand = "apt-get update && apt-get install -y tesseract-ocr && pip install -r backend/requirements.txt"
```

---

## 🎯 NEXT STEPS

1. **Deploy now** using steps above (~30 min)
2. **Test thoroughly** with real invoices
3. **Add authentication** (Clerk, 1 hour)
4. **Invite beta users** (friends, colleagues)
5. **Collect feedback** and iterate
6. **Add custom domain** when ready
7. **Scale as needed** (Railway auto-scales)

---

## 📧 PRODUCTION URLS

After deployment, you'll have:

**Production Dashboard**: `https://invoicely-ai.vercel.app`  
**API Endpoint**: `https://your-app.railway.app`  
**Database**: `https://your-project.supabase.co`  

**Share the dashboard URL with users. They can start processing invoices immediately!**

---

**Ready to deploy? Start with Step 1 (Railway backend). Takes 10 minutes.**
