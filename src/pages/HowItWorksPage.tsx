import React from 'react';
import { 
  ClipboardCheck, 
  SlidersHorizontal, 
  ArrowDownToLine, 
  Smartphone, 
  Laptop, 
  Apple, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { PageRoute } from '../types';

interface HowItWorksPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance">
          <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
            How to Download Media with Quick Downloader
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          A step-by-step walkthrough for saving video, audio, and images across all your mobile and desktop devices.
        </p>
      </div>

      {/* 3 Steps In Depth */}
      <div className="space-y-12">
        {/* Step 1 */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-extrabold text-2xl font-mono">
            01
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Copy the Media URL from Any Source
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Navigate to YouTube, TikTok, Instagram, Vimeo, or any website hosting an MP4, MP3, or image file. On desktop, copy the URL directly from your browser's address bar. On mobile devices, tap the <span className="font-semibold text-slate-900 dark:text-white">Share</span> button beneath the post or reel, then select <span className="font-semibold text-slate-900 dark:text-white">Copy Link</span>.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono text-xs text-purple-600 dark:text-purple-300">
              Example: https://youtube.com/watch?v=... or https://example.com/stream.mp4
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-extrabold text-2xl font-mono">
            02
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Paste into Quick Downloader & Inspect Formats
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Head to Quick Downloader and click the <span className="font-semibold text-slate-900 dark:text-white">Paste</span> button or press <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Ctrl+V</span>. Click <span className="font-semibold text-purple-600">Get Media</span>. Our server verifies the stream, extracts source headers, identifies the platform, and displays a categorized format table with exact resolutions, bitrates, and estimated file sizes.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row gap-8 items-start">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-extrabold text-2xl font-mono">
            03
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Download Directly to Your Storage
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Click <span className="font-semibold text-purple-600">Download</span> next to your desired format. Our streaming engine pipelines the bytes directly to your device with proper file headers so your browser initiates an immediate download.
            </p>
          </div>
        </div>
      </div>

      {/* Device Guides */}
      <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Platform-Specific Tips
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Smartphone className="w-6 h-6 text-purple-600 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">Android Users</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Files are saved straight to your device’s "Downloads" folder and instantly indexed in Google Photos or your Gallery app.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Apple className="w-6 h-6 text-indigo-600 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">iPhone & iPad (iOS)</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When prompted by Safari, tap "Download". After completion, tap the blue downward arrow in the Safari URL bar to view or save to the Photos camera roll.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Laptop className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">Desktop & Laptop</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Works seamlessly in Chrome, Firefox, Safari, Edge, and Brave. You can also right-click "Download" and select "Save Link As..." for custom destinations.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-md cursor-pointer"
          >
            <span>Try Downloading a Link Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
