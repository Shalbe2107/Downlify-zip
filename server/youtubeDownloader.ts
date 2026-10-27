import { MediaFormat } from './types';

interface SavenowInitResponse {
  success: boolean;
  id?: string;
  progress_url?: string;
  download_url?: string;
  text?: string;
  error?: string;
}

interface SavenowProgressResponse {
  success: number | boolean;
  progress: number;
  download_url?: string;
  text?: string;
  error?: string;
}

const PRIMARY_DOMAINS = ['p.savenow.to', 'p.lbserver.xyz'];

export async function resolveYoutubeDownloadUrl(
  youtubeUrl: string,
  format: string = '1080'
): Promise<string> {
  let lastError = '';

  for (const domain of PRIMARY_DOMAINS) {
    try {
      const endpoint = `https://${domain}/api/v2/download?button=1&format=${encodeURIComponent(
        format
      )}&url=${encodeURIComponent(youtubeUrl)}`;

      const res = await fetch(endpoint, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        lastError = `Server ${domain} responded with HTTP ${res.status}`;
        continue;
      }

      const initData: SavenowInitResponse = await res.json();

      if (initData.download_url) {
        return initData.download_url;
      }

      if (!initData.progress_url) {
        lastError = `No progress endpoint returned by ${domain}`;
        continue;
      }

      // Poll progress URL up to 30 times (~35 seconds max)
      const progressEndpoint = initData.progress_url;
      for (let attempt = 0; attempt < 30; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const progRes = await fetch(progressEndpoint, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'application/json',
          },
        });

        if (!progRes.ok) continue;

        const progData: SavenowProgressResponse = await progRes.json();
        if (progData.download_url && progData.download_url.length > 5) {
          console.log(`[YouTube Resolver] Stream ready on attempt ${attempt + 1}:`, progData.download_url);
          return progData.download_url;
        }

        if (progData.error) {
          lastError = progData.error;
          break;
        }
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'Fetch error';
    }
  }

  throw new Error(
    lastError || 'Unable to prepare download stream for this video. Please try again or select another format.'
  );
}

export function buildYoutubeMediaFormats(
  youtubeUrl: string,
  videoId: string,
  videoTitle: string,
  thumbnail?: string
): MediaFormat[] {
  const safeTitle = (videoTitle || 'YouTube_Video').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

  const formats: MediaFormat[] = [
    {
      id: `yt-${videoId}-1080p`,
      type: 'video',
      label: '1080p Full HD (MP4)',
      extension: 'mp4',
      resolution: '1920x1080',
      quality: 'ultra',
      fileSizeFormatted: '~28-45 MB',
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=1080&filename=${encodeURIComponent(`${safeTitle}_1080p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Full High Definition video with synchronized AAC audio',
    },
    {
      id: `yt-${videoId}-720p`,
      type: 'video',
      label: '720p HD (MP4)',
      extension: 'mp4',
      resolution: '1280x720',
      quality: 'high',
      fileSizeFormatted: '~15-22 MB',
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=720&filename=${encodeURIComponent(`${safeTitle}_720p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Crisp 720p HD stream compatible with all mobile devices',
    },
    {
      id: `yt-${videoId}-480p`,
      type: 'video',
      label: '480p Standard (MP4)',
      extension: 'mp4',
      resolution: '854x480',
      quality: 'medium',
      fileSizeFormatted: '~8-12 MB',
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=480&filename=${encodeURIComponent(`${safeTitle}_480p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Data-saver standard resolution',
    },
    {
      id: `yt-${videoId}-360p`,
      type: 'video',
      label: '360p Mobile (MP4)',
      extension: 'mp4',
      resolution: '640x360',
      quality: 'standard',
      fileSizeFormatted: '~4-6 MB',
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=360&filename=${encodeURIComponent(`${safeTitle}_360p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Lightweight mobile video format',
    },
    {
      id: `yt-${videoId}-mp3-320`,
      type: 'audio',
      label: '320 kbps Studio Audio (MP3)',
      extension: 'mp3',
      bitrate: '320 kbps',
      quality: 'ultra',
      fileSizeFormatted: '~4-8 MB',
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=mp3&filename=${encodeURIComponent(`${safeTitle}.mp3`)}`,
      isDirectDownload: true,
      notes: 'HQ MP3 audio extraction, ideal for music tracks and podcasts',
    },
    {
      id: `yt-${videoId}-m4a`,
      type: 'audio',
      label: 'Lossless AAC Audio (M4A)',
      extension: 'm4a',
      bitrate: '256 kbps',
      quality: 'high',
      fileSizeFormatted: '~3-6 MB',
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=m4a&filename=${encodeURIComponent(`${safeTitle}.m4a`)}`,
      isDirectDownload: true,
      notes: 'Native Apple & Android audio stream',
    },
  ];

  if (thumbnail) {
    const maxresThumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    formats.push({
      id: `yt-${videoId}-thumb-max`,
      type: 'image',
      label: 'Maximum Resolution Thumbnail (JPG)',
      extension: 'jpg',
      resolution: '1280x720',
      quality: 'ultra',
      fileSizeFormatted: '~220 KB',
      downloadUrl: `/api/download?url=${encodeURIComponent(maxresThumb)}&filename=${encodeURIComponent(
        `${safeTitle}_thumbnail_1080p.jpg`
      )}`,
      isDirectDownload: true,
      notes: 'Original high-definition cover art',
    });
    formats.push({
      id: `yt-${videoId}-thumb-hq`,
      type: 'image',
      label: 'Standard HQ Thumbnail (JPG)',
      extension: 'jpg',
      resolution: '480x360',
      quality: 'high',
      fileSizeFormatted: '~85 KB',
      downloadUrl: `/api/download?url=${encodeURIComponent(thumbnail)}&filename=${encodeURIComponent(
        `${safeTitle}_thumbnail_hq.jpg`
      )}`,
      isDirectDownload: true,
    });
  }

  return formats;
}
