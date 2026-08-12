# CrystalSky OS - Web Hosting & Deployment Guide

**Owner:** Pravin Ghukshe  
**Phone:** 8412850833  
**System:** CrystalSky OS (Photography & Film Management System)

---

## 🚀 Option 1: Deploy to Vercel (Free 1-Click Hosting)

1. **Install Vercel CLI** (or connect via GitHub):
   ```bash
   npm install -g vercel
   ```
2. In your terminal inside `crystalsky-os` directory, run:
   ```bash
   vercel
   ```
3. Follow the quick terminal prompts:
   - *Set up and deploy?* -> `Y`
   - *Which scope?* -> Choose your Vercel account
   - *Link to existing project?* -> `N`
   - *What's your project's name?* -> `crystalsky-os`
   - *In which directory is your code located?* -> `./`
   - *Want to modify build settings?* -> `N`
4. **Vercel will output your live URL:** e.g. `https://crystalsky-os.vercel.app`.

---

## 🚀 Option 2: Deploy to Netlify

1. Build the production folder:
   ```bash
   npm run build
   ```
2. Drag and drop the generated `dist` folder into [Netlify Drop](https://app.netlify.com/drop).
3. Your site is live instantly!

---

## 🚀 Option 3: Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   npx firebase login
   ```
3. Initialize Firebase Hosting:
   ```bash
   npx firebase init hosting
   ```
   - *Public directory:* `dist`
   - *Configure as single-page app:* `Yes`
4. Build and deploy:
   ```bash
   npm run build
   npx firebase deploy --only hosting
   ```

---

## 📊 Google Sheets Backend Deployment

1. Open your Google Spreadsheet.
2. Go to **Extensions** > **Apps Script**.
3. Paste the contents of [`google-apps-script/Code.gs`](file:///C:/Users/patha/.gemini/antigravity/scratch/crystalsky-os/google-apps-script/Code.gs).
4. Click **Deploy** > **New Deployment** > **Web App**.
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
5. Copy the Web App URL and paste it in **Settings & Sync** inside CrystalSky OS!
