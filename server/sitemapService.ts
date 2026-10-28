import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllPosts, BlogPostItem } from './blogService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface SitemapPageEntry {
  url: string;
  path: string;
  title: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
  category: 'core' | 'support' | 'legal' | 'blog';
  description?: string;
}

// Required core pages for Quick Downloader
export const CORE_PAGES: Omit<SitemapPageEntry, 'url'>[] = [
  {
    path: '/',
    title: 'Home - Multi-Platform Media Downloader & Link Inspector',
    changefreq: 'daily',
    priority: 1.0,
    category: 'core',
    description: 'Instant media extraction, preview, and download engine for YouTube, Facebook, Instagram, TikTok, Pinterest, and direct links.',
  },
  {
    path: '/blog',
    title: 'Streaming Guides, Tutorials & Tech Insights Blog',
    changefreq: 'daily',
    priority: 0.9,
    category: 'blog',
    description: 'Articles, in-depth technical guides, video codec analysis, and audio extraction tips.',
  },
  {
    path: '/how-it-works',
    title: 'How It Works - Simple 3-Step Media Downloader Guide',
    changefreq: 'weekly',
    priority: 0.8,
    category: 'core',
    description: 'Step-by-step instructions on pasting URLs, selecting video/audio formats, and downloading.',
  },
  {
    path: '/supported-platforms',
    title: 'Supported Platforms & Media Formats',
    changefreq: 'weekly',
    priority: 0.8,
    category: 'core',
    description: 'Full list of supported media networks including YouTube, TikTok, Facebook, Instagram, Vimeo, Reddit, SoundCloud, and Pinterest.',
  },
  {
    path: '/faq',
    title: 'Frequently Asked Questions (FAQ)',
    changefreq: 'weekly',
    priority: 0.8,
    category: 'support',
    description: 'Answers about video resolutions, 320kbps MP3 audio extraction, privacy, and browser compatibility.',
  },
  {
    path: '/about',
    title: 'About Quick Downloader - Architecture & Zero-Log Model',
    changefreq: 'monthly',
    priority: 0.7,
    category: 'core',
    description: 'Our mission, technology stack, and commitment to zero-log client-side streaming and privacy.',
  },
  {
    path: '/contact',
    title: 'Contact Us & Developer Support',
    changefreq: 'monthly',
    priority: 0.7,
    category: 'support',
    description: 'Get in touch with the Quick Downloader support team for inquiries, bug reports, and feedback.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    changefreq: 'monthly',
    priority: 0.5,
    category: 'legal',
    description: 'Our strict zero-log ephemeral data retention policy and client privacy safeguards.',
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    changefreq: 'monthly',
    priority: 0.5,
    category: 'legal',
    description: 'Terms of usage, permitted personal streaming, and fair use guidelines.',
  },
  {
    path: '/copyright',
    title: 'Copyright Policy & DMCA Notice',
    changefreq: 'monthly',
    priority: 0.5,
    category: 'legal',
    description: 'Intellectual property notice, copyright compliance, and DMCA takedown request procedure.',
  },
  {
    path: '/disclaimer',
    title: 'Legal Disclaimer',
    changefreq: 'monthly',
    priority: 0.5,
    category: 'legal',
    description: 'Legal disclaimers regarding third-party platform trademarks and service utility usage.',
  },
  {
    path: '/sitemap',
    title: 'HTML Site Index & Visual Sitemap',
    changefreq: 'weekly',
    priority: 0.5,
    category: 'support',
    description: 'Interactive index of all pages, articles, and resource URLs across Quick Downloader.',
  },
];

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function formatDateToIso(dateStr?: string): string {
  if (!dateStr) {
    return new Date().toISOString().split('T')[0];
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export const CANONICAL_SITE_URL = 'https://quickdownloader.in';

/**
 * Resolves the canonical base URL, strictly defaulting to https://quickdownloader.in
 * to prevent relative paths (<loc>/</loc>) which break Google Search Console ("Couldn't fetch").
 */
export function resolveCanonicalUrl(baseUrl?: string): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL' && !process.env.APP_URL.includes('localhost') && !process.env.APP_URL.includes('127.0.0.1')) {
    return process.env.APP_URL.trim().replace(/\/+$/, '');
  }

  if (baseUrl) {
    const trimmed = baseUrl.trim().replace(/\/+$/, '');
    if (
      trimmed &&
      !trimmed.includes('localhost') &&
      !trimmed.includes('127.0.0.1') &&
      !trimmed.includes('run.app') &&
      (trimmed.startsWith('http://') || trimmed.startsWith('https://'))
    ) {
      return trimmed;
    }
  }

  return CANONICAL_SITE_URL;
}

