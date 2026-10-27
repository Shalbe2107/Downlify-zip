import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: 'General',
    question: 'Is Quick Downloader completely free to use?',
    answer:
      'Yes, Quick Downloader is 100% free to use. There are no subscriptions, hidden paywalls, account registrations, or watermarks placed on your downloaded media files.',
  },
  {
    category: 'Formats & Quality',
    question: 'What video and audio formats can I download?',
    answer:
      'Quick Downloader supports MP4 and WebM for video files up to 1080p and 4K (subject to source resolution), and MP3 (up to 320 kbps), M4A, WAV, and OGG for audio tracks, as well as high-resolution JPG, PNG, and WebP for image assets.',
  },
  {
    category: 'Mobile & Devices',
    question: 'Can I download videos directly on Android and iPhone?',
    answer:
      'Absolutely! On Android, downloaded files automatically save to your system "Downloads" directory or Gallery. On iOS (Safari), tap "Download" and confirm the Safari download prompt. You can then tap the Safari download icon to save the file to your Files or Photos app.',
  },
  {
    category: 'Legal & Restrictions',
    question: 'Why are some private or DRM-protected links restricted?',
    answer:
      'Quick Downloader strictly respects content creators’ copyright, intellectual property rights, and platform terms of service. Private accounts, subscriber-only paywalled streams, and videos protected with digital rights management (DRM) cannot be extracted without authorized authentication. When a platform restricts automated downloads, Quick Downloader displays the platform’s official viewing link.',
  },
  {
    category: 'Performance',
    question: 'How fast are the downloads processed?',
    answer:
      'Quick Downloader processes media links in real-time. Link analysis typically takes under 1.5 seconds. The download speed depends purely on your internet connection bandwidth, as our streaming proxy forwards data directly from high-speed content delivery networks.',
  },
  {
    category: 'Privacy',
    question: 'Does Quick Downloader store a copy of the videos I download?',
    answer:
      'No. Quick Downloader operates with an ephemeral zero-log architecture. Media bytes are streamed on-the-fly and never retained on our disks. Your history is stored solely inside your personal browser’s localStorage, which you can clear at any time.',
  },
  {
    category: 'Direct Links',
    question: 'Can I download direct file links ending in .mp4 or .mp3?',
    answer:
      'Yes! You can paste any direct web media link (e.g., https://example.com/recording.mp4). Quick Downloader will inspect the source headers, verify file size, and provide a direct download with custom filename formatting.',
  },
];

export const FaqSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]); // first two open by default

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 md:py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-balance">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
            Everything you need to know about Quick Downloader, format compatibilities, and legal usage.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. Android, formats, copyright)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>

        {/* Accordion list */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            No questions matching "{searchQuery}". Try another keyword or visit our Contact page.
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndices.includes(idx);
              const slideAnimation = idx % 2 === 0 ? 'slide-in-from-left-6' : 'slide-in-from-right-6';

              return (
                <div
                  key={faq.question}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={`rounded-2xl bg-gradient-to-r from-white via-slate-50 to-purple-50/30 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-purple-950/20 border border-slate-200/90 dark:border-slate-700/80 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 ease-out animate-in fade-in ${slideAnimation} duration-500 fill-mode-both`}
                >
                  <button
                    type="button"
                    onClick={() => toggleIndex(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/60 dark:hover:bg-slate-700/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-purple-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-purple-100/60 dark:border-slate-700/60 animate-in fade-in duration-200">
                      <p className="font-normal">{faq.answer}</p>
                      <div className="mt-3 text-[11px] font-semibold text-purple-700 dark:text-purple-400">
                        Category: {faq.category}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
