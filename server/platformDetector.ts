import { PlatformDetectionResult, PlatformId } from './types';

export function detectPlatform(inputUrl: string): PlatformDetectionResult {
  let trimmed = inputUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      platformId: 'unknown',
      platformName: 'Invalid URL',
      iconName: 'Globe',
      isSupported: false,
      cleanUrl: inputUrl,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname;

  // Direct media extensions test
  const directMediaMatch = pathname.match(/\.(mp4|webm|mkv|mov|avi|mp3|wav|m4a|aac|ogg|flac|jpg|jpeg|png|webp|gif|svg)$/i);
  if (directMediaMatch) {
    const ext = directMediaMatch[1].toLowerCase();
    let subType: 'video' | 'audio' | 'image' = 'image';
    if (['mp4', 'webm', 'mkv', 'mov', 'avi'].includes(ext)) subType = 'video';
    if (['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].includes(ext)) subType = 'audio';

    return {
      platformId: 'direct',
      platformName: `Direct ${ext.toUpperCase()} Media`,
      iconName: subType === 'video' ? 'Video' : subType === 'audio' ? 'Music' : 'Image',
      isSupported: true,
      cleanUrl: parsed.href,
      subType,
    };
  }

  // YouTube
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    let videoId = '';
    let subType: 'video' | 'short' = 'video';

    if (hostname.includes('youtu.be')) {
      videoId = pathname.slice(1).split('/')[0];
    } else if (pathname.startsWith('/shorts/')) {
      videoId = pathname.split('/shorts/')[1]?.split('/')[0] || '';
      subType = 'short';
    } else if (pathname.startsWith('/embed/')) {
      videoId = pathname.split('/embed/')[1]?.split('/')[0] || '';
    } else {
      videoId = parsed.searchParams.get('v') || '';
    }

    return {
      platformId: 'youtube',
      platformName: 'YouTube',
      iconName: 'Youtube',
      isSupported: true,
      cleanUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : parsed.href,
      extractedId: videoId,
      subType,
    };
  }

  // Instagram
  if (hostname.includes('instagram.com')) {
    let subType: 'reel' | 'post' = 'post';
    let id = '';
    if (pathname.includes('/reel/')) {
      subType = 'reel';
      id = pathname.split('/reel/')[1]?.split('/')[0] || '';
    } else if (pathname.includes('/p/')) {
      id = pathname.split('/p/')[1]?.split('/')[0] || '';
    }

    return {
      platformId: 'instagram',
      platformName: 'Instagram',
      iconName: 'Instagram',
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: id,
      subType,
    };
  }

  // TikTok
  if (hostname.includes('tiktok.com')) {
    const videoMatch = pathname.match(/\/video\/(\d+)/);
    const id = videoMatch ? videoMatch[1] : '';
    return {
      platformId: 'tiktok',
      platformName: 'TikTok',
      iconName: 'Music2',
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: id,
      subType: 'short',
    };
  }

  // Facebook
  if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
    return {
      platformId: 'facebook',
      platformName: 'Facebook',
      iconName: 'Facebook',
      isSupported: true,
      cleanUrl: parsed.href,
      subType: 'video',
    };
  }

  // Twitter / X
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    const match = pathname.match(/status\/(\d+)/);
    return {
      platformId: 'twitter',
      platformName: 'X / Twitter',
      iconName: 'Twitter',
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: match ? match[1] : '',
      subType: 'post',
    };
  }

  // Vimeo
  if (hostname.includes('vimeo.com')) {
    const match = pathname.match(/\/(\d+)/);
    return {
      platformId: 'vimeo',
      platformName: 'Vimeo',
      iconName: 'Film',
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: match ? match[1] : '',
      subType: 'video',
    };
  }

  // SoundCloud
  if (hostname.includes('soundcloud.com')) {
    return {
      platformId: 'soundcloud',
      platformName: 'SoundCloud',
      iconName: 'Radio',
      isSupported: true,
      cleanUrl: parsed.href,
      subType: 'audio',
    };
  }

  // Reddit
  if (hostname.includes('reddit.com') || hostname.includes('redd.it')) {
    return {
      platformId: 'reddit',
      platformName: 'Reddit',
      iconName: 'MessageSquare',
      isSupported: true,
      cleanUrl: parsed.href,
      subType: 'post',
    };
  }

  // Pinterest
  if (hostname.includes('pinterest.com') || hostname.includes('pin.it')) {
    return {
      platformId: 'pinterest',
      platformName: 'Pinterest',
      iconName: 'Pin',
      isSupported: true,
      cleanUrl: parsed.href,
      subType: 'image',
    };
  }

  // Generic fallback if valid URL
  return {
    platformId: 'direct',
    platformName: 'Web Media Link',
    iconName: 'Link',
    isSupported: true,
    cleanUrl: parsed.href,
  };
}
