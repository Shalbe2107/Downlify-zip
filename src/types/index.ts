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
  label: string;
  extension: string;
  resolution?: string;
  bitrate?: string;
  fileSizeFormatted?: string;
  fileSizeBytes?: number;
  quality: 'ultra' | 'high' | 'medium' | 'standard';
  downloadUrl: string;
  isDirectDownload: boolean;
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
  previewUrl?: string;
  durationFormatted?: string;
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

export interface DownloadHistoryItem {
  id: string;
  url: string;
  title: string;
  platformName: string;
  platformId: PlatformId;
  thumbnail?: string;
  formatDownloaded?: string;
  timestamp: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  status: 'published' | 'draft';
  tags: string[];
}

export type PageRoute = 
  | 'home'
  | 'how-it-works'
  | 'supported-platforms'
  | 'about'
  | 'contact'
  | 'faq'
  | 'blog'
  | 'admin-login'
  | 'admin-dashboard'
  | 'privacy'
  | 'terms'
  | 'copyright'
  | 'disclaimer'
  | 'sitemap';
