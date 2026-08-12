# GitHub Pages Deployment Guide for Suraj-Pathade

**Target GitHub Username:** `Suraj-Pathade`  
**Repository Name:** `crystalsky-os`  
**Live Site URL:** `https://Suraj-Pathade.github.io/crystalsky-os/`

---

## Step 1: Create a GitHub Repository
1. Go to [GitHub New Repository](https://github.com/new).
2. Set **Repository Name**: `crystalsky-os`
3. Set visibility to **Public**.
4. Do NOT initialize with a README (keep it empty).
5. Click **Create repository**.

---

## Step 2: Push Local Code to GitHub
Open your terminal in `C:\Users\patha\.gemini\antigravity\scratch\crystalsky-os` and run:

```bash
git init
git add .
git commit -m "Initial release of CrystalSky OS for Pravin Ghukshe"
git branch -M main
git remote add origin https://github.com/Suraj-Pathade/crystalsky-os.git
git push -u origin main
```

---

## Step 3: Deploy to GitHub Pages with 1 Command
Run the build & deploy script:

```bash
npm install --save-dev gh-pages
```

Then run:
```bash
npx gh-pages -d dist
```

---

## Step 4: Enable GitHub Pages in Repository Settings
1. On GitHub, go to your repository `Suraj-Pathade/crystalsky-os`.
2. Click **Settings** > **Pages** (left menu).
3. Under **Source**, choose **gh-pages** branch.
4. Click **Save**.

🎉 **Your website is live at:**  
`https://Suraj-Pathade.github.io/crystalsky-os/`
