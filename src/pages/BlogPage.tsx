import React, { useState, useEffect } from 'react';
import { BlogPost, PageRoute } from '../types';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Search, 
  Tag, 
  Share2, 
  Sparkles, 
  Check, 
  ChevronRight,
  Globe,
  RefreshCw,
  ExternalLink,
  ArrowRight,
  Zap
} from 'lucide-react';

interface BlogPageProps {
  onNavigate: (route: PageRoute, blogSlug?: string | null) => void;
  currentBlogSlug?: string | null;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, currentBlogSlug }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/blog/posts');
      if (!res.ok) {
        throw new Error(`Failed to load articles (${res.status})`);
      }
      const data = await res.json();
      const loadedPosts: BlogPost[] = data.posts || [];
      setPosts(loadedPosts);

      // If currentBlogSlug is provided in the URL, select that post
      if (currentBlogSlug) {
        const found = loadedPosts.find(
          (p) => p.slug === currentBlogSlug || p.id === currentBlogSlug
        );
        if (found) {
          setSelectedPost(found);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to connect to blog server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Synchronize when currentBlogSlug prop changes (e.g. via browser back/forward or deep-link)
  useEffect(() => {
    if (!currentBlogSlug) {
      setSelectedPost(null);
    } else if (posts.length > 0) {
      const found = posts.find(
        (p) => p.slug === currentBlogSlug || p.id === currentBlogSlug
      );
      if (found) {
        setSelectedPost(found);
      } else {
        // Attempt to fetch directly in case it's a new or unlisted post
        fetch(`/api/blog/posts/${encodeURIComponent(currentBlogSlug)}`)
          .then((res) => res.ok ? res.json() : null)
          .then((data) => {
            if (data?.post) {
              setSelectedPost(data.post);
            }
          })
          .catch(() => {});
      }
    }
  }, [currentBlogSlug, posts]);

  // Categories
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))];

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query || 
      post.title.toLowerCase().includes(query) || 
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some(t => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    onNavigate('blog', post.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedPost(null);
    onNavigate('blog', null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (post: BlogPost) => {
    const shareUrl = `${window.location.origin}/blog/${post.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleRedirectToDownloader = () => {
    onNavigate('home');
    setTimeout(() => {
      const inputEl = document.getElementById('media-url-input');
      if (inputEl) {
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputEl.focus();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  const renderStickyLetsGoButton = () => (
    <aside 
      aria-label="Quick download navigation"
      className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto"
    >
      <button
        onClick={handleRedirectToDownloader}
        className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-2xl sm:rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm tracking-wide shadow-2xl shadow-indigo-500/40 hover:shadow-purple-500/60 ring-2 ring-white/70 dark:ring-white/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none"
        title="Let's go - Paste media link & download now"
      >
        {/* Subtle pulsing ambient glow ring */}
        <span className="absolute -inset-1 rounded-2xl sm:rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400 opacity-60 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all -z-10 animate-pulse" />
        
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg sm:rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300" />
        </div>

        <span className="whitespace-nowrap font-extrabold shadow-sm">
          Let's go
        </span>

        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform shrink-0" />
      </button>
    </aside>
  );

  // Detailed article view with unique URL
  if (selectedPost) {
    const currentPostUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${selectedPost.slug}`;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 animate-in fade-in duration-300 relative">
        {/* Sticky Let's go button at right mid of the page/screen for each blog post */}
        {renderStickyLetsGoButton()}

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={handleBackToCatalog}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200/70 dark:border-purple-800/60 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          {/* Unique Canonical URL indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <Globe className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate max-w-xs">{`/blog/${selectedPost.slug}`}</span>
          </div>
        </div>

        <article className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Article Header & Cover */}
          {selectedPost.coverImage && (
            <div className="relative w-full h-64 sm:h-96 overflow-hidden bg-slate-900">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-600/90 text-white backdrop-blur-md shadow-md">
                  {selectedPost.category}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{selectedPost.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>{new Date(selectedPost.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>{selectedPost.readTime}</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => handleShare(selectedPost)}
                  title="Copy unique article URL"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Unique URL Copied!' : 'Share Article URL'}</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              {selectedPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8 p-4 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border-l-4 border-purple-600">
              {selectedPost.excerpt}
            </p>

            {/* Content Body */}
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {selectedPost.content}
            </div>

            {/* Tags */}
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Bottom CTA to Downloader */}
        <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleBackToCatalog}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            ← View All Articles
          </button>

          <button
            onClick={handleRedirectToDownloader}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-indigo-500/25 transition-all cursor-pointer hover:scale-102 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Try Quick Downloader Now</span>
          </button>
        </div>
      </div>
    );
  }

  // Articles catalog view (URL: /blog)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative">
      {/* Sticky "Let's go" button at right mid of the page or screen */}
      {renderStickyLetsGoButton()}

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-sm mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quick Downloader Knowledge Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
            Streaming Guides & Tech Insights
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          Deep-dives into adaptive video streaming, lossless audio extraction, next-gen AV1 codecs, and privacy-first ephemeral downloading architecture.
        </p>

        {/* Multi-Device Synchronized Notice with Unique URL notice */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
          <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Unique Shareable URLs for every article · Universal sync across all devices</span>
        </div>
      </div>

      {/* Controls Bar: Search & Category Chips */}
      <div className="max-w-5xl mx-auto mb-10 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, video codecs, audio formats, or topics..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 scale-102'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={fetchPosts}
            title="Refresh articles from server"
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-purple-600 border border-slate-200 dark:border-slate-800 transition-colors ml-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && posts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading articles from central server...</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center mb-8">
          <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold">{error}</p>
          <button
            onClick={fetchPosts}
            className="mt-3 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800 max-w-lg mx-auto p-8">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No articles found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => handleSelectPost(post)}
              className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
            >
              {/* Cover preview */}
              <div className="relative w-full h-48 overflow-hidden bg-slate-900">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-600 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-purple-700 dark:text-purple-300 backdrop-blur-md shadow-sm border border-purple-200/50 dark:border-purple-800/50">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-600" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2.5">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span className="font-mono text-[11px] text-slate-400 truncate max-w-[140px]">
                    /blog/{post.slug}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>Read Article</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
