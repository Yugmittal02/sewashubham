# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide will help you deploy your **Backend to Render** and connect it with your **Frontend on Vercel**.

---

## 🟢 Part 1: Deploy Backend to Render

1.  **Push Code to GitHub**
    *   Make sure your latest code (including the `backend` folder) is pushed to your GitHub repository.

2.  **Create New Service on Render**
    *   Go to [dashboard.render.com](https://dashboard.render.com/)
    *   Click **New +** → **Web Service**
    *   Select "Build and deploy from a Git repository"
    *   Connect your GitHub account and select your repository (`sewashubhambackery`)

3.  **Configure the Service**
    *   **Name**: `sewashubham-backend` (or similar)
    *   **Region**: Choose the closest one (e.g., Singapore or Frankfurt for India)
    *   **Branch**: `main`
    *   **Root Directory**: `backend` (⚠️ Important: This tells Render to look inside the backend folder)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`

4.  **Environment Variables** (Copy these from your local `.env`)
    *   Scroll down to **Environment Variables** section and Click **Add Environment Variable**.
    *   Add each of these keys and their values:
        *   `NODE_ENV`: `production`
        *   `MONGODB_URI`: *Your MongoDB connection string*
        *   `JWT_SECRET`: *Your secret key*
        *   `CLOUDINARY_CLOUD_NAME`: *Your Cloudinary Name*
        *   `CLOUDINARY_API_KEY`: *Your Cloudinary API Key*
        *   `CLOUDINARY_API_SECRET`: *Your Cloudinary API Secret*
        *   `ALLOWED_ORIGINS`: `https://sewashubhambackery.vercel.app` (This is your frontend URL)

5.  **Deploy**
    *   Click **Create Web Service**.
    *   Render will start building. Wait for it to show "Live" ✅.
    *   **Copy your Backend URL** (it will look like `https://sewashubham-backend.onrender.com`).

---

## 🔵 Part 2: Connect Frontend (Vercel)

Now that your backend is live, tell your frontend where to find it.

1.  **Go to Vercel Dashboard**
    *   Select your project (`frontend`)
    *   Go to **Settings** → **Environment Variables**

2.  **Add Backend URL**
    *   **Key**: `VITE_API_URL`
    *   **Value**: Paste your **Render Backend URL** (e.g., `https://sewashubham-backend.onrender.com/api`)
    *   *Note: Make sure to add `/api` at the end if your routes start with `/api` (which they do).*

3.  **Redeploy Frontend**
    *   Go to **Deployments** tab.
    *   Click the three dots `...` on the latest deployment → **Redeploy**.
    *   This forces the frontend to rebuild with the new environment variable.

---

## 🎉 Done!

Your website should now be fully functional live!
- **Frontend**: https://sewashubhambackery.vercel.app
- **Backend**: https://sewashubham-backend.onrender.com (API)

### Troubleshooting
- If images don't load, check your Cloudinary credentials in Render.
- If you get "Network Error", check `ALLOWED_ORIGINS` in Render and `VITE_API_URL` in Vercel.
