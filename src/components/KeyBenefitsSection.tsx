import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export const KeyBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Ultra-Fast Stream Processing',
      description:
        'Quick Downloader uses distributed edge pipelining to stream media bytes directly to your browser without sluggish server queues or intermediate file conversion bottlenecks.',
      stat: '< 1.2s Average Analysis Time',
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-white via-amber-50/30 to-orange-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20',
      borderColor: 'border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-500',
      shadowColor: 'hover:shadow-amber-500/20',
    },
    {
      icon: ShieldCheck,
      title: 'Zero-Log Privacy Architecture',
      description:
        'Your pasted URLs and downloaded streams are processed ephemerally in volatile memory. We do not store media files, link logs, or IP histories on permanent disk storage.',
      stat: 'End-to-End SSL Encrypted',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-white via-emerald-50/30 to-teal-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20',
      borderColor: 'border-emerald-200/80 dark:border-emerald-900/50 hover:border-emerald-400 dark:hover:border-emerald-500',
      shadowColor: 'hover:shadow-emerald-500/20',
    },
    {
      icon: Smartphone,
      title: 'Universal Mobile & PC Support',
      description:
        'Engineered for frictionless performance on Android phones, iPhones, tablets, MacBooks, and Windows workstations with touch-friendly controls and responsive layouts.',
      stat: '100% Device & Browser Compatible',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-white via-blue-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20',
      borderColor: 'border-blue-200/80 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500',
      shadowColor: 'hover:shadow-blue-500/20',
    },
    {
      icon: Layers,
      title: 'Direct Container Flexibility',
      description:
        'Extract audio from video clips, select lower resolutions for bandwidth conservation, or grab high-bitrate source files for archival preservation.',
      stat: 'Multiple Formats Per Link',
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-white via-purple-50/30 to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/20',
      borderColor: 'border-purple-200/80 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-500',
      shadowColor: 'hover:shadow-purple-500/20',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance">
            <span className="bg-gradient-to-r from-sky-500 via-indigo-600 to-violet-600 dark:from-sky-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
              Engineered For Speed & Privacy
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
            A media downloader designed like a modern utility rather than a cluttered ad-ridden page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            // Left to right on even, right to left on odd with staggered delays
            const slideAnimation = idx % 2 === 0 ? 'slide-in-from-left-8' : 'slide-in-from-right-8';

            return (
              <div
                key={b.title}
                style={{ animationDelay: `${idx * 100}ms` }}
                className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br ${b.bgGradient} border ${b.borderColor} shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${b.shadowColor} transition-all duration-300 ease-out flex flex-col justify-between group animate-in fade-in ${slideAnimation} duration-500 fill-mode-both relative overflow-hidden`}
              >
                {/* Decorative subtle ambient glow inside card */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${b.gradient} text-white flex items-center justify-center mb-5 shadow-md shadow-slate-900/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                    {b.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    {b.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between relative z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    {b.stat}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
