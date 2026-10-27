import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  EyeOff, 
  Cpu, 
  CheckCircle, 
  Code2, 
  Globe 
} from 'lucide-react';
import { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance">
          <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-sky-500 dark:from-purple-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
            About Quick Downloader
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          The fast, respectful, and privacy-conscious media utility built for the modern open web.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-12 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
        {/* Mission */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p>
            Quick Downloader was created to solve a persistent frustration on the internet: downloading public video, audio, and media files often forces users onto suspicious websites laden with deceptive popups, fake download buttons, intrusive tracking cookies, and spam notifications.
          </p>
          <p className="mt-3">
            We built Quick Downloader with software engineering rigor—combining a clean user interface, zero spam, and high-performance streaming pipelines so users can inspect, preview, and save permitted public content safely on their own devices.
          </p>
        </div>

        {/* Technology & Architecture */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            High-Performance Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-purple-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  In-Memory Stream Pipelining
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Instead of saving files to temporary hard disks, media chunks stream directly from source CDNs to your client browser.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <EyeOff className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Strict Zero-Log Policy
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  We never persist your download links, user identifiers, or media contents. Inspection runs in volatile memory only.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  SSRF Protection
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Our backend strictly validates destination protocols and hostnames to prevent access to private IP ranges and local loops.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Universal Device Support
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Designed from the ground up for full compliance across Android, iOS Safari, macOS, Windows, and Linux browsers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Stance & Copyright */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Ethics & Copyright Compliance
          </h2>
          <p>
            Quick Downloader is engineered strictly as a client-side media inspection and permitted download utility. We do not maintain a catalog of copyrighted works, we do not circumvent DRM protections, and we do not facilitate access to private or paid media accounts.
          </p>
          <p className="mt-3">
            Users must ensure they possess the necessary rights, authorization, or fair-use exemptions prior to saving third-party content. For copyright notices, please consult our dedicated{' '}
            <button
              onClick={() => onNavigate('copyright')}
              className="text-purple-600 dark:text-purple-400 underline font-semibold cursor-pointer"
            >
              DMCA & Copyright Policy
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
