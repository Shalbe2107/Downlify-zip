import React from 'react';
import { PageRoute } from '../types';
import { DownloadCloud, Shield, Heart, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (route: PageRoute) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100/80 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Brand & Description (Span 2 cols on lg) */}
          <div className="lg:col-span-2">
            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2.5 text-left mb-4 cursor-pointer group"
            >
              <img
                src="/favicon-512x512.png"
                alt="Quick Downloader Logo"
                className="w-8 h-8 rounded-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200 object-contain ring-1 ring-white/20"
              />
              <span className="text-xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Quick
                </span>{' '}
                <span className="text-black dark:text-white">
                  Downloader
                </span>
              </span>
            </button>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The premier modern media downloader and stream inspector. Analyze supported public video, audio, and image links with zero spam, zero malware, and high-fidelity downloads.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>Streaming Engine v1.2.0 · All Systems Operational</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleLinkClick('home')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Home Downloader
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('blog')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Blog & Articles
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('how-it-works')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('supported-platforms')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Supported Platforms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('faq')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Frequently Asked
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('about')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('contact')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Supported Formats */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Media Formats
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">MP4 Video</span>
                <span className="text-[11px] text-slate-400">(1080p / 720p)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">MP3 Audio</span>
                <span className="text-[11px] text-slate-400">(320 kbps)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">WebM Stream</span>
                <span className="text-[11px] text-slate-400">(VP9 Codec)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">M4A Sound</span>
                <span className="text-[11px] text-slate-400">(High Fidelity)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Images & Art</span>
                <span className="text-[11px] text-slate-400">(JPG, WebP, PNG)</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Legal & Trust
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => handleLinkClick('privacy')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('terms')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('copyright')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Copyright Policy & DMCA
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('disclaimer')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('sitemap')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Sitemap (XML & Index)
                </button>
              </li>
              <li className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleLinkClick('admin-login')}
                  className="text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin Login Panel</span>
                </button>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Row */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            © {currentYear} Quick Downloader. All rights reserved. Built for authorized personal media streaming and archiving.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400">
            <span>SSL Secured</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Log Pass-Through</span>
            <span aria-hidden="true">·</span>
            <span>Non-DRM Utility</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleLinkClick('admin-login')}
              className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
            >
              <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
