import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  Network, 
  FileCode, 
  ExternalLink, 
  Search, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  LifeBuoy, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SitemapPageProps {
  onNavigate: (route: PageRoute, blogSlug?: string | null) => void;
}

interface SitemapEntry {
  url: string;
  path: string;
  title: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
  category: 'core' | 'support' | 'legal' | 'blog';
  description?: string;
}

interface SitemapDataResponse {
  totalUrls: number;
  coreCount: number;
  articlesCount: number;
  lastGenerated: string;
  corePages: SitemapEntry[];
  articles: SitemapEntry[];
  baseUrl: string;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  const [data, setData] = useState<SitemapDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'articles' | 'legal'>('all');

  const fetchSitemapData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sitemap-data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching sitemap data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSitemapData();
  }, []);

  const coreList = data?.corePages || [];
  const articlesList = data?.articles || [];
  const totalCount = (coreList.length || 0) + (articlesList.length || 0);

  // Filter based on active tab and search query
  const matchesSearch = (item: SitemapEntry) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.path.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  };

  const filteredCore = coreList.filter((item) => {
    if (activeTab === 'articles') return false;
    if (activeTab === 'legal' && item.category !== 'legal') return false;
    if (activeTab === 'core' && item.category !== 'core' && item.category !== 'support') return false;
    return matchesSearch(item);
  });

  const filteredArticles = articlesList.filter((item) => {
    if (activeTab === 'core' || activeTab === 'legal') return false;
    return matchesSearch(item);
  });

  const handleEntryClick = (path: string) => {
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      onNavigate('blog', slug);
    } else if (path === '/blog') {
      onNavigate('blog');
    } else if (path === '/how-it-works') {
      onNavigate('how-it-works');
    } else if (path === '/supported-platforms') {
      onNavigate('supported-platforms');
    } else if (path === '/faq') {
      onNavigate('faq');
    } else if (path === '/about') {
      onNavigate('about');
    } else if (path === '/contact') {
      onNavigate('contact');
    } else if (path === '/privacy') {
      onNavigate('privacy');
    } else if (path === '/terms') {
      onNavigate('terms');
    } else if (path === '/copyright') {
      onNavigate('copyright');
    } else if (path === '/disclaimer') {
      onNavigate('disclaimer');
    } else {
      onNavigate('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 mb-4 shadow-sm">
          <Network className="w-3.5 h-3.5" />
          <span>Search Engine Optimization & Navigation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Site Index &{' '}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            XML Sitemap
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The central directory of all required application pages, guide hubs, legal policies, and dynamically published articles. Automatically synchronized in real-time.
        </p>

        {/* Quick Raw XML Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <FileCode className="w-4 h-4" />
            <span>Open Raw /sitemap.xml</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition-all"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>View /robots.txt</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : totalCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Indexable URLs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : coreList.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Required Core Pages</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? '...' : articlesList.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Published Articles</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live & Auto-Sync</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Protocol v0.9 (Standard)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search URLs, titles, keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'core', 'articles', 'legal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'all'
                ? `All (${totalCount})`
                : tab === 'core'
                ? `Core (${coreList.filter((c) => c.category !== 'legal').length})`
                : tab === 'articles'
                ? `Articles (${articlesList.length})`
                : `Legal (${coreList.filter((c) => c.category === 'legal').length})`}
            </button>
          ))}
          <button
            onClick={fetchSitemapData}
            title="Refresh sitemap data"
            className="p-1.5 rounded-xl text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Section 1: Core Pages */}
      {filteredCore.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Required Application & Legal Pages ({filteredCore.length})</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Included in XML Sitemap</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCore.map((item) => (
              <div
                key={item.path}
                onClick={() => handleEntryClick(item.path)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-purple-500/50 dark:hover:border-purple-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/50 dark:border-purple-900/50">
                      {item.path}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      <span>Priority:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{item.priority.toFixed(1)}</strong>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug mb-1.5">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="capitalize">Changefreq: {item.changefreq}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    <span>Visit page</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Dynamically Published Blog Articles */}
      {filteredArticles.length > 0 && (
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Published Blog Articles Unique URLs ({filteredArticles.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Each newly published article receives a unique canonical URL and automatically appears in the sitemap.
              </p>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Explore Blog Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.path}
                onClick={() => handleEntryClick(article.path)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/50 dark:border-indigo-900/50 truncate max-w-[70%]">
                      {article.path}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-900/50 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Indexed (0.8)</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-1.5">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Last modified: {article.lastmod || 'Recent'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {filteredCore.length === 0 && filteredArticles.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 my-8">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No URLs match your search</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or clear the filter to view all indexable paths.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveTab('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Technical SEO Standards Explanation Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-blue-500/5 border border-purple-200/60 dark:border-purple-800/40 mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sitemap Architecture & Search Engine Protocol Standards
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Built to meet the official Google, Bing, and Sitemaps.org XML schema specification.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400 mt-4 pt-4 border-t border-purple-200/40 dark:border-purple-800/30">
          <div className="space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">Dynamic Auto-Generation</strong>
            <p>
              Whenever an article is created or updated in the Admin portal, the <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">/sitemap.xml</code> feed regenerates its unique URL automatically with no server restarts.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">Priority & Frequency Controls</strong>
            <p>
              Critical utility pages (Home, Downloader, Blog) carry <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">1.0 - 0.9</code> priority. Informational guides and articles carry <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">0.8</code> priority.
            </p>
          </div>

          <div className="space-y-1">
            <strong className="text-slate-900 dark:text-white block font-semibold">Robots.txt Autodiscovery</strong>
            <p>
              Search spiders hitting <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">/robots.txt</code> are automatically linked to the XML sitemap, while protecting admin management areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
