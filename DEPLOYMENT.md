# Canteen Management System - Deployment Guide

This guide covers deploying the frontend on Vercel and backend on a separate server.

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository linked to Vercel

### Steps

1. **Push frontend to GitHub** 
   - Project is already connected to GitHub

2. **Create a new Vercel Project**
   - Go to https://vercel.com/new
   - Select your GitHub repository: `Canteen-Management`
   - Set root directory to `frontend` (if not auto-detected)
   - Click "Deploy"

3. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add the backend API URL:
     ```
     VITE_API_BASE_URL=https://your-backend-api.com
     ```
   - Redeploy the project

4. **Verify Deployment**
   - Your frontend will be available at `https://your-project.vercel.app`

---

## Backend Deployment (Railway, Heroku, Render, etc.)

### Prerequisites
- Backend service account (Railway, Heroku, Render, etc.)
- MongoDB Atlas account for database
- MongoDB connection string (MONGO_URI)

### Environment Variables Required
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/canteenDB
FLASK_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Option A: Deploy on Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Deploy**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set MONGO_URI="your_mongodb_uri"
   railway variables set FLASK_ENV=production
   railway variables set ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

### Option B: Deploy on Heroku

1. **Install Heroku CLI**
   ```bash
   # Windows
   choco install heroku-cli
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create app**
   ```bash
   heroku create your-canteen-api
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGO_URI="your_mongodb_uri" -a your-canteen-api
   heroku config:set FLASK_ENV=production -a your-canteen-api
   heroku config:set ALLOWED_ORIGINS=https://your-frontend.vercel.app -a your-canteen-api
   ```

5. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Option C: Deploy on Render

1. **Go to https://render.com**
2. **New → Web Service**
3. **Connect your GitHub repository**
4. **Settings:**
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT app:app`
5. **Add environment variables:**
   - MONGO_URI
   - FLASK_ENV=production
   - ALLOWED_ORIGINS

---

## Configuration Files Included

1. **vercel.json** - Frontend deployment configuration
2. **backend/Procfile** - Tells hosting services how to run Flask
3. **.env.example** - Template for environment variables
4. **backend/.env.example** - Template for backend environment variables
5. **frontend/.env.example** - Template for frontend environment variables

---

## Post-Deployment Checklist

- [ ] Frontend is deployed on Vercel
- [ ] Backend is deployed on chosen service
- [ ] MONGO_URI is set in backend environment
- [ ] ALLOWED_ORIGINS includes your Vercel domain
- [ ] Frontend API calls are hitting the correct backend URL
- [ ] CORS is properly configured
- [ ] Test login functionality
- [ ] Test menu CRUD operations
- [ ] Test orders functionality

---

## Troubleshooting

### CORS Errors
- Check `ALLOWED_ORIGINS` environment variable includes your Vercel URL
- Ensure frontend is using correct `VITE_API_BASE_URL`

### MongoDB Connection Failed
- Verify MONGO_URI is correct
- Check MongoDB Atlas IP whitelist includes your server's IP
- For Railway/Render, use 0.0.0.0/0 or specific IP

### Frontend Can't Reach Backend
- Check that the API URL in frontend doesn't have trailing slash
- Verify backend is running and accessible
- Check network tab in browser DevTools

### Deployment Fails
- Check logs: `railway logs` or `heroku logs --tail`
- Ensure all required packages in `requirements.txt`
- Verify Python version compatibility (Python 3.8+)

---

## Custom Domain (Optional)

### Frontend on Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records with Vercel's nameservers

### Backend
- Contact your hosting provider for custom domain setup
- Point CNAME to your backend URL

---

## Security Recommendations

1. Never commit `.env` files with real credentials
2. Use secret management features of your hosting platform
3. Set `FLASK_ENV=production` in production
4. Restrict `ALLOWED_ORIGINS` to only your frontend domain
5. Use MongoDB Atlas IP whitelist
6. Implement rate limiting for API endpoints
7. Use HTTPS only (automatically on Vercel and most modern platforms)

