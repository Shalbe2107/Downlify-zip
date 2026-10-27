import React, { useState, useEffect, useRef } from 'react';
import { PageRoute } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  DownloadCloud, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  History, 
  Home,
  BookOpen,
  Workflow,
  Layers,
  HelpCircle,
  Sparkles,
  Mail,
  ChevronRight,
  Zap
} from 'lucide-react';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onOpenHistory,
  historyCount,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navLinks: { 
    label: string; 
    route: PageRoute; 
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    gradient: string;
  }[] = [
    { 
      label: 'Home', 
      route: 'home', 
      icon: Home, 
      description: 'Media download engine & link inspector',
      gradient: 'from-purple-600 to-indigo-600'
    },
    { 
      label: 'Blog', 
      route: 'blog', 
      icon: BookOpen, 
      description: 'Streaming guides, 4K tips & tech articles',
      gradient: 'from-violet-600 to-purple-600'
    },
    { 
      label: 'How It Works', 
      route: 'how-it-works', 
      icon: Workflow, 
      description: 'Simple 3-step guide for mobile & desktop',
      gradient: 'from-indigo-600 to-blue-600'
    },
    { 
      label: 'Supported Platforms', 
      route: 'supported-platforms', 
      icon: Layers, 
      description: 'YouTube, TikTok, Reels, Facebook, MP4 & audio',
      gradient: 'from-blue-600 to-cyan-600'
    },
    { 
      label: 'FAQ', 
      route: 'faq', 
      icon: HelpCircle, 
      description: 'Frequently asked questions & legal usage',
      gradient: 'from-amber-600 to-orange-600'
    },
    { 
      label: 'About', 
      route: 'about', 
      icon: Sparkles, 
      description: 'Zero-log ephemeral architecture & ethics',
      gradient: 'from-emerald-600 to-teal-600'
    },
    { 
      label: 'Contact', 
      route: 'contact', 
      icon: Mail, 
      description: 'Get in touch with our technical support team',
      gradient: 'from-pink-600 to-rose-600'
    },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Wordmark & Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group cursor-pointer text-left whitespace-nowrap shrink-0 min-w-0"
            aria-label="Quick Downloader Home"
          >
            <img
              src="/favicon-512x512.png"
              alt="Quick Downloader Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-200 object-contain ring-1 ring-white/20 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-xl font-extrabold tracking-tight truncate">
                <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Quick
                </span>{' '}
                <span className="text-black dark:text-white">
                  Downloader
                </span>
              </span>
            </div>
          </button>

          {/* Right Controls: History, Theme, Quick CTA & The Hamburger Menu */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Quick Action Button */}
            <button
              onClick={() => {
                if (currentRoute !== 'home') {
                  handleNavClick('home');
                }
                const inputEl = document.getElementById('media-url-input');
                if (inputEl) {
                  inputEl.focus();
                  inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-sm shadow-indigo-500/25 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer hover:shadow-indigo-500/40"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Get Media</span>
            </button>

            {/* History drawer button (compact on mobile) */}
            <button
              onClick={onOpenHistory}
              title="Recent Downloads"
              className="relative p-1.5 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hover:scale-105"
              aria-label="View download history"
            >
              <History className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[9px] sm:text-[10px] font-bold rounded-full bg-purple-600 text-white flex items-center justify-center tabular-nums shadow-sm">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Theme Toggle (compact on mobile) */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-1.5 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hover:scale-105"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600 dark:text-slate-300" />
              )}
            </button>

            {/* Hamburger Menu Button ("hemberg logo" - fully visible, properly sized on mobile & desktop) */}
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                menuOpen
                  ? 'bg-purple-600 text-white border-purple-600 shadow-purple-500/25 scale-105 ring-2 ring-purple-400/40'
                  : 'bg-slate-50 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-950/30'
              }`}
              aria-label="Toggle pages menu"
              aria-expanded={menuOpen}
              title="Menu"
            >
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                {menuOpen ? (
                  <X className="w-5 h-5 animate-in spin-in-90 duration-200" />
                ) : (
                  <Menu className="w-5 h-5 animate-in fade-in duration-200 stroke-[2.25]" />
                )}
              </div>
              <span className="hidden sm:inline font-semibold tracking-wide">Pages</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Navigation Overlay & Dropdown / Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={menuRef}
            className="max-w-md w-[calc(100%-1.5rem)] mx-auto sm:ml-auto sm:mr-8 mt-3 bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/60 rounded-3xl shadow-2xl shadow-purple-500/15 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-250 transition-all"
          >
            {/* Header in Hamburger Drawer */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 via-indigo-50/60 to-transparent dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-transparent border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 font-mono">
                  Site Navigation
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Browse All Pages
                </h3>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links list */}
            <div className="p-3 space-y-1.5 max-h-[calc(100vh-180px)] overflow-y-auto">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentRoute === link.route;

                return (
                  <button
                    key={link.route}
                    onClick={() => handleNavClick(link.route)}
                    className={`w-full group text-left p-3 rounded-2xl transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-300 dark:border-purple-700 shadow-sm'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${link.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold truncate ${
                            isActive 
                              ? 'text-purple-700 dark:text-purple-300' 
                              : 'text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300'
                          }`}>
                            {link.label}
                          </span>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {link.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isActive
                        ? 'text-purple-600 dark:text-purple-400 translate-x-0.5'
                        : 'text-slate-300 dark:text-slate-600 group-hover:text-purple-500 group-hover:translate-x-1'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Action Footer inside Hamburger Menu */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  handleNavClick('home');
                  setTimeout(() => {
                    const inputEl = document.getElementById('media-url-input');
                    inputEl?.focus();
                  }, 150);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Paste & Download URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
