import React from 'react';
import { FaqSection } from '../components/FaqSection';
import { PageRoute } from '../types';

interface FaqPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-6">
      <FaqSection />
      
      {/* Additional Help Prompt */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 text-center">
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Still have questions or need technical support?
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Our team is happy to assist with link format errors, platform suggestions, or developer inquiries.
          </p>
          <div className="mt-5">
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg shadow-sm cursor-pointer"
            >
              Contact Quick Downloader Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
