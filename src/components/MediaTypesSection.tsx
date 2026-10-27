import React from 'react';
import { Video, Music, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

export const MediaTypesSection: React.FC = () => {
  const mediaCategories = [
    {
      title: 'Video Formats',
      subtitle: 'MP4, WebM, MKV, MOV',
      icon: Video,
      color: 'from-purple-600 to-indigo-600',
      bgGradient: 'from-white via-purple-50/40 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30',
      borderColor: 'border-purple-200/80 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-500',
      shadowColor: 'hover:shadow-purple-500/25',
      slideAnimation: 'slide-in-from-left-10',
      badge: 'Up to 4K 60fps',
      description:
        'Download video streams in industry-standard MP4 or open WebM format, playable on any television, computer, iPad, or Android phone without extra codecs.',
      specs: [
        { label: 'Resolutions', value: '4K (2160p), 1080p, 720p, 480p' },
        { label: 'Containers', value: 'MP4 (H.264 / AAC), WebM (VP9)' },
        { label: 'Audio Sync', value: '100% synchronized AAC stereo' },
        { label: 'Use Cases', value: 'Offline viewing, presentations, archiving' },
      ],
    },
    {
      title: 'Audio Formats',
      subtitle: 'MP3, M4A, WAV, AAC',
      icon: Music,
      color: 'from-indigo-600 to-blue-600',
      bgGradient: 'from-white via-indigo-50/40 to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30',
      borderColor: 'border-indigo-200/80 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-500',
      shadowColor: 'hover:shadow-indigo-500/25',
      slideAnimation: 'slide-in-from-bottom-10',
      badge: '320 kbps Studio Quality',
      description:
        'Extract high-fidelity audio tracks from video clips or podcasts. Save memory on mobile devices and listen on headphones anywhere without consuming cellular data.',
      specs: [
        { label: 'Bitrates', value: '320 kbps, 256 kbps, 128 kbps CBR' },
        { label: 'Frequency', value: '44.1 kHz / 48 kHz standard' },
        { label: 'Containers', value: 'MP3, M4A, OGG, WAV' },
        { label: 'Use Cases', value: 'Gym workouts, car audio, ringtones, remixes' },
      ],
    },
    {
      title: 'Image Formats',
      subtitle: 'JPG, PNG, WebP, GIF',
      icon: ImageIcon,
      color: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-white via-blue-50/40 to-cyan-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30',
      borderColor: 'border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500',
      shadowColor: 'hover:shadow-cyan-500/25',
      slideAnimation: 'slide-in-from-right-10',
      badge: 'Uncompressed Original',
      description:
        'Save high-resolution thumbnails, post covers, wallpapers, and artwork in lossless PNG, modern WebP, or universal JPEG with zero watermark degradation.',
      specs: [
        { label: 'Resolutions', value: 'Source dimensions up to 8K' },
        { label: 'Color Space', value: 'sRGB / Display P3 preserved' },
        { label: 'Containers', value: 'JPEG, PNG, WebP, Animated GIF' },
        { label: 'Use Cases', value: 'Graphic design, wallpapers, thumbnails' },
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border-t border-slate-200/80 dark:border-slate-800/80 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-700 dark:text-purple-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>High-Fidelity Audio & Visual Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Comprehensive Media Format Support
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
            Quick Downloader adapts to every media container with optimized compression and bitrate preservation.
          </p>
        </div>

        {/* Directional Appear Animated Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mediaCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                style={{ animationDelay: `${idx * 120}ms` }}
                className={`rounded-3xl bg-gradient-to-br ${cat.bgGradient} border ${cat.borderColor} shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 p-6 sm:p-8 flex flex-col justify-between hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${cat.shadowColor} transition-all duration-300 ease-out group animate-in fade-in ${cat.slideAnimation} duration-600 fill-mode-both relative overflow-hidden`}
              >
                {/* Decorative subtle glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${cat.color} text-white flex items-center justify-center shadow-md shadow-slate-900/15 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 font-mono px-2.5 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 shadow-sm">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs font-mono text-purple-700 dark:text-purple-300 font-semibold mt-1">
                    {cat.subtitle}
                  </p>

                  <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {cat.description}
                  </p>

                  <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-slate-700/60 space-y-3">
                    {cat.specs.map((spec) => (
                      <div key={spec.label} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{spec.label}</span>
                        <span className="text-slate-900 dark:text-white font-bold text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
