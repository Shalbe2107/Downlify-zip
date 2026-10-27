import React from 'react';

interface FloatingElement {
  id: string;
  type: 
    | 'video' 
    | 'video-clapper' 
    | 'video-film' 
    | 'video-camcorder'
    | 'audio' 
    | 'audio-mic' 
    | 'audio-vinyl' 
    | 'audio-waves' 
    | 'audio-cassette'
    | 'image' 
    | 'image-polaroid' 
    | 'image-vector' 
    | 'photography' 
    | 'photo-aperture'
    | 'youtube' 
    | 'instagram' 
    | 'facebook' 
    | 'tiktok';
  top: string;
  left?: string;
  right?: string;
  animationClass: string;
  duration: string;
  size: string;
  rotateInitial: string;
  opacityClass: string;
}

const FLOATING_ELEMENTS: FloatingElement[] = [
  // --- Zone 1: Hero & Upper Region (0% - 25%) ---
  {
    id: 'yt-1',
    type: 'youtube',
    top: '4%',
    left: '4%',
    animationClass: 'animate-float-random-1',
    duration: '22s',
    size: 'w-13 h-13 sm:w-16 sm:h-16',
    rotateInitial: '-rotate-6',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'video-cam-1',
    type: 'video-camcorder',
    top: '7%',
    right: '5%',
    animationClass: 'animate-float-random-7',
    duration: '27s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: 'rotate-12',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'audio-waves-1',
    type: 'audio-waves',
    top: '14%',
    left: '12%',
    animationClass: 'animate-float-random-3',
    duration: '25s',
    size: 'w-13 h-13 sm:w-15 sm:h-15',
    rotateInitial: 'rotate-4',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'photo-aperture-1',
    type: 'photo-aperture',
    top: '16%',
    right: '15%',
    animationClass: 'animate-float-random-8',
    duration: '31s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: '-rotate-8',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'tt-1',
    type: 'tiktok',
    top: '23%',
    right: '4%',
    animationClass: 'animate-float-random-2',
    duration: '24s',
    size: 'w-12 h-12 sm:w-14 sm:h-14',
    rotateInitial: '-rotate-12',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'img-polaroid-1',
    type: 'image-polaroid',
    top: '24%',
    left: '5%',
    animationClass: 'animate-float-random-5',
    duration: '28s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: 'rotate-8',
    opacityClass: 'opacity-20 dark:opacity-15',
  },

  // --- Zone 2: Supported Platforms & Upper Middle (26% - 50%) ---
  {
    id: 'video-clapper-1',
    type: 'video-clapper',
    top: '32%',
    right: '12%',
    animationClass: 'animate-float-random-4',
    duration: '26s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: 'rotate-6',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'audio-mic-1',
    type: 'audio-mic',
    top: '34%',
    left: '8%',
    animationClass: 'animate-float-random-6',
    duration: '29s',
    size: 'w-13 h-13 sm:w-15 sm:h-15',
    rotateInitial: '-rotate-6',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'ig-1',
    type: 'instagram',
    top: '39%',
    right: '3%',
    animationClass: 'animate-float-random-1',
    duration: '23s',
    size: 'w-13 h-13 sm:w-15 sm:h-15',
    rotateInitial: 'rotate-12',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'video-1',
    type: 'video',
    top: '43%',
    left: '3%',
    animationClass: 'animate-float-random-7',
    duration: '32s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: '-rotate-10',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'audio-vinyl-1',
    type: 'audio-vinyl',
    top: '47%',
    right: '10%',
    animationClass: 'animate-float-random-2',
    duration: '28s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: 'rotate-45',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'fb-1',
    type: 'facebook',
    top: '49%',
    left: '11%',
    animationClass: 'animate-float-random-3',
    duration: '26s',
    size: 'w-12 h-12 sm:w-14 sm:h-14',
    rotateInitial: 'rotate-8',
    opacityClass: 'opacity-25 dark:opacity-20',
  },

  // --- Zone 3: How It Works & Media Types (51% - 75%) ---
  {
    id: 'img-1',
    type: 'image',
    top: '55%',
    right: '5%',
    animationClass: 'animate-float-random-8',
    duration: '25s',
    size: 'w-15 h-15 sm:w-17 sm:h-17',
    rotateInitial: '-rotate-6',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'video-film-1',
    type: 'video-film',
    top: '58%',
    left: '4%',
    animationClass: 'animate-float-random-5',
    duration: '30s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: 'rotate-12',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'audio-cassette-1',
    type: 'audio-cassette',
    top: '63%',
    right: '13%',
    animationClass: 'animate-float-random-6',
    duration: '27s',
    size: 'w-15 h-15 sm:w-17 sm:h-17',
    rotateInitial: '-rotate-8',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'photo-1',
    type: 'photography',
    top: '66%',
    left: '8%',
    animationClass: 'animate-float-random-1',
    duration: '29s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: 'rotate-6',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'yt-2',
    type: 'youtube',
    top: '71%',
    right: '4%',
    animationClass: 'animate-float-random-4',
    duration: '24s',
    size: 'w-12 h-12 sm:w-14 sm:h-14',
    rotateInitial: '-rotate-12',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'image-vector-1',
    type: 'image-vector',
    top: '74%',
    left: '12%',
    animationClass: 'animate-float-random-7',
    duration: '31s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: 'rotate-10',
    opacityClass: 'opacity-20 dark:opacity-15',
  },

  // --- Zone 4: Key Benefits & FAQ to Footer (76% - 100%) ---
  {
    id: 'audio-1',
    type: 'audio',
    top: '80%',
    right: '11%',
    animationClass: 'animate-float-random-2',
    duration: '28s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: '-rotate-6',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'tt-2',
    type: 'tiktok',
    top: '82%',
    left: '5%',
    animationClass: 'animate-float-random-3',
    duration: '26s',
    size: 'w-13 h-13 sm:w-15 sm:h-15',
    rotateInitial: 'rotate-12',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'video-clapper-2',
    type: 'video-clapper',
    top: '87%',
    right: '6%',
    animationClass: 'animate-float-random-8',
    duration: '33s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: '-rotate-10',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'ig-2',
    type: 'instagram',
    top: '89%',
    left: '10%',
    animationClass: 'animate-float-random-5',
    duration: '25s',
    size: 'w-12 h-12 sm:w-14 sm:h-14',
    rotateInitial: 'rotate-6',
    opacityClass: 'opacity-25 dark:opacity-20',
  },
  {
    id: 'audio-waves-2',
    type: 'audio-waves',
    top: '93%',
    right: '14%',
    animationClass: 'animate-float-random-6',
    duration: '30s',
    size: 'w-13 h-13 sm:w-15 sm:h-15',
    rotateInitial: 'rotate-8',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
  {
    id: 'img-polaroid-2',
    type: 'image-polaroid',
    top: '95%',
    left: '4%',
    animationClass: 'animate-float-random-1',
    duration: '29s',
    size: 'w-14 h-14 sm:w-16 sm:h-16',
    rotateInitial: '-rotate-8',
    opacityClass: 'opacity-20 dark:opacity-15',
  },
];

export const FloatingBackgroundElements: React.FC = () => {
  const renderIcon = (type: FloatingElement['type']) => {
    switch (type) {
      case 'youtube':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 p-2.5 shadow-lg shadow-red-500/30 flex items-center justify-center border border-white/25 backdrop-blur-xs">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );

      case 'instagram':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-2.5 shadow-lg shadow-pink-500/30 flex items-center justify-center border border-white/25 backdrop-blur-xs">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-white stroke-2" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'facebook':
        return (
          <div className="w-full h-full rounded-full bg-[#1877F2] p-2 shadow-lg shadow-blue-600/30 flex items-center justify-center border border-white/25 backdrop-blur-xs">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-white" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );

      case 'tiktok':
        return (
          <div className="w-full h-full rounded-2xl bg-black p-2.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center border border-white/25 backdrop-blur-xs">
            <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
              <path
                fill="#25F4EE"
                d="M12.525.02c1.31 0 2.59.34 3.72.99.18-.73.49-1.01.49-1.01s-1.84 2.89 1.48 4.79c1.07.61 2.29.93 3.53.94v3.52c-1.57-.02-3.09-.5-4.41-1.39v7.92c0 4.14-3.36 7.5-7.5 7.5S2.33 20.98 2.33 16.84s3.36-7.5 7.5-7.5c.42 0 .84.04 1.25.11V13c-.4-.11-.81-.17-1.25-.17-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V0h-1.305z"
              />
              <path
                fill="#FE2C55"
                d="M14.525 2.02c1.31 0 2.59.34 3.72.99.18-.73.49-1.01.49-1.01s-1.84 2.89 1.48 4.79c1.07.61 2.29.93 3.53.94v3.52c-1.57-.02-3.09-.5-4.41-1.39v7.92c0 4.14-3.36 7.5-7.5 7.5S4.33 22.98 4.33 18.84s3.36-7.5 7.5-7.5c.42 0 .84.04 1.25.11V15c-.4-.11-.81-.17-1.25-.17-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V2h-1.305z"
                className="opacity-80"
              />
              <path
                fill="#FFFFFF"
                d="M13.525 1.02c1.31 0 2.59.34 3.72.99.18-.73.49-1.01.49-1.01s-1.84 2.89 1.48 4.79c1.07.61 2.29.93 3.53.94v3.52c-1.57-.02-3.09-.5-4.41-1.39v7.92c0 4.14-3.36 7.5-7.5 7.5S3.33 21.98 3.33 17.84s3.36-7.5 7.5-7.5c.42 0 .84.04 1.25.11V14c-.4-.11-.81-.17-1.25-.17-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V1h-1.305z"
              />
            </svg>
          </div>
        );

      // --- Enhanced Video PNG Elements ---
      case 'video':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-2.5 shadow-lg shadow-indigo-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <path d="m22 8-6 4 6 4V8Z" />
              <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">4K VIDEO</span>
          </div>
        );

      case 'video-clapper':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-700 to-slate-900 p-2.5 shadow-lg shadow-purple-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
              <path d="m4 11 3.5-6h13l-3.5 6H4Z" />
              <path d="m11 5 3.5 6" />
              <path d="m7.5 5 3.5 6" />
              <path d="m14.5 5 3.5 6" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">SCENE</span>
          </div>
        );

      case 'video-film':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-700 via-fuchsia-600 to-rose-600 p-2.5 shadow-lg shadow-pink-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
              <line x1="7" x2="7" y1="2" y2="22" />
              <line x1="17" x2="17" y1="2" y2="22" />
              <line x1="2" x2="22" y1="12" y2="12" />
              <line x1="2" x2="7" y1="7" y2="7" />
              <line x1="2" x2="7" y1="17" y2="17" />
              <line x1="17" x2="22" y1="17" y2="17" />
              <line x1="17" x2="22" y1="7" y2="7" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">CINEMA</span>
          </div>
        );

      case 'video-camcorder':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 p-2.5 shadow-lg shadow-sky-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <path d="M15 10l5-3v10l-5-3V10z" />
              <rect x="2" y="6" width="13" height="12" rx="3" />
              <circle cx="8" cy="12" r="2" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">CAM HD</span>
          </div>
        );

      // --- Enhanced Audio PNG Elements ---
      case 'audio':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 p-2.5 shadow-lg shadow-sky-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">320 KBPS</span>
          </div>
        );

      case 'audio-mic':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-2.5 shadow-lg shadow-pink-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">STUDIO</span>
          </div>
        );

      case 'audio-vinyl':
        return (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950 p-2 shadow-lg shadow-slate-900/40 flex flex-col items-center justify-center text-white border-2 border-amber-400/50">
            <div className="w-7 h-7 rounded-full border border-slate-600 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            </div>
            <span className="text-[7px] font-bold text-amber-300 uppercase tracking-wider mt-0.5">VINYL</span>
          </div>
        );

      case 'audio-waves':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 p-2 shadow-lg shadow-cyan-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
              <span className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              <span className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            </div>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">WAV</span>
          </div>
        );

      case 'audio-cassette':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-600 p-2 shadow-lg shadow-purple-600/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="16" cy="12" r="2" />
              <line x1="8" x2="16" y1="12" y2="12" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">MIXTAPE</span>
          </div>
        );

      // --- Enhanced Image & Photography PNG Elements ---
      case 'image':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 p-2.5 shadow-lg shadow-violet-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">HD IMAGE</span>
          </div>
        );

      case 'image-polaroid':
        return (
          <div className="w-full h-full rounded-xl bg-white dark:bg-slate-200 p-1.5 pb-2 shadow-xl shadow-slate-900/20 flex flex-col items-center border border-slate-300">
            <div className="w-full h-9 rounded bg-gradient-to-tr from-sky-400 via-indigo-500 to-rose-400 flex items-center justify-center overflow-hidden">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-300 shadow-sm" />
            </div>
            <span className="text-[7px] font-extrabold text-slate-800 tracking-wider mt-1 uppercase">PHOTO</span>
          </div>
        );

      case 'image-vector':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-500 to-emerald-500 p-2.5 shadow-lg shadow-cyan-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">VECTOR</span>
          </div>
        );

      case 'photography':
        return (
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-600 p-2.5 shadow-lg shadow-teal-500/25 flex flex-col items-center justify-center text-white border border-white/25">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span className="text-[8px] font-black tracking-widest uppercase mt-0.5 opacity-90">DSLR RAW</span>
          </div>
        );

      case 'photo-aperture':
        return (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-900 p-2 shadow-lg shadow-purple-600/30 flex flex-col items-center justify-center text-white border border-white/30">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-white stroke-2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
              <line x1="9.69" y1="8" x2="21.17" y2="8" />
              <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
              <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
              <line x1="14.31" y1="16" x2="2.83" y2="16" />
              <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
            </svg>
            <span className="text-[7px] font-black tracking-widest uppercase mt-0.5 opacity-90">F/1.4</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {FLOATING_ELEMENTS.map((el) => (
        <div
          key={el.id}
          className={`absolute ${el.animationClass} ${el.opacityClass} transition-opacity duration-700`}
          style={{
            top: el.top,
            left: el.left,
            right: el.right,
            animationDuration: el.duration,
            willChange: 'transform',
          }}
        >
          <div
            className={`${el.size} ${el.rotateInitial} transform-gpu filter drop-shadow-md hover:scale-110 transition-transform duration-300`}
          >
            {renderIcon(el.type)}
          </div>
        </div>
      ))}
    </div>
  );
};