/**
 * Builds standard XML sitemap string dynamically including core pages and all published blog posts.
 * Strictly uses absolute URLs (e.g. https://quickdownloader.in/...) and Google Image Sitemap namespace
 * as required by Google Search Console.
 */
export function generateSitemapXml(baseUrl?: string): string {
  const cleanBase = resolveCanonicalUrl(baseUrl);
  const publishedPosts = getAllPosts(false); // Only published posts, never drafts
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\n`;
  xml += `        http://www.google.com/schemas/sitemap-image/1.1\n`;
  xml += `        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">\n\n`;

  // 1. Add Required Core Pages with full absolute canonical domain
  xml += `  <!-- Required Core Pages -->\n`;
  for (const page of CORE_PAGES) {
    const fullUrl = page.path === '/' ? `${cleanBase}/` : `${cleanBase}${page.path}`;
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority.toFixed(1)}</priority>\n`;
    xml += `  </url>\n`;
  }

  // 2. Add Each Newly Published Article's Unique Absolute URL + Image Metadata
  xml += `\n  <!-- Published Blog Articles (Auto-Synchronized Dynamic URLs) -->\n`;
  for (const post of publishedPosts) {
    const postSlug = encodeURIComponent(post.slug);
    const postUrl = `${cleanBase}/blog/${postSlug}`;
    const lastModDate = formatDateToIso(post.updatedAt || post.publishedAt);

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(postUrl)}</loc>\n`;
    xml += `    <lastmod>${lastModDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;

    if (post.coverImage) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(post.coverImage)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(post.title)}</image:title>\n`;
      xml += `      <image:caption>${escapeXml(post.excerpt || post.title)}</image:caption>\n`;
      xml += `    </image:image>\n`;
    }

    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

/**
 * Returns structured data for the frontend HTML Sitemap page.
 */
export function getSitemapData(baseUrl?: string) {
  const cleanBase = resolveCanonicalUrl(baseUrl);
  const publishedPosts = getAllPosts(false);
  const today = new Date().toISOString().split('T')[0];

  const coreEntries: SitemapPageEntry[] = CORE_PAGES.map((p) => ({
    ...p,
    url: p.path === '/' ? `${cleanBase}/` : `${cleanBase}${p.path}`,
    lastmod: today,
  }));

  const articleEntries: SitemapPageEntry[] = publishedPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    url: `${cleanBase}/blog/${encodeURIComponent(post.slug)}`,
    title: post.title,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: formatDateToIso(post.updatedAt || post.publishedAt),
    category: 'blog',
    description: post.excerpt,
  }));

  return {
    totalUrls: coreEntries.length + articleEntries.length,
    coreCount: coreEntries.length,
    articlesCount: articleEntries.length,
    lastGenerated: new Date().toISOString(),
    corePages: coreEntries,
    articles: articleEntries,
    baseUrl: cleanBase,
  };
}

/**
 * Updates public/sitemap.xml on disk to ensure static hosts or tools have the file ready.
 */
export function writeStaticSitemapXml(baseUrl?: string): void {
  try {
    const cleanBase = resolveCanonicalUrl(baseUrl);
    const xml = generateSitemapXml(cleanBase);
    const publicDir = path.resolve(__dirname, '..', 'public');
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
    }
  } catch (err) {
    console.error('Error writing static sitemap.xml:', err);
  }
}
