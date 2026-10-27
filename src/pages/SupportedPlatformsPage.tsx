import React, { useState } from 'react';
import { 
  Search, 
  Link as LinkIcon,
  Check, 
  X as XIcon,
  ExternalLink,
  ArrowRight
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
} from '../components/SocialLogos';
import { PageRoute } from '../types';

interface SupportedPlatformsPageProps {
  onAnalyzeSample: (url: string) => void;
  onNavigate: (route: PageRoute) => void;
}

interface PlatformDetail {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  formats: string[];
  maxRes: string;
  urlPatterns: string[];
  sampleUrl: string;
  notes: string;
  status: 'Full Support' | 'Authorized Fallback' | 'Direct Streaming';
}

const PLATFORM_DETAILS: PlatformDetail[] = [
  {
    id: 'youtube',
    name: 'YouTube & YouTube Shorts',
    icon: YouTubeLogo,
    formats: ['MP4', 'WebM', 'MP3 Audio', 'HQ Thumbnail (JPG)'],
    maxRes: 'Up to 4K / 1080p',
    urlPatterns: [
      'https://youtube.com/watch?v=VIDEO_ID',
      'https://youtu.be/VIDEO_ID',
      'https://youtube.com/shorts/VIDEO_ID',
    ],
    sampleUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    notes: 'Protected streams without creative commons license follow platform terms and provide high-res cover extraction alongside official player.',
    status: 'Authorized Fallback',
  },
  {
    id: 'tiktok',
    name: 'TikTok Video & Sound',
    icon: TikTokLogo,
    formats: ['MP4 (Clean Video)', 'MP3 (Original Audio Sound)', 'JPG (Poster)'],
    maxRes: 'HD 1080p',
    urlPatterns: [
      'https://www.tiktok.com/@user/video/12345...',
      'https://vm.tiktok.com/ABCDEF/',
    ],
    sampleUrl: 'https://www.tiktok.com/@tiktok/video/7106594312292453678',
    notes: 'Supports public creator videos and original audio tracks without watermarks.',
    status: 'Full Support',
  },
  {
    id: 'instagram',
    name: 'Instagram Reels, Posts & Stories',
    icon: InstagramLogo,
    formats: ['MP4 (Reels/Clips)', 'JPG (Photos)', 'M4A (Audio)'],
    maxRes: '1080x1920 Full HD',
    urlPatterns: [
      'https://instagram.com/reel/CODE/',
      'https://instagram.com/p/CODE/',
    ],
    sampleUrl: 'https://instagram.com/reel/C123456789/',
    notes: 'Only public posts and public creator reels can be analyzed. Private accounts are strictly protected by Instagram.',
    status: 'Full Support',
  },
  {
    id: 'facebook',
    name: 'Facebook Watch & Reels',
    icon: FacebookLogo,
    formats: ['MP4 (HD/SD)', 'Audio M4A/MP3', 'Cover Poster'],
    maxRes: '1440p / 1080p HD',
    urlPatterns: [
      'https://facebook.com/watch?v=123...',
      'https://fb.watch/abcXYZ/',
    ],
    sampleUrl: 'https://www.facebook.com/watch?v=272591278381388',
    notes: 'Extracts public Facebook videos, reels, and watch clips with direct streaming links.',
    status: 'Full Support',
  },
  {
    id: 'pinterest',
    name: 'Pinterest Pins, Videos & Photos',
    icon: PinterestLogo,
    formats: ['MP4 Video (HD)', 'MP3 Audio Soundtrack', 'Original Master Photo (JPG/PNG/WebP)'],
    maxRes: '4K Master / 1080p HD',
    urlPatterns: [
      'https://www.pinterest.com/pin/1234567890/',
      'https://pin.it/abcXYZ',
    ],
    sampleUrl: 'https://www.pinterest.com/pin/1098174690415756357/',
    notes: 'Extracts full uncompressed master photos, native video streams, and audio from any Pinterest Pin or pin.it short link.',
    status: 'Full Support',
  },
  {
    id: 'twitter',
    name: 'X (Twitter) Clips & GIFs',
    icon: XTwitterLogo,
    formats: ['MP4', 'Animated GIF', 'JPG Photos'],
    maxRes: '720p HD',
    urlPatterns: [
      'https://twitter.com/user/status/123...',
      'https://x.com/user/status/123...',
    ],
    sampleUrl: 'https://twitter.com/example/status/1234567890',
    notes: 'Public tweets containing video attachments or animated media.',
    status: 'Full Support',
  },
  {
    id: 'reddit',
    name: 'Reddit Community Media',
    icon: RedditLogo,
    formats: ['MP4 (Merged Audio/Video)', 'JPG/PNG'],
    maxRes: '1080p HD',
    urlPatterns: ['https://reddit.com/r/subreddit/comments/id/title/'],
    sampleUrl: 'https://reddit.com/r/videos/comments/example',
    notes: 'Supports public subreddit posts and v.redd.it native video uploads.',
    status: 'Full Support',
  },
  {
    id: 'vimeo',
    name: 'Vimeo High Definition',
    icon: VimeoLogo,
    formats: ['MP4 (1080p, 720p)', 'MP3', 'JPG Artwork'],
    maxRes: 'Original 4K / 1080p',
    urlPatterns: ['https://vimeo.com/123456789'],
    sampleUrl: 'https://vimeo.com/76979871',
    notes: 'Native support for public Vimeo portfolios, independent films, and documentaries via official oEmbed.',
    status: 'Direct Streaming',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud Tracks',
    icon: SoundCloudLogo,
    formats: ['MP3 Audio (320 kbps)', 'Artwork (JPG)'],
    maxRes: '320 kbps High Bitrate',
    urlPatterns: ['https://soundcloud.com/artist/track-name'],
    sampleUrl: 'https://soundcloud.com/example/sample-track',
    notes: 'Public tracks permitted by artist settings.',
    status: 'Authorized Fallback',
  },
  {
    id: 'direct',
    name: 'Direct Media Files (Web Links)',
    icon: LinkIcon,
    formats: ['MP4', 'WebM', 'MKV', 'MOV', 'MP3', 'WAV', 'JPG', 'PNG', 'WebP'],
    maxRes: 'Original Bitrate / Lossless',
    urlPatterns: [
      'https://domain.com/video.mp4',
      'https://domain.com/audio.mp3',
      'https://domain.com/image.webp',
    ],
    sampleUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    notes: 'Any public HTTP/HTTPS URL pointing directly to an audio, video, or picture container.',
    status: 'Full Support',
  },
];

export const SupportedPlatformsPage: React.FC<SupportedPlatformsPageProps> = ({
  onAnalyzeSample,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');

  const filtered = PLATFORM_DETAILS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.formats.some((f) => f.toLowerCase().includes(search.toLowerCase())) ||
      p.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance">
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 dark:from-violet-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
            Supported Platforms Directory
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Quick Downloader is continually updated to support the most popular media hosting platforms and direct stream specifications.
        </p>

        {/* Search Input */}
        <div className="relative mt-8 max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search platforms (e.g. YouTube, TikTok, MP3)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-300 dark:hover:border-purple-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h2>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {item.maxRes}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.notes}
                </p>

                {/* Formats */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                    Available Formats:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* URL Pattern Examples */}
                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Accepted Link Formats:
                  </span>
                  <div className="space-y-1">
                    {item.urlPatterns.map((pat) => (
                      <code
                        key={pat}
                        className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block truncate"
                      >
                        {pat}
                      </code>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onAnalyzeSample(item.sampleUrl);
                    onNavigate('home');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer"
                >
                  <span>Test Sample Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
