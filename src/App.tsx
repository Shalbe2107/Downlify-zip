import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider, useHistory } from './context/HistoryContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { MediaResultCard } from './components/MediaResultCard';
import { SupportedPlatformsSection } from './components/SupportedPlatformsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { MediaTypesSection } from './components/MediaTypesSection';
import { KeyBenefitsSection } from './components/KeyBenefitsSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { DownloadHistoryDrawer } from './components/DownloadHistoryDrawer';
import { FloatingBackgroundElements } from './components/FloatingBackgroundElements';
import { SphericalBubbles } from './components/SphericalBubbles';

import { HowItWorksPage } from './pages/HowItWorksPage';
import { SupportedPlatformsPage } from './pages/SupportedPlatformsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { BlogPage } from './pages/BlogPage';
import { AdminPage } from './pages/AdminPage';
import { 
  PrivacyPolicyPage, 
  TermsOfServicePage, 
  CopyrightPolicyPage, 
  DisclaimerPage 
} from './pages/LegalPages';

import { 
  MediaInfo, 
  MediaFormat, 
  PageRoute, 
  PlatformDetectionResult 
} from './types';
import { parseCurrentUrl, routeToUrl, getPageTitle } from './utils/router';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function QuickDownloaderMainApp() {
  const initialRouteState = parseCurrentUrl();
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(initialRouteState.route);
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(initialRouteState.blogSlug);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformDetectionResult | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const { history, addToHistory } = useHistory();

  // Listen for browser Back / Forward buttons and initialize canonical URL
  useEffect(() => {
    const handlePopState = () => {
      const state = parseCurrentUrl();
      setCurrentRoute(state.route);
      setCurrentBlogSlug(state.blogSlug);
      document.title = getPageTitle(state.route);
    };

    // Ensure document title matches current route
    document.title = getPageTitle(initialRouteState.route);

    // Normalize address bar URL to canonical format if needed
    const canonical = routeToUrl(initialRouteState.route, initialRouteState.blogSlug);
    if (window.location.pathname !== canonical && !window.location.hash) {
      window.history.replaceState({ route: initialRouteState.route, blogSlug: initialRouteState.blogSlug }, '', canonical);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: PageRoute, blogSlug?: string | null) => {
    setCurrentRoute(route);
    setCurrentBlogSlug(blogSlug || null);

    const targetUrl = routeToUrl(route, blogSlug);
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ route, blogSlug }, '', targetUrl);
    }
    document.title = getPageTitle(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  // Instant local platform detection when url changes
  useEffect(() => {
    if (!urlInput.trim()) {
      setDetectedPlatform(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/detect-platform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput }),
        });
        if (res.ok) {
          const data: PlatformDetectionResult = await res.json();
          setDetectedPlatform(data);
        }
      } catch {
        // quiet fallback
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [urlInput]);

  const handleAnalyze = async (targetUrl: string) => {
    const clean = targetUrl.trim();
    if (!clean) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: clean }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to inspect link.');
      }

      const info: MediaInfo = data;
      setMediaInfo(info);
      showToast(`Detected ${info.platform.platformName} media stream`, 'success');

      // Record in history
      addToHistory({
        url: info.url,
        title: info.title,
        platformName: info.platform.platformName,
        platformId: info.platform.platformId,
        thumbnail: info.thumbnail,
      });

      // Scroll smoothly to result card
      setTimeout(() => {
        const resultEl = document.getElementById('media-result-container');
        if (resultEl) {
          resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to analyze media link.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadStart = (format: MediaFormat) => {
    showToast(`Streaming ${format.label} (${format.extension.toUpperCase()})...`, 'info');
  };

  const scrollToInput = () => {
    if (currentRoute !== 'home') {
      setCurrentRoute('home');
    }
    setTimeout(() => {
      const input = document.getElementById('media-url-input');
      input?.focus();
      input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-gradient-to-br from-violet-100/70 via-sky-50/80 to-purple-50/60 dark:from-[#080b14] dark:via-[#0c1224] dark:to-[#120f26] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Ambient Light Violet & Sky Blue Luminous Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-violet-400/25 via-purple-300/15 to-transparent blur-3xl dark:from-violet-600/10 dark:via-purple-800/5" />
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-sky-400/25 via-cyan-300/15 to-transparent blur-3xl dark:from-sky-600/10 dark:via-cyan-800/5" />
        <div className="absolute top-2/3 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-purple-400/20 via-violet-300/15 to-transparent blur-3xl dark:from-violet-700/10 dark:via-purple-900/5" />
        <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-sky-400/20 via-blue-300/10 to-transparent blur-3xl dark:from-sky-700/10 dark:via-blue-900/5" />
      </div>

      {/* Floating Media & Social Platform Elements Moving Randomly in the Background */}
      <FloatingBackgroundElements />

      {/* Spherical Gradient Bubbles Drifting Randomly in the Background */}
      <SphericalBubbles />

      {/* Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={(route) => handleNavigate(route)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Router with Crisp High-Contrast Container */}
      <main className="flex-1 relative z-10">
        {currentRoute === 'home' && (
          <>
            <HeroSection
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              error={error}
              currentUrl={urlInput}
              onUrlChange={setUrlInput}
              detectedPlatform={detectedPlatform}
            />

            {/* Media Result Container */}
            <div id="media-result-container">
              {mediaInfo && (
                <MediaResultCard
                  mediaInfo={mediaInfo}
                  onDownloadStart={handleDownloadStart}
                />
              )}
            </div>

            <SupportedPlatformsSection
              onSelectSample={(url) => {
                setUrlInput(url);
                handleAnalyze(url);
              }}
            />

            <HowItWorksSection />

            <MediaTypesSection />

            <KeyBenefitsSection />

            <FaqSection />

            <CtaSection onScrollToTop={scrollToInput} />
          </>
        )}

        {currentRoute === 'blog' && (
          <BlogPage onNavigate={handleNavigate} currentBlogSlug={currentBlogSlug} />
        )}

        {(currentRoute === 'admin-login' || currentRoute === 'admin-dashboard') && (
          <AdminPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'how-it-works' && (
          <HowItWorksPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'supported-platforms' && (
          <SupportedPlatformsPage
            onAnalyzeSample={(sampleUrl) => {
              setUrlInput(sampleUrl);
              handleAnalyze(sampleUrl);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'contact' && (
          <ContactPage />
        )}

        {currentRoute === 'faq' && (
          <FaqPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'privacy' && (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'terms' && (
          <TermsOfServicePage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'copyright' && (
          <CopyrightPolicyPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'disclaimer' && (
          <DisclaimerPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Recent Downloads History Drawer */}
      <DownloadHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectUrl={(selectedUrl) => {
          setUrlInput(selectedUrl);
          handleAnalyze(selectedUrl);
        }}
      />

      {/* Toast Notification Box */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-xs sm:text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-700'
                : toast.type === 'error'
                ? 'bg-rose-950 text-rose-100 border-rose-800'
                : 'bg-indigo-950 text-indigo-100 border-indigo-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <HistoryProvider>
        <QuickDownloaderMainApp />
      </HistoryProvider>
    </ThemeProvider>
  );
}
