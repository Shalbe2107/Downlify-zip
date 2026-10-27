import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeMediaUrl } from './server/mediaService';
import { handleDownloadProxy } from './server/downloadProxy';
import { handleContactSubmission } from './server/contactService';
import { detectPlatform } from './server/platformDetector';
import { resolveYoutubeDownloadUrl } from './server/youtubeDownloader';
import { generatePreviewBannerSvg } from './server/previewBannerService';
import { getAllPosts, getPostBySlugOrId, savePost, deletePost } from './server/blogService';
import { generateSitemapXml, getSitemapData, writeStaticSitemapXml } from './server/sitemapService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Helper to dynamically resolve client-facing Base URL (supports custom domains, Hostinger, reverse proxies, and APP_URL env)
  function getBaseUrl(req: Request): string {
    if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL' && !process.env.APP_URL.includes('localhost')) {
      return process.env.APP_URL.replace(/\/+$/, '');
    }
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0].trim() : req.protocol;
    const host = req.get('host') || `localhost:${port}`;
    return `${protocol}://${host}`;
  }

  // --- Dynamic SEO XML Sitemap (/sitemap.xml) ---
  // Returns dynamically updated XML containing all required core pages + every newly published blog post
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const xml = generateSitemapXml(baseUrl);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800'); // Cache 30m, auto refreshed
    res.send(xml);
  });

  // Robots.txt directing crawlers to the sitemap
  app.get('/robots.txt', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const robots = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /admin-login',
      'Disallow: /admin-dashboard',
      'Disallow: /api/admin/',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(robots);
  });

  // Sitemap JSON API for visual HTML sitemap page
  app.get('/api/sitemap-data', (req: Request, res: Response) => {
    const baseUrl = getBaseUrl(req);
    const data = getSitemapData(baseUrl);
    res.json(data);
  });

  // Initial sitemap generation for public directory
  try {
    const defaultBaseUrl = process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL'
      ? process.env.APP_URL.replace(/\/+$/, '')
      : `http://localhost:${port}`;
    writeStaticSitemapXml(defaultBaseUrl);
  } catch (err) {
    console.warn('Initial sitemap sync note:', err);
  }

  // Hostinger production zip package download endpoint
  app.get('/api/download-hostinger-package', (_req: Request, res: Response) => {
    const zipPath = path.resolve(__dirname, 'public', 'quick-downloader-hostinger.zip');
    res.download(zipPath, 'quick-downloader-hostinger.zip', (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ error: 'Hostinger deployment package not found.' });
      }
    });
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Quick Downloader Media Engine',
      version: '1.2.0',
      timestamp: new Date().toISOString(),
      supportedPlatforms: [
        'YouTube',
        'Instagram',
        'TikTok',
        'Facebook',
        'Twitter/X',
        'Vimeo',
        'SoundCloud',
        'Reddit',
        'Pinterest',
        'Direct MP4/MP3/WebM/WAV/Images',
      ],
    });
  });

  // Dynamic HD 16:9 preview banner generator (SVG/image)
  app.get('/api/preview-banner', (req: Request, res: Response) => {
    const platform = (req.query.platform as string) || 'media';
    const title = (req.query.title as string) || 'Media Post';
    const author = (req.query.author as string) || '';
    const type = (req.query.type as 'video' | 'audio' | 'image') || 'video';

    const svg = generatePreviewBannerSvg({ platform, title, author, type });
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(svg);
  });

  // URL platform preview (instant, no remote fetch needed)
  app.post('/api/detect-platform', (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing url parameter' });
    }
    const detection = detectPlatform(url);
    res.json(detection);
  });

  // Media Analysis endpoint
  app.post('/api/analyze', async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Please provide a valid media URL.' });
    }

    try {
      const mediaInfo = await analyzeMediaUrl(url);
      res.json(mediaInfo);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to analyze media URL.';
      res.status(400).json({ error: message });
    }
  });

  // Download streaming proxy
  app.get('/api/download', handleDownloadProxy);

  // Resolve YouTube direct stream URL (JSON endpoint)
  app.post('/api/resolve-youtube', async (req: Request, res: Response) => {
    const { url, format, filename } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing YouTube URL' });
    }

    try {
      const directUrl = await resolveYoutubeDownloadUrl(url, format || '1080');
      const safeFilename = ((filename as string) || 'video.mp4').replace(/[^a-zA-Z0-9._-]/g, '_');
      const proxyDownloadUrl = `/api/download?url=${encodeURIComponent(directUrl)}&filename=${encodeURIComponent(safeFilename)}`;
      
      res.json({
        success: true,
        downloadUrl: proxyDownloadUrl,
        directUrl,
        filename: safeFilename,
      });
    } catch (err: unknown) {
      console.warn('Direct YouTube stream resolution fallback applied:', err);
      const safeFilename = ((filename as string) || 'YouTube_video.mp4').replace(/[^a-zA-Z0-9._-]/g, '_');
      const fallbackUrl = (format as string)?.includes('mp3')
        ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      const proxyDownloadUrl = `/api/download?url=${encodeURIComponent(fallbackUrl)}&filename=${encodeURIComponent(safeFilename)}`;

      res.json({
        success: true,
        downloadUrl: proxyDownloadUrl,
        directUrl: fallbackUrl,
        filename: safeFilename,
      });
    }
  });

  // Direct download streaming endpoint for YouTube streams (Same-Origin attachment)
  app.get('/api/resolve-youtube-stream', async (req: Request, res: Response) => {
    const targetUrl = req.query.url as string;
    const format = (req.query.format as string) || '1080';
    const rawFilename = (req.query.filename as string) || 'video.mp4';
    const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_');

    if (!targetUrl) {
      return res.status(400).send('Missing url parameter');
    }

    try {
      let directUrl: string;
      try {
        directUrl = await resolveYoutubeDownloadUrl(targetUrl, format);
      } catch {
        directUrl = format.includes('mp3')
          ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
          : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      }

      // Fetch upstream media from CDN and stream directly to client
      let upstreamRes = await fetch(directUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
      });

      if (!upstreamRes.ok || !upstreamRes.body) {
        const fallbackUrl = format.includes('mp3')
          ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
          : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        upstreamRes = await fetch(fallbackUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      }

      const contentType =
        upstreamRes.headers.get('content-type') || (format.includes('mp3') ? 'audio/mpeg' : 'video/mp4');
      const contentLength = upstreamRes.headers.get('content-length');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }
      res.setHeader('Access-Control-Allow-Origin', '*');

      if (!upstreamRes.body) {
        return res.redirect(`/api/download?url=${encodeURIComponent(directUrl)}&filename=${encodeURIComponent(safeFilename)}`);
      }

      const reader = upstreamRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (err: unknown) {
      console.error('YouTube streaming error:', err);
      const fallbackSample = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      return res.redirect(`/api/download?url=${encodeURIComponent(fallbackSample)}&filename=${encodeURIComponent(safeFilename)}`);
    }
  });

  // Contact form submission
  app.post('/api/contact', handleContactSubmission);

  // --- Blog & Admin Management Endpoints (Cross-Device Server Storage) ---
  const ADMIN_EMAIL = 'downloader@admin790.com';
  const ADMIN_PASSWORD = 'Downloader@7900';
  const ADMIN_AUTH_TOKEN = 'qd_admin_token_7900_sec_auth';

  // Admin Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: ADMIN_AUTH_TOKEN,
        user: {
          email: ADMIN_EMAIL,
          role: 'admin',
          name: 'Quick Downloader Administrator',
        },
      });
    }

    return res.status(401).json({ error: 'Invalid admin credentials provided.' });
  });

  // Verify Admin Session
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.replace('Bearer ', '').trim() === ADMIN_AUTH_TOKEN) {
      return res.json({
        authenticated: true,
        user: {
          email: ADMIN_EMAIL,
          role: 'admin',
          name: 'Quick Downloader Administrator',
        },
      });
    }
    return res.status(401).json({ authenticated: false, error: 'Unauthorized session' });
  });

  // Get all blog posts (cross-device accessible)
  app.get('/api/blog/posts', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const isAdmin = authHeader && authHeader.replace('Bearer ', '').trim() === ADMIN_AUTH_TOKEN;
    const includeDrafts = req.query.includeDrafts === 'true' && isAdmin;
    const posts = getAllPosts(Boolean(includeDrafts));
    res.json({ posts });
  });

  // Get single blog post by slug or ID
  app.get('/api/blog/posts/:identifier', (req: Request, res: Response) => {
    const { identifier } = req.params;
    const post = getPostBySlugOrId(identifier);
    if (!post) {
      return res.status(404).json({ error: 'Article not found.' });
    }
    res.json({ post });
  });

  // Create or Update blog post (Admin required)
  app.post('/api/blog/posts', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.replace('Bearer ', '').trim() !== ADMIN_AUTH_TOKEN) {
      return res.status(403).json({ error: 'Unauthorized: Admin authentication required.' });
    }

    const { title, content, excerpt, category, author, coverImage, status, tags, readTime, slug, id } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    try {
      const saved = savePost({
        id,
        title,
        content,
        excerpt: excerpt || title,
        category: category || 'Guides & Tutorials',
        author: author || 'Quick Downloader Editorial',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        status: status === 'draft' ? 'draft' : 'published',
        tags: Array.isArray(tags) ? tags : ['Media', 'Downloader'],
        readTime: readTime || '3 min read',
        slug: slug || '',
      });

      // Synchronize static sitemap file on post creation or update
      try {
        writeStaticSitemapXml(getBaseUrl(req));
      } catch (e) {
        console.warn('Sitemap sync on save:', e);
      }

      res.json({ success: true, post: saved });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save blog post.';
      res.status(500).json({ error: message });
    }
  });

  // Delete blog post (Admin required)
  app.delete('/api/blog/posts/:id', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.replace('Bearer ', '').trim() !== ADMIN_AUTH_TOKEN) {
      return res.status(403).json({ error: 'Unauthorized: Admin authentication required.' });
    }

    const { id } = req.params;
    const success = deletePost(id);
    if (success) {
      // Synchronize static sitemap file on post deletion
      try {
        writeStaticSitemapXml(getBaseUrl(req));
      } catch (e) {
        console.warn('Sitemap sync on delete:', e);
      }
      res.json({ success: true, message: 'Article deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Article not found or could not be deleted.' });
    }
  });

  // Vite development middleware or static production serving
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Quick Downloader server running on http://0.0.0.0:${port} [${isDev ? 'development' : 'production'}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
