import React from 'react';
import { DownloadCloud, ArrowUp, Sparkles, Zap } from 'lucide-react';

interface CtaSectionProps {
  onScrollToTop: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onScrollToTop }) => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 border border-purple-700/50 shadow-2xl shadow-purple-900/40 p-8 sm:p-14 text-white text-center hover:shadow-purple-700/50 hover:scale-[1.01] transition-all duration-300 animate-in fade-in zoom-in-95 duration-500 fill-mode-both group">
          {/* Ambient decorative gradient orbs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-purple-500/30 to-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-blue-500/20 to-purple-500/30 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-purple-200 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Ready to Save Your Favorite Media?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight text-balance">
              <span className="bg-gradient-to-r from-white via-purple-100 to-sky-200 bg-clip-text text-transparent">
                Start Downloading High-Quality Video & Audio Now
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-purple-200/90 max-w-lg mx-auto leading-relaxed font-normal">
              No signups, no software installations, no tracking. Paste your link above to begin your first fast download into your device's Downloads folder & Gallery.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onScrollToTop}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-extrabold rounded-2xl bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-slate-950/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 text-purple-600" />
                <span>Paste A Media Link</span>
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
