# 🚀 Hostinger Node.js Deployment Guide for Quick Downloader

This package is pre-configured and pre-built for **Hostinger Node.js Web App** hosting (Cloud Hosting, Business Web Hosting, or VPS).

---

## 📁 Package Contents

- **`server.js`**: Pre-compiled production Node.js ESM server. Ready to run with standard Node.js without requiring TypeScript or build tools on the server.
- **`dist/`**: Pre-built, optimized React production frontend (HTML, CSS, JS bundles).
- **`public/`**: Favicon, logos, and static assets.
- **`server/`**: Full backend services (Media analyzer, download proxy, platform detector, blog engine).
- **`data/`**: Initialized storage for blog articles (`blog_posts.json`).
- **`package.json`**: Configured with `"type": "module"` and `"start": "node server.js"`.
- **`.env.example`**: Example environment variables.

---

## 🛠️ Step-by-Step Deployment on Hostinger (hPanel)

### Step 1: Create the Node.js Application in Hostinger
1. Log into your **Hostinger hPanel**.
2. Go to **Websites** ➔ click **Manage** next to your domain.
3. In the left sidebar, search for **Node.js** and click on it.
4. Set the following options:
   - **Node.js version**: Choose **`20.x`** or **`22.x`** (Node 18+ is supported).
   - **Application mode**: **`Production`**.
   - **Application root**: Select or enter your folder (e.g. `public_html` or `/domains/yourdomain.com/public_html`).
   - **Application startup file**: Enter **`server.js`**.
   - **Application URL**: Select your domain name.
5. Click **Create** or **Save**.

---

### Step 2: Upload and Extract Files
1. In hPanel, open **File Manager** (under Files).
2. Open your Application root directory (e.g. `public_html`).
3. Click **Upload** (top right) ➔ select `quick-downloader-hostinger.zip`.
4. Right-click `quick-downloader-hostinger.zip` and select **Extract**.
   - Extract directly into your Application root directory.
5. Verify that `server.js`, `package.json`, and the `dist` folder are located in your Application root.

---

### Step 3: Install Dependencies
1. Return to the **Node.js** page in hPanel.
2. Click the **"NPM Install"** button.
   *(Hostinger will automatically install all dependencies listed in `package.json`).*

---

### Step 4: Environment Variables (Optional)
Hostinger automatically sets the `PORT` environment variable and routes web traffic to your Node.js application.
If you wish to set custom variables, you can create a `.env` file in the root:
```env
PORT=3000
NODE_ENV=production
ADMIN_SECRET_KEY=quickdownloader_admin_2026
```

---

### Step 5: Start / Restart the Application
1. On the **Node.js** page in hPanel, click **"Restart"** (or **"Start Application"**).
2. Open your domain in any web browser!

---

## ❓ Frequently Asked Questions (FAQ)

### 1. Does Hostinger need to run `npm run build`?
No! The `dist/` frontend and `server.js` backend are already pre-built in this package. You only need to click **"NPM Install"** and **"Start Application"**.

### 2. Can I edit blog posts or add new ones?
Yes! Blog articles are stored in `data/blog_posts.json`. You can manage them directly through the `/admin` panel or by editing the JSON file.

### 3. How does media downloading work on Hostinger?
Media downloads are streamed through `server.js` directly to the client's browser using memory chunk pipes. Files are never stored on Hostinger disk, which prevents server storage overflow and protects user privacy.
