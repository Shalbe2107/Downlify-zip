import React, { useState, useEffect } from 'react';
import { 
  DownloadCloud, 
  Clipboard, 
  X, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Play,
  Music,
  Image as ImageIcon,
  Video,
  Film,
  Pin
} from 'lucide-react';
import { 
  YouTubeLogo, 
  InstagramLogo, 
  TikTokLogo, 
  FacebookLogo, 
  PinterestLogo, 
  XTwitterLogo, 
  RedditLogo, 
  VimeoLogo, 
  SoundCloudLogo 
} from './SocialLogos';
import { PlatformDetectionResult } from '../types';

const HERO_PLATFORM_PILLS = [
  { name: 'YouTube', icon: YouTubeLogo, color: 'text-red-600', badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-200/80 dark:border-red-900/60' },
  { name: 'Facebook', icon: FacebookLogo, color: 'text-blue-600', badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60' },
  { name: 'Instagram', icon: InstagramLogo, color: 'text-pink-600', badge: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-200/80 dark:border-pink-900/60' },
  { name: 'Reddit', icon: RedditLogo, color: 'text-orange-600', badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200/80 dark:border-orange-900/60' },
  { name: 'Pinterest', icon: PinterestLogo, color: 'text-rose-600', badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/60' },
  { name: 'TikTok', icon: TikTokLogo, color: 'text-cyan-500', badge: 'bg-slate-900/10 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700' },
  { name: 'Twitter', icon: XTwitterLogo, color: 'text-slate-900 dark:text-slate-100', badge: 'bg-slate-900/10 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-700' },
  { name: 'Vimeo', icon: VimeoLogo, color: 'text-sky-600', badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200/80 dark:border-sky-900/60' },
  { name: 'SoundCloud', icon: SoundCloudLogo, color: 'text-amber-600', badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60' },
];

interface HeroSectionProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  currentUrl: string;
  onUrlChange: (url: string) => void;
  detectedPlatform: PlatformDetectionResult | null;
}

const SAMPLE_LINKS = [
  {
    name: 'YouTube Short (Music)',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=T1tQbooacnE',
    icon: Play,
  },
  {
    name: 'TikTok Video',
    type: 'tiktok',
    url: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
    icon: Play,
  },
  {
    name: 'Instagram Reel',
    type: 'instagram',
    url: 'https://www.instagram.com/reel/C-123456789/',
    icon: Film,
  },
  {
    name: 'Pinterest HD Pin',
    type: 'pinterest',
    url: 'https://www.pinterest.com/pin/1098174690415756357/',
    icon: Pin,
  },
  {
    name: 'Facebook Video',
    type: 'facebook',
    url: 'https://www.facebook.com/watch?v=272591278381388',
    icon: Video,
  },
  {
    name: 'Sample HD Video (MP4)',
    type: 'video',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    icon: Video,
  },
  {
    name: 'Audio Track (MP3)',
    type: 'audio',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
    icon: Music,
  },
  {
    name: 'Sample Photo (JPG)',
    type: 'image',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/elephant-660-480.jpg',
    icon: Film,
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyze,
  isLoading,
  error,
  currentUrl,
  onUrlChange,
  detectedPlatform,
}) => {
  const [copiedState, setCopiedState] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);

  const handlePaste = async () => {
    setPasteError(null);
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          onUrlChange(text.trim());
          setCopiedState(true);
          setTimeout(() => setCopiedState(false), 2000);
        } else {
          setPasteError('Clipboard is empty.');
          setTimeout(() => setPasteError(null), 3000);
        }
      } else {
        setPasteError('Clipboard access not permitted in this browser.');
        setTimeout(() => setPasteError(null), 3000);
      }
    } catch {
      setPasteError('Please press Ctrl+V / Cmd+V to paste manually.');
      setTimeout(() => setPasteError(null), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUrl.trim()) return;
    onAnalyze(currentUrl.trim());
  };

  const handleSampleClick = (sampleUrl: string) => {
    onUrlChange(sampleUrl);
    onAnalyze(sampleUrl);
    const inputEl = document.getElementById('media-url-input');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-500/15 via-indigo-500/10 to-blue-500/15 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-purple-600/10 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-blue-600/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Heading below nav bar */}
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight inline-block">
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
              Quick
            </span>{' '}
            <span className="text-black dark:text-white">
              Downloader
            </span>
          </h2>
        </div>

        {/* Interactive "Supported Platforms" Card with Radius and Smooth Left-to-Right Animated Icons & Text */}
        <div
          onClick={() => {
            const el = document.getElementById('media-url-input');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.focus();
            }
          }}
          className="group relative max-w-sm sm:max-w-lg mx-auto mb-6 sm:mb-8 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl sm:rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-purple-200/80 dark:border-purple-800/60 shadow-md shadow-purple-500/10 hover:shadow-2xl hover:shadow-indigo-500/25 hover:border-purple-400 dark:hover:border-purple-500 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden"
          title="Click to paste link and download"
        >
          {/* Subtle luminous ambient aura on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/8 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Headline inside the card */}
          <div className="relative z-10 flex items-center justify-center gap-2 mb-2.5 pointer-events-none select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-300 dark:via-indigo-300 dark:to-blue-300 bg-clip-text text-transparent">
              Supported Platforms
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          </div>

          {/* Smooth left-to-right animated ticker showing social media icons together with their text */}
          <div className="relative overflow-hidden w-full py-0.5">
            {/* Soft Edge Fade Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white/95 dark:from-slate-900/95 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/95 dark:from-slate-900/95 to-transparent z-10 pointer-events-none" />

            <div className="animate-slide-ltr flex items-center gap-2 sm:gap-2.5 will-change-transform">
              {[...HERO_PLATFORM_PILLS, ...HERO_PLATFORM_PILLS].map((platform, i) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={`${platform.name}-${i}`}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] sm:text-xs font-bold whitespace-nowrap shadow-xs ${platform.badge} group-hover:scale-105 transition-transform duration-200 select-none`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${platform.color} shrink-0`} />
                    <span className="text-slate-800 dark:text-slate-100 font-bold">{platform.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.25] text-balance">
          <span className="text-slate-900 dark:text-white">Download </span>
          <span className="bg-red-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md shadow-xs inline-block mx-1 align-middle">
            Your Favourate
          </span>
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
            {' '}Media File
          </span>
        </h1>

        {/* Short Value Proposition Description */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-balance text-black font-semibold">
          Paste video, audio, or image links from YouTube, TikTok, Instagram, Pinterest, Facebook, Vimeo, or direct files. Extract formats, preview streams,{' '}
          <span className="bg-[#c3ff00] text-black px-1.5 py-0.5 rounded-md inline-block font-semibold">
            download in pristine high definition.
          </span>
        </p>

        {/* URL Input Form Container */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10 max-w-3xl mx-auto">
          <div className="relative rounded-2xl bg-white dark:bg-slate-900 p-2 sm:p-2.5 shadow-xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-800 transition-all duration-200 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
              {/* Platform Detection Indicator */}
              {detectedPlatform && detectedPlatform.platformId !== 'unknown' && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="max-w-[110px] truncate">{detectedPlatform.platformName}</span>
                </div>
              )}

              {/* Main Text Input */}
              <div className="relative flex-1 flex items-center min-w-0">
                <input
                  id="media-url-input"
                  type="url"
                  value={currentUrl}
                  onChange={(e) => onUrlChange(e.target.value)}
                  placeholder="Paste URL (e.g. YouTube, TikTok, Instagram, Pinterest, Facebook, or .mp4 link)..."
                  className="w-full pl-3 pr-9 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 dark:text-white bg-transparent border-none focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />

                {/* Clear Input Button */}
                {currentUrl && (
                  <button
                    type="button"
                    onClick={() => onUrlChange('')}
                    className="absolute right-2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Paste Button */}
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-4 h-4" />
                  <span>{copiedState ? 'Pasted!' : 'Paste'}</span>
                </button>

                {/* Submit / Get Media Button */}
                <button
                  type="submit"
                  disabled={isLoading || !currentUrl.trim()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-indigo-500/25 transition-all duration-200 active:scale-98 whitespace-nowrap cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Media</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Feedback / Error Message Banner */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-left flex items-start gap-3 max-w-2xl mx-auto animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-rose-800 dark:text-rose-200">
              <span className="font-semibold block">Unable to analyze link:</span>
              <p className="mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {pasteError && (
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            {pasteError}
          </div>
        )}

        {/* Quick Test Sample Links */}
        <div className="mt-6 pt-2">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
            Quick Test Samples (Instant working streams):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SAMPLE_LINKS.map((sample) => {
              const Icon = sample.icon;
              return (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => handleSampleClick(sample.url)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-purple-300 dark:hover:border-purple-700 rounded-lg transition-all duration-150 cursor-pointer"
                >
                  <Icon className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span>{sample.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
