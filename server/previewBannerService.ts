export interface BannerParams {
  platform?: string;
  title?: string;
  author?: string;
  type?: 'video' | 'audio' | 'image';
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generatePreviewBannerSvg(params: BannerParams): string {
  const platform = (params.platform || 'media').toLowerCase();
  const rawTitle = params.title || `${platform.toUpperCase()} Media Post`;
  const cleanTitle = escapeXml(rawTitle.slice(0, 65) + (rawTitle.length > 65 ? '...' : ''));
  const cleanAuthor = escapeXml((params.author || `${platform} Creator`).slice(0, 35));
  const type = params.type || (platform === 'soundcloud' ? 'audio' : 'video');

  // Platform-specific branding colors and accents
  let bgStart = '#0f172a';
  let bgEnd = '#1e1b4b';
  let accentColor = '#8b5cf6';
  let secondaryColor = '#38bdf8';
  let platformLabel = 'QUICK DOWNLOADER';
  let badgeSvg = '';

  if (platform === 'youtube') {
    bgStart = '#140505';
    bgEnd = '#240808';
    accentColor = '#ef4444';
    secondaryColor = '#f97316';
    platformLabel = 'YOUTUBE';
    badgeSvg = `
      <rect x="0" y="0" width="44" height="32" rx="9" fill="#ef4444"/>
      <polygon points="17,9 31,16 17,23" fill="#ffffff"/>
    `;
  } else if (platform === 'tiktok') {
    bgStart = '#05070a';
    bgEnd = '#0c0f18';
    accentColor = '#25f4ee';
    secondaryColor = '#fe2c55';
    platformLabel = 'TIKTOK';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="10" fill="#000000" stroke="#ffffff" stroke-opacity="0.2"/>
      <path d="M19 8c1 0 2.2.4 3 1.2v3.3c-1-.3-2.1-.2-3-.2v8.5c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .7 0 1 .1v3.4c-.3-.1-.6-.2-1-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V8h3.3z" fill="#25f4ee"/>
      <path d="M21 9c1 0 2.2.4 3 1.2v3.3c-1-.3-2.1-.2-3-.2v8.5c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .7 0 1 .1v3.4c-.3-.1-.6-.2-1-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V9h3.3z" fill="#fe2c55" opacity="0.8"/>
    `;
  } else if (platform === 'instagram') {
    bgStart = '#1a051d';
    bgEnd = '#2d0826';
    accentColor = '#dc2743';
    secondaryColor = '#f09433';
    platformLabel = 'INSTAGRAM';
    badgeSvg = `
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f09433"/>
          <stop offset="50%" stop-color="#dc2743"/>
          <stop offset="100%" stop-color="#bc1888"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="36" height="36" rx="10" fill="url(#ig-grad)"/>
      <rect x="7" y="7" width="22" height="22" rx="6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="5" fill="none" stroke="#ffffff" stroke-width="2.5"/>
      <circle cx="23.5" cy="12.5" r="1.5" fill="#ffffff"/>
    `;
  } else if (platform === 'facebook') {
    bgStart = '#06132b';
    bgEnd = '#0b244d';
    accentColor = '#1877f2';
    secondaryColor = '#38bdf8';
    platformLabel = 'FACEBOOK';
    badgeSvg = `
      <circle cx="18" cy="18" r="18" fill="#1877f2"/>
      <path d="M20 18h3.5l.5-4h-4v-2.5c0-1.1.3-1.8 1.9-1.8H24V6.2c-.4-.1-1.6-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.4V14H12v4h3.7v10h4.3V18z" fill="#ffffff"/>
    `;
  } else if (platform === 'vimeo') {
    bgStart = '#05192d';
    bgEnd = '#0a2e52';
    accentColor = '#1ab7ea';
    secondaryColor = '#38bdf8';
    platformLabel = 'VIMEO';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#1ab7ea"/>
      <polygon points="14,11 26,18 14,25" fill="#ffffff"/>
    `;
  } else if (platform === 'soundcloud') {
    bgStart = '#1f0d04';
    bgEnd = '#3b1808';
    accentColor = '#ff5500';
    secondaryColor = '#f59e0b';
    platformLabel = 'SOUNDCLOUD';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#ff5500"/>
      <path d="M10 23v-8m3 10V12m3 13V9m3 16V13m3 12v-5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    `;
  } else if (platform === 'twitter' || platform === 'x') {
    bgStart = '#050a12';
    bgEnd = '#0a1626';
    accentColor = '#1d9bf0';
    secondaryColor = '#818cf8';
    platformLabel = 'X / TWITTER';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#000000" stroke="#ffffff" stroke-opacity="0.2"/>
      <path d="M11 10l5.5 7.5L11 24h2l4.5-5.5L21 24h5l-6-8.5L25 10h-2l-4 5-4-5h-4z" fill="#ffffff"/>
    `;
  } else if (platform === 'pinterest') {
    bgStart = '#1a0508';
    bgEnd = '#2d080e';
    accentColor = '#e60023';
    secondaryColor = '#ff4d6d';
    platformLabel = 'PINTEREST PIN';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#e60023"/>
      <circle cx="18" cy="18" r="13" fill="#ffffff"/>
      <path d="M17.5 9c-3.6 0-5.5 2.5-5.5 5.3 0 1.3.7 2.9 2 3.5.2.1.3 0 .3-.2l.3-1.2c0-.1 0-.2-.1-.3-.4-.5-.7-1.4-.7-2.2 0-2.5 1.9-4.8 5-4.8 2.6 0 4.1 1.6 4.1 3.8 0 2.8-1.2 5.2-3.1 5.2-1 0-1.8-.8-1.5-1.9l.7-2.7c.2-.9-.2-1.7-1-1.7-.9 0-1.6.9-1.6 2.1 0 .8.2 1.3.2 1.3s-1.1 4.5-1.2 5.3c-.2 1.1-.1 2.5 0 3.4.1.1.1.1.2.1.1 0 .2-.1.3-.3.1-.2 1.4-2 1.8-3.2l.7-2.4c.3.7 1.3 1.2 2.3 1.2 3.1 0 5.2-2.9 5.2-6.6C23.4 11.9 21 9 17.5 9z" fill="#e60023"/>
    `;
  } else if (type === 'audio') {
    bgStart = '#071626';
    bgEnd = '#0b2942';
    accentColor = '#0ea5e9';
    secondaryColor = '#6366f1';
    platformLabel = 'AUDIO STREAM';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#0ea5e9"/>
      <path d="M10 22v-6a8 8 0 0 1 16 0v6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
      <rect x="7" y="16" width="5" height="7" rx="2" fill="#ffffff"/>
      <rect x="24" y="16" width="5" height="7" rx="2" fill="#ffffff"/>
    `;
  } else if (type === 'image') {
    bgStart = '#190a29';
    bgEnd = '#2b1042';
    accentColor = '#a855f7';
    secondaryColor = '#ec4899';
    platformLabel = 'HIGH RES PHOTO';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#a855f7"/>
      <rect x="7" y="7" width="22" height="22" rx="3" fill="none" stroke="#ffffff" stroke-width="2"/>
      <circle cx="13" cy="13" r="2.5" fill="#ffffff"/>
      <path d="M8 25l6-7 4 4 4-5 6 8H8z" fill="#ffffff"/>
    `;
  } else {
    // Default HD Video
    bgStart = '#090d1f';
    bgEnd = '#131b3d';
    accentColor = '#6366f1';
    secondaryColor = '#a855f7';
    platformLabel = 'MEDIA STREAM';
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#6366f1"/>
      <polygon points="14,11 26,18 14,25" fill="#ffffff"/>
    `;
  }

  // Waveform or central action visual
  let centerVisual = '';
  if (type === 'audio') {
    centerVisual = `
      <g transform="translate(420, 260)">
        <rect x="0" y="30" width="6" height="40" rx="3" fill="${accentColor}" opacity="0.8"/>
        <rect x="16" y="15" width="6" height="70" rx="3" fill="${accentColor}"/>
        <rect x="32" y="5" width="6" height="90" rx="3" fill="${secondaryColor}"/>
        <rect x="48" y="25" width="6" height="50" rx="3" fill="${accentColor}"/>
        <rect x="64" y="0" width="6" height="100" rx="3" fill="#ffffff"/>
        <rect x="80" y="20" width="6" height="60" rx="3" fill="${accentColor}"/>
        <rect x="96" y="5" width="6" height="90" rx="3" fill="${secondaryColor}"/>
        <rect x="112" y="35" width="6" height="30" rx="3" fill="${accentColor}" opacity="0.8"/>
      </g>
    `;
  } else if (type === 'image') {
    centerVisual = `
      <g transform="translate(440, 270)">
        <circle cx="40" cy="40" r="48" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="2"/>
        <rect x="22" y="22" width="36" height="36" rx="4" fill="none" stroke="#ffffff" stroke-width="3"/>
        <circle cx="31" cy="31" r="3" fill="#ffffff"/>
        <path d="M24 50l10-10 6 6 8-8 8 12H24z" fill="#ffffff"/>
      </g>
    `;
  } else {
    // Video play circle
    centerVisual = `
      <g transform="translate(440, 270)">
        <circle cx="40" cy="40" r="50" fill="${accentColor}" fill-opacity="0.25" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="40" cy="40" r="38" fill="${accentColor}" fill-opacity="0.85"/>
        <polygon points="34,26 52,40 34,54" fill="#ffffff"/>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" width="960" height="540">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgStart}"/>
      <stop offset="100%" stop-color="${bgEnd}"/>
    </linearGradient>
    <radialGradient id="glow-1" cx="20%" cy="25%" r="60%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${bgStart}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-2" cx="80%" cy="75%" r="60%">
      <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${bgEnd}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base with Ambient Glows -->
  <rect width="960" height="540" fill="url(#bg-grad)"/>
  <rect width="960" height="540" fill="url(#glow-1)"/>
  <rect width="960" height="540" fill="url(#glow-2)"/>

  <!-- Subtle Ambient Grid Lines -->
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
    <line x1="0" y1="135" x2="960" y2="135"/>
    <line x1="0" y1="270" x2="960" y2="270"/>
    <line x1="0" y1="405" x2="960" y2="405"/>
    <line x1="240" y1="0" x2="240" y2="540"/>
    <line x1="480" y1="0" x2="480" y2="540"/>
    <line x1="720" y1="0" x2="720" y2="540"/>
  </g>

  <!-- Central Play / Audio / Photo Action Indicator -->
  ${centerVisual}

  <!-- Top Left: Platform Badge & Label -->
  <g transform="translate(48, 48)">
    <g filter="url(#soft-shadow)">
      ${badgeSvg}
    </g>
    <text x="56" y="24" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="800" fill="#ffffff" letter-spacing="2" opacity="0.95">
      ${platformLabel}
    </text>
    <text x="56" y="42" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" fill="${secondaryColor}" letter-spacing="1">
      VERIFIED MEDIA POST
    </text>
  </g>

  <!-- Top Right: Quality Tag -->
  <g transform="translate(800, 48)">
    <rect x="0" y="0" width="112" height="32" rx="16" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.2"/>
    <text x="56" y="21" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">
      1080p HD
    </text>
  </g>

  <!-- Bottom Panel: Scrim & Post Title / Author Info -->
  <rect x="0" y="380" width="960" height="160" fill="url(#bg-grad)" fill-opacity="0.8"/>
  <g transform="translate(48, 440)">
    <text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="13" font-weight="600" fill="${accentColor}" letter-spacing="0.5">
      BY ${cleanAuthor.toUpperCase()}
    </text>
    <text x="0" y="32" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="24" font-weight="800" fill="#ffffff" filter="url(#soft-shadow)">
      ${cleanTitle}
    </text>
    <text x="0" y="58" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="12" font-weight="500" fill="#94a3b8">
      Stream ready for high-speed download · Audio &amp; Video available
    </text>
  </g>
</svg>`;
}
