import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  SlidersHorizontal, 
  ArrowDownToLine, 
  Check, 
  Laptop, 
  Smartphone, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      number: '01',
      title: 'Copy & Paste Any Media Link',
      description:
        'Copy the shareable URL of your video, reel, audio track, or direct media file from your browser or mobile app, then paste it into Quick Downloader’s search box.',
      icon: ClipboardCheck,
      gradient: 'from-purple-600 to-indigo-600',
      bgGradient: 'from-white via-purple-50/40 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/30',
      borderColor: 'border-purple-200/80 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-500',
      shadowColor: 'hover:shadow-purple-500/25',
      slideAnimation: 'slide-in-from-left-10',
      details: [
        'Works with YouTube, Instagram, TikTok, Facebook, Vimeo & direct links',
        'Automatic platform detector resolves links in milliseconds',
        'One-click clipboard paste button for quick inputs',
      ],
      previewSnippet: 'https://youtube.com/watch?v=aqz-KE-bpKQ',
    },
    {
      number: '02',
      title: 'Select Format, Quality & Resolution',
      description:
        'Quick Downloader checks source headers, metadata, and available bitrates. Choose between 1080p Full HD, 720p, high-bitrate MP3 audio, or original high-res cover art.',
      icon: SlidersHorizontal,
      gradient: 'from-indigo-600 to-blue-600',
      bgGradient: 'from-white via-indigo-50/40 to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30',
      borderColor: 'border-indigo-200/80 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-500',
      shadowColor: 'hover:shadow-indigo-500/25',
      slideAnimation: 'slide-in-from-bottom-10',
      details: [
        'Crystal clear MP4 and WebM video formats',
        'High-fidelity 320 kbps & 256 kbps MP3 audio channels',
        'Estimated file size and resolution indicators before download',
      ],
      previewSnippet: '1080p Full HD · MP4 · 24.5 MB',
    },
    {
      number: '03',
      title: 'Instant Download To Your Device',
      description:
        'Click Download to stream the file directly to your downloads folder & gallery via our secure, high-bandwidth proxy without pesky popups or deceptive redirects.',
      icon: ArrowDownToLine,
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-white via-blue-50/40 to-cyan-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/30',
      borderColor: 'border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500',
      shadowColor: 'hover:shadow-cyan-500/25',
      slideAnimation: 'slide-in-from-right-10',
      details: [
        'Direct browser streaming with accurate progress feedback',
        'No registration, watermarks, or software installations required',
        'Optimized for Android phones, iPhones, tablets, and computers',
      ],
      previewSnippet: 'Download completed in 1.8s',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Effortless 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 dark:from-indigo-400 dark:via-purple-300 dark:to-sky-400 bg-clip-text text-transparent">
              How Quick Downloader Works
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
            Three simple steps to save your favorite media for offline enjoyment.
          </p>
        </div>

        {/* 3 Step Cards Grid with Directional Appear Animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx + 1;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(idx + 1)}
                style={{ animationDelay: `${idx * 120}ms` }}
                className={`p-6 sm:p-8 rounded-3xl border bg-gradient-to-br ${step.bgGradient} ${step.borderColor} shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${step.shadowColor} transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between group animate-in fade-in ${step.slideAnimation} duration-600 fill-mode-both relative overflow-hidden`}
              >
                {/* Subtle ambient corner light */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent font-mono">
                      {step.number}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.gradient} text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {step.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    {step.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] font-mono text-purple-700 dark:text-purple-300 font-semibold truncate relative z-10 bg-white/60 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  {step.previewSnippet}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
