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

/**
 * Builds standard XML sitemap string dynamically including core pages and all published blog posts.
 */
export function generateSitemapXml(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const publishedPosts = getAllPosts(false); // Only published posts, never drafts
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n`;

  // 1. Add Required Core Pages
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

  // 2. Add Each Newly Published Article's Unique URL
  xml += `\n  <!-- Published Blog Articles (Auto-Synchronized Dynamic URLs) -->\n`;
  for (const post of publishedPosts) {
    const postSlug = encodeURIComponent(post.slug);
    const postUrl = `${cleanBase}/blog/${postSlug}`;
    const lastModDate = formatDateToIso(post.updatedAt || post.publishedAt);

    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(postUrl)}</loc>\n`;
    xml += `    <lastmod>${lastModDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

/**
 * Returns structured data for the frontend HTML Sitemap page.
 */
export function getSitemapData(baseUrl: string) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
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
    changefreq: 'monthly',
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
export function writeStaticSitemapXml(baseUrl: string): void {
  try {
    const xml = generateSitemapXml(baseUrl);
    const publicDir = path.resolve(__dirname, '..', 'public');
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');
    }
  } catch (err) {
    console.error('Error writing static sitemap.xml:', err);
  }
}
