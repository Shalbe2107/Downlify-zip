# 🚀 Step-by-Step: Push to GitHub & Deploy to Hostinger

This guide explains how to push your code to **GitHub** and connect it to **Hostinger** so your site updates smoothly.

---

## 📌 Prerequisites & Important Note
This application has two pre-compiled assets needed for production:
1. `server.js` (compiled Node.js ESM server)
2. `dist/` (compiled React frontend)

Hostinger's standard Git pull tool only pulls repository files—it does **not** automatically run frontend compilers like Vite unless you run it via SSH or commit the built files.

👉 **We recommend two easy paths below**:
- **Path A (Simplest & Most Reliable)**: Commit the built files (`dist/` and `server.js`) to GitHub so Hostinger works with 1-click **NPM Install** without needing SSH.
- **Path B (Traditional Developer)**: Push source code only, then run `npm run build` once inside Hostinger's SSH terminal.

---

## PART 1: Push Your Project to GitHub

### 1. Create a Repository on GitHub
1. Go to [github.com](https://github.com) and log into your account.
2. Click the **`+`** icon in the top right corner ➔ select **New repository**.
3. Name your repository (e.g. `quick-downloader`).
4. Choose **Public** or **Private**.
5. **Do NOT** check "Add a README file" or ".gitignore" (we already have them).
6. Click **Create repository**.
7. Copy the repository URL (e.g., `https://github.com/your-username/quick-downloader.git`).

---

### 2. Push Code to GitHub

Open your terminal or command prompt in your project root folder:

```bash
# 1. Initialize Git (if not already initialized)
git init

# 2. Build the production files first
npm run build

# 3. Add all files
git add .

# 4. Commit your changes
git commit -m "Initial commit for Hostinger deployment"

# 5. Set branch name to main
git branch -M main

# 6. Connect your local repo to GitHub (replace with YOUR repository URL)
git remote add origin https://github.com/your-username/quick-downloader.git

# 7. Push the code to GitHub
git push -u origin main
```

*(Note: If your `.gitignore` currently ignores `dist/` and you want Path A, remove `dist/` from `.gitignore` before running `git add .`, so Hostinger receives the compiled frontend).*

---

## PART 2: Connect GitHub to Hostinger (Automatic Deployment)

### Step 1: Open Git in Hostinger hPanel
1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com).
2. Go to **Websites** ➔ click **Manage** on your domain.
3. In the left search bar, type **Git** (located under **Advanced** ➔ **Git**).

### Step 2: Configure the Repository
1. **Repository URL**: Paste your GitHub URL (e.g., `https://github.com/your-username/quick-downloader.git`).
   - *If your repository is Private*: Hostinger will generate a deploy key. Copy the public key, go to your GitHub repo ➔ **Settings** ➔ **Deploy keys** ➔ **Add deploy key**, paste it, and check "Allow write access".
2. **Branch**: Select or type **`main`**.
3. **Install Directory**: Select `public_html` (or leave default root).
4. Click **Create**. Hostinger will clone all files from GitHub into your server directory!

---

## PART 3: Enable Auto-Deploy on Git Push (Webhook)

Hostinger provides an automatic webhook so whenever you push to GitHub, Hostinger automatically pulls the newest code:

1. In Hostinger hPanel under **Advanced ➔ Git**, find your deployed repository.
2. Click **Auto-Deployment** or copy the **Webhook URL** displayed.
3. Go to your GitHub repository in your browser:
   - Click **Settings** ➔ **Webhooks** ➔ **Add webhook**.
   - **Payload URL**: Paste the Webhook URL from Hostinger.
   - **Content type**: Choose `application/json`.
   - **Which events**: Select *Just the push event*.
   - Click **Add webhook**.
4. Now, whenever you push changes (`git push`), Hostinger will automatically pull the update!

---

## PART 4: Configure the Node.js Web App in Hostinger

Once the files are pulled into `public_html`:

1. In Hostinger hPanel, search for **Node.js** in the left menu.
2. Configure your app settings:
   - **Node.js version**: Select **`20.x`** or **`22.x`**.
   - **Application mode**: **`Production`**.
   - **Application root**: Select `public_html`.
   - **Application startup file**: Enter **`server.js`**.
   - **Application URL**: Select your domain.
3. Click **Create** (or **Save**).
4. Click the **"NPM Install"** button on the Node.js dashboard.
5. If using Path B (source code only):
   - Open **Advanced ➔ SSH Access** (or **Terminal**).
   - Run `cd public_html && npm run build`.
6. Click **Restart Application** (or **Start Application**).

🎉 Your website is live on your domain!
