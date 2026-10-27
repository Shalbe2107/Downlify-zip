import React from 'react';
import { Shield, FileText, Copyright, AlertTriangle } from 'lucide-react';
import { PageRoute } from '../types';

interface LegalPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-slate-500 font-mono">
          Last Updated: October 2026
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Zero-Log Ephemeral Architecture
          </h2>
          <p>
            Quick Downloader operates on an ephemeral, pass-through architecture. We do not store, index, or retain copies of the video, audio, or image files you analyze or stream through the service. Media bytes are buffered transiently in volatile system memory solely for the purpose of delivering the stream to your client application.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            2. Information We Do Not Collect
          </h2>
          <p>
            We do not require user account registration, social login credentials, passwords, or payment details. We do not harvest or sell personal browsing histories or URLs submitted to our inspection endpoint.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. Client-Side Local Storage
          </h2>
          <p>
            Quick Downloader utilizes your browser's local storage (localStorage) exclusively to preserve your theme preference (Light or Dark mode) and your optional recent download history list. This data remains strictly stored on your own device and is never transmitted to or synchronized with remote tracking servers. You may clear this history anytime using the in-app "Clear All History" button.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            4. Server Logs & Analytics
          </h2>
          <p>
            Our infrastructure maintains standard transient HTTP connection logs (IP address, user-agent, timestamp) strictly for firewall security, rate-limiting abuse prevention, and denial-of-service mitigation. These logs are automatically purged on a rolling basis.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            5. Contact Inquiries
          </h2>
          <p>
            If you submit a message through our Contact page, your name, email address, topic, and message content are used exclusively by our engineering support team to respond to your inquiry and are not shared with third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsOfServicePage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-xs text-slate-500 font-mono">
          Last Updated: October 2026
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Quick Downloader web application, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue using Quick Downloader immediately.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            2. Permitted & Lawful Use
          </h2>
          <p>
            Quick Downloader is provided as a utility tool for inspecting, archiving, and downloading publicly accessible media that you own, have explicit permission to download, or which is governed by Creative Commons, public domain, or applicable fair-use exceptions under copyright law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. Prohibited Activities
          </h2>
          <p>
            Users strictly agree NOT to use Quick Downloader to:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
            <li>Circumvent digital rights management (DRM), access control tokens, or encryption systems.</li>
            <li>Download content in violation of intellectual property laws or applicable terms of service.</li>
            <li>Perform denial-of-service (DoS) attacks, automated bulk scraping, or overload proxy bandwidth.</li>
            <li>Attempt server-side request forgery (SSRF) against internal or private IP address spaces.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            4. Disclaimer of Warranties & Limitation of Liability
          </h2>
          <p>
            Quick Downloader is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied. Quick Downloader is not affiliated with, endorsed by, or sponsored by YouTube, Meta (Instagram/Facebook), ByteDance (TikTok), X Corp, Vimeo, or any third-party host.
          </p>
        </section>
      </div>
    </div>
  );
};

export const CopyrightPolicyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3">
          <Copyright className="w-3.5 h-3.5" />
          <span>Intellectual Property Protection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Copyright Policy & DMCA Notice
        </h1>
        <p className="mt-2 text-xs text-slate-500 font-mono">
          DMCA Compliance & Takedown Procedure
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Respect for Intellectual Property
          </h2>
          <p>
            Quick Downloader respects the intellectual property rights of creators, artists, broadcasters, and rights holders worldwide. Quick Downloader does not host any media files on its servers and acts strictly as a transient conduit for user-directed HTTP streams.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            2. DMCA Takedown Notice Procedure
          </h2>
          <p>
            If you are a copyright owner or an authorized agent thereof and believe that any media stream processed through our domain infringes upon your copyright, you may submit a formal notification pursuant to the Digital Millennium Copyright Act (17 U.S.C. § 512(c)(3)).
          </p>
          <p className="mt-2">
            Your notification must include:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-600 dark:text-slate-400">
            <li>A physical or electronic signature of the authorized copyright owner or representative.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>The specific URL(s) you request to be blocked or restricted from analysis.</li>
            <li>Your contact information (name, mailing address, telephone number, and email address).</li>
            <li>A statement that you have a good-faith belief that use of the material is unauthorized.</li>
            <li>A statement under penalty of perjury that the information in the notification is accurate.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. Filing a Request
          </h2>
          <p>
            You can file a DMCA notification directly through our{' '}
            <button
              onClick={() => onNavigate('contact')}
              className="text-purple-600 dark:text-purple-400 underline font-semibold cursor-pointer"
            >
              Contact Form
            </button>{' '}
            by selecting the "DMCA / Copyright Notice" category, or email copyright@quickdownloader.app.
          </p>
        </section>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Legal Boundary</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="mt-2 text-xs text-slate-500 font-mono">
          Platform Disclaimers & Fair Use Notice
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            1. Trademark & Platform Disclaimers
          </h2>
          <p>
            All product names, logos, brands, and registered trademarks displayed on Quick Downloader (including YouTube, Instagram, TikTok, Facebook, Twitter/X, Vimeo, SoundCloud, Reddit, and Pinterest) are property of their respective owners. Their mention on Quick Downloader is purely for descriptive, nominative identification of supported URL domains and does not imply endorsement, affiliation, or sponsorship.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            2. User Responsibility
          </h2>
          <p>
            Quick Downloader provides media inspection and format pipelining tools. The individual user remains exclusively responsible for the content they choose to access, analyze, and save. Users must ensure compliance with applicable national copyright laws, content creator licenses, and personal fair-use standards.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            3. No Circumvention Guarantee
          </h2>
          <p>
            Quick Downloader does not crack encryption, decode Widevine/PlayReady DRM, or circumvent subscription paywalls. Content that requires paid membership, authentication tokens, or restricted platform access cannot be downloaded through this utility.
          </p>
        </section>
      </div>
    </div>
  );
};
