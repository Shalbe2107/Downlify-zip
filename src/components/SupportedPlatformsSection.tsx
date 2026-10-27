import React from 'react';
import { 
  Link as LinkIcon,
  Sparkles
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

interface PlatformItem {
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradientBadge: string;
  bgGradient: string;
  borderColor: string;
  shadowColor: string;
  video: boolean;
  audio: boolean;
  image: boolean;
  maxQuality: string;
  sampleExample: string;
}

const PLATFORMS: PlatformItem[] = [
  {
    name: 'YouTube',
    category: 'Videos & Shorts',
    icon: YouTubeLogo,
    color: 'text-red-600',
    gradientBadge: 'from-red-600 to-rose-700',
    bgGradient: 'from-white via-red-50/40 to-rose-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-red-950/30',
    borderColor: 'border-red-200/80 dark:border-red-900/50 hover:border-red-400 dark:hover:border-red-500',
    shadowColor: 'hover:shadow-red-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: '4K / 1080p',
    sampleExample: 'youtube.com/watch?v=...',
  },
  {
    name: 'Instagram',
    category: 'Reels, Posts & Audio',
    icon: InstagramLogo,
    color: 'text-pink-600',
    gradientBadge: 'from-pink-600 via-purple-600 to-amber-500',
    bgGradient: 'from-white via-pink-50/40 to-purple-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-pink-950/30',
    borderColor: 'border-pink-200/80 dark:border-pink-900/50 hover:border-pink-400 dark:hover:border-pink-500',
    shadowColor: 'hover:shadow-pink-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: 'Full HD 1080p',
    sampleExample: 'instagram.com/reel/...',
  },
  {
    name: 'TikTok',
    category: 'No-Watermark Clips',
    icon: TikTokLogo,
    color: 'text-cyan-600',
    gradientBadge: 'from-slate-900 to-slate-800',
    bgGradient: 'from-white via-slate-50 to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20',
    borderColor: 'border-slate-300 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500',
    shadowColor: 'hover:shadow-teal-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: 'HD 1080p',
    sampleExample: 'tiktok.com/@user/video/...',
  },
  {
    name: 'Facebook',
    category: 'Reels & Watch Clips',
    icon: FacebookLogo,
    color: 'text-blue-600',
    gradientBadge: 'from-blue-600 to-indigo-700',
    bgGradient: 'from-white via-blue-50/40 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30',
    borderColor: 'border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500',
    shadowColor: 'hover:shadow-blue-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: '1440p / 720p',
    sampleExample: 'facebook.com/watch?v=...',
  },
  {
    name: 'Pinterest',
    category: 'Pins, Videos & Audio',
    icon: PinterestLogo,
    color: 'text-rose-600',
    gradientBadge: 'from-rose-600 to-red-600',
    bgGradient: 'from-white via-rose-50/40 to-red-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/30',
    borderColor: 'border-rose-200/80 dark:border-rose-900/50 hover:border-rose-400 dark:hover:border-rose-500',
    shadowColor: 'hover:shadow-rose-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: '4K Master / 1080p',
    sampleExample: 'https://www.pinterest.com/pin/1098174690415756357/',
  },
  {
    name: 'X (Twitter)',
    category: 'Tweets & Video Feeds',
    icon: XTwitterLogo,
    color: 'text-slate-800 dark:text-slate-200',
    gradientBadge: 'from-slate-900 to-black',
    bgGradient: 'from-white via-slate-50 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/40',
    borderColor: 'border-slate-300/80 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500',
    shadowColor: 'hover:shadow-slate-500/20',
    video: true,
    audio: false,
    image: true,
    maxQuality: 'HD 720p',
    sampleExample: 'x.com/user/status/...',
  },
  {
    name: 'Reddit',
    category: 'Community Media',
    icon: RedditLogo,
    color: 'text-orange-600',
    gradientBadge: 'from-orange-500 to-red-600',
    bgGradient: 'from-white via-orange-50/40 to-red-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/30',
    borderColor: 'border-orange-200/80 dark:border-orange-900/50 hover:border-orange-400 dark:hover:border-orange-500',
    shadowColor: 'hover:shadow-orange-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: '1080p / 720p',
    sampleExample: 'reddit.com/r/.../comments/...',
  },
  {
    name: 'Vimeo',
    category: 'Cinematic Video',
    icon: VimeoLogo,
    color: 'text-sky-600',
    gradientBadge: 'from-sky-500 to-blue-600',
    bgGradient: 'from-white via-sky-50/40 to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30',
    borderColor: 'border-sky-200/80 dark:border-sky-900/50 hover:border-sky-400 dark:hover:border-sky-500',
    shadowColor: 'hover:shadow-sky-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: 'Original 4K',
    sampleExample: 'vimeo.com/123456...',
  },
  {
    name: 'SoundCloud',
    category: 'Music & Audio Tracks',
    icon: SoundCloudLogo,
    color: 'text-amber-600',
    gradientBadge: 'from-amber-500 to-orange-600',
    bgGradient: 'from-white via-amber-50/40 to-orange-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/30',
    borderColor: 'border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-500',
    shadowColor: 'hover:shadow-amber-500/20',
    video: false,
    audio: true,
    image: true,
    maxQuality: '320 kbps MP3',
    sampleExample: 'soundcloud.com/artist/...',
  },
  {
    name: 'Direct Media Files',
    category: 'MP4, MP3, WebM, Images',
    icon: LinkIcon,
    color: 'text-purple-600',
    gradientBadge: 'from-purple-600 to-indigo-600',
    bgGradient: 'from-white via-purple-50/40 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30',
    borderColor: 'border-purple-200/80 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-500',
    shadowColor: 'hover:shadow-purple-500/20',
    video: true,
    audio: true,
    image: true,
    maxQuality: 'Source Bitrate',
    sampleExample: 'https://example.com/video.mp4',
  },
];

interface SupportedPlatformsProps {
  onSelectSample?: (url: string) => void;
}

export const SupportedPlatformsSection: React.FC<SupportedPlatformsProps> = ({ onSelectSample }) => {
  return (
    <section id="supported-platforms" className="py-16 md:py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border-y border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Universal Platform Compatibility</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance">
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 dark:from-violet-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
              Supported Media Platforms
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
            Quick Downloader automatically identifies your link and presents every authorized download format.
          </p>
        </div>

        {/* Platform Grid with Left-to-Right & Right-to-Left Entrance Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLATFORMS.map((platform, idx) => {
            const Icon = platform.icon;
            const slideAnimation = idx % 2 === 0 ? 'slide-in-from-left-8' : 'slide-in-from-right-8';

            return (
              <div
                key={platform.name}
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => {
                  const inputEl = document.getElementById('media-url-input') as HTMLInputElement | null;
                  if (inputEl) {
                    inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    inputEl.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const inputEl = document.getElementById('media-url-input') as HTMLInputElement | null;
                    if (inputEl) {
                      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      inputEl.focus();
                    }
                  }
                }}
                role="button"
                tabIndex={0}
                title={`Click to paste a ${platform.name} link in the downloader`}
                className={`p-5 rounded-3xl bg-gradient-to-br ${platform.bgGradient} border ${platform.borderColor} shadow-md shadow-slate-200/50 dark:shadow-slate-950/40 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl ${platform.shadowColor} active:scale-[0.98] transition-all duration-300 ease-out group flex flex-col justify-between animate-in fade-in ${slideAnimation} duration-500 fill-mode-both relative overflow-hidden cursor-pointer`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${platform.gradientBadge} text-white flex items-center justify-center shadow-md shadow-slate-900/15 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold font-mono px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
                      {platform.maxQuality}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                    {platform.category}
                  </p>

                  {/* Capabilities line with high contrast */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs">
                    <span className={platform.video ? 'text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-400 line-through'}>
                      Video
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className={platform.audio ? 'text-indigo-700 dark:text-indigo-300 font-bold' : 'text-slate-400 line-through'}>
                      Audio
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className={platform.image ? 'text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-400 line-through'}>
                      Image
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate block bg-white/60 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    {platform.sampleExample}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
