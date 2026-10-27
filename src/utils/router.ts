import { PageRoute } from '../types';

export interface RouteState {
  route: PageRoute;
  blogSlug: string | null;
}

/**
 * Parses the current window location (pathname and hash fallback) into a structured RouteState.
 */
export function parseCurrentUrl(): RouteState {
  if (typeof window === 'undefined') {
    return { route: 'home', blogSlug: null };
  }

  // Normalize pathname: remove trailing slash
  const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();

  // 1. Blog deep link: /blog/:slug
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.substring('/blog/'.length).trim();
    if (slug) {
      return { route: 'blog', blogSlug: slug };
    }
    return { route: 'blog', blogSlug: null };
  }

  if (pathname === '/blog') {
    return { route: 'blog', blogSlug: null };
  }

  // Hash fallback for blog deep links (e.g. #blog/slug or #blog-slug)
  if (hash.startsWith('blog/') || hash.startsWith('blog-')) {
    const slug = hash.replace(/^(blog\/|blog-)/, '').trim();
    return { route: 'blog', blogSlug: slug || null };
  }
  if (hash === 'blog') {
    return { route: 'blog', blogSlug: null };
  }

  // 2. Standard page routes
  if (pathname === '/how-it-works' || hash === 'how-it-works') {
    return { route: 'how-it-works', blogSlug: null };
  }
  if (pathname === '/supported-platforms' || hash === 'supported-platforms') {
    return { route: 'supported-platforms', blogSlug: null };
  }
  if (pathname === '/about' || hash === 'about') {
    return { route: 'about', blogSlug: null };
  }
  if (pathname === '/contact' || hash === 'contact') {
    return { route: 'contact', blogSlug: null };
  }
  if (pathname === '/faq' || hash === 'faq') {
    return { route: 'faq', blogSlug: null };
  }
  if (pathname === '/admin' || pathname === '/admin-login' || hash === 'admin' || hash === 'admin-login') {
    return { route: 'admin-login', blogSlug: null };
  }
  if (pathname === '/admin/dashboard' || pathname === '/admin-dashboard' || hash === 'admin-dashboard') {
    return { route: 'admin-dashboard', blogSlug: null };
  }
  if (pathname === '/privacy' || hash === 'privacy') {
    return { route: 'privacy', blogSlug: null };
  }
  if (pathname === '/terms' || hash === 'terms') {
    return { route: 'terms', blogSlug: null };
  }
  if (pathname === '/copyright' || hash === 'copyright') {
    return { route: 'copyright', blogSlug: null };
  }
  if (pathname === '/disclaimer' || hash === 'disclaimer') {
    return { route: 'disclaimer', blogSlug: null };
  }
  if (pathname === '/sitemap' || hash === 'sitemap' || pathname === '/sitemap.xml') {
    return { route: 'sitemap', blogSlug: null };
  }

  return { route: 'home', blogSlug: null };
}

/**
 * Converts a RouteState into a clean, canonical URL path.
 */
export function routeToUrl(route: PageRoute, blogSlug?: string | null): string {
  if (route === 'blog') {
    return blogSlug ? `/blog/${encodeURIComponent(blogSlug)}` : '/blog';
  }
  switch (route) {
    case 'home':
      return '/';
    case 'how-it-works':
      return '/how-it-works';
    case 'supported-platforms':
      return '/supported-platforms';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'faq':
      return '/faq';
    case 'admin-login':
      return '/admin';
    case 'admin-dashboard':
      return '/admin/dashboard';
    case 'privacy':
      return '/privacy';
    case 'terms':
      return '/terms';
    case 'copyright':
      return '/copyright';
    case 'disclaimer':
      return '/disclaimer';
    case 'sitemap':
      return '/sitemap';
    default:
      return '/';
  }
}

/**
 * Returns an informative, unique document title for the given route & blog title.
 */
export function getPageTitle(route: PageRoute, blogTitle?: string | null): string {
  const brand = 'Quick Downloader';
  if (route === 'blog' && blogTitle) {
    return `${blogTitle} | ${brand}`;
  }
  switch (route) {
    case 'home':
      return `${brand} - Fast Multi-Platform Media Downloader & Link Inspector`;
    case 'blog':
      return `Streaming Guides & Tech Insights | ${brand}`;
    case 'how-it-works':
      return `How It Works - Simple 3-Step Guide | ${brand}`;
    case 'supported-platforms':
      return `Supported Platforms & Media Formats | ${brand}`;
    case 'about':
      return `About Zero-Log Architecture & Privacy | ${brand}`;
    case 'contact':
      return `Contact & Support | ${brand}`;
    case 'faq':
      return `Frequently Asked Questions | ${brand}`;
    case 'admin-login':
      return `Admin Portal | ${brand}`;
    case 'admin-dashboard':
      return `Admin Content Management | ${brand}`;
    case 'privacy':
      return `Privacy Policy | ${brand}`;
    case 'terms':
      return `Terms of Service | ${brand}`;
    case 'copyright':
      return `Copyright & DMCA Policy | ${brand}`;
    case 'disclaimer':
      return `Legal Disclaimer | ${brand}`;
    case 'sitemap':
      return `Site Index & XML Sitemap | ${brand}`;
    default:
      return brand;
  }
}
