export type PlatformId = 
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'twitter'
  | 'vimeo'
  | 'soundcloud'
  | 'reddit'
  | 'pinterest'
  | 'direct'
  | 'unknown';

export type MediaType = 'video' | 'audio' | 'image' | 'mixed';

export interface MediaFormat {
  id: string;
  type: 'video' | 'audio' | 'image';
  label: string; // e.g. "1080p Full HD", "720p HD", "320 kbps MP3", "High Res JPG"
  extension: string; // "mp4", "webm", "mp3", "m4a", "jpg", "png", "webp"
  resolution?: string; // "1920x1080", "1280x720"
  bitrate?: string; // "320 kbps", "128 kbps"
  fileSizeFormatted?: string; // "24.5 MB"
  fileSizeBytes?: number;
  quality: 'ultra' | 'high' | 'medium' | 'standard';
  downloadUrl: string;
  isDirectDownload: boolean; // if true, can be downloaded directly or proxied
  requiresProxy?: boolean;
  hasAudio?: boolean;
  notes?: string;
}

export interface PlatformDetectionResult {
  platformId: PlatformId;
  platformName: string;
  iconName: string;
  isSupported: boolean;
  cleanUrl: string;
  extractedId?: string;
  subType?: 'video' | 'audio' | 'image' | 'reel' | 'short' | 'post';
}

export interface MediaInfo {
  url: string;
  platform: PlatformDetectionResult;
  title: string;
  description?: string;
  author?: {
    name: string;
    url?: string;
    avatar?: string;
  };
  thumbnail?: string;
  previewUrl?: string; // audio preview or video preview if playable
  durationFormatted?: string; // e.g. "03:45"
  durationSeconds?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  formats: MediaFormat[];
  legalNotice?: {
    type: 'permitted' | 'terms_notice' | 'official_fallback';
    message: string;
    officialPlatformUrl?: string;
    actionLabel?: string;
  };
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  timestamp: string;
}
