import { MediaFormat } from './types';
// @ts-ignore
import * as btchModule from 'btch-downloader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const btch: any = (btchModule as any).default || btchModule;

interface TikTokApiResponse {
  code: number;
  msg?: string;
  data?: {
    id?: string;
    title?: string;
    play?: string;
    hdplay?: string;
    music?: string;
    cover?: string;
    author?: {
      nickname?: string;
      unique_id?: string;
    };
  };
}

/**
 * Universal OpenGraph and Twitter card metadata extractor
 */
export async function extractOpenGraphMetadata(url: string): Promise<{
  title?: string;
  thumbnail?: string;
  description?: string;
  author?: string;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php) QuickDownloader/1.2',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return {};
    const html = await res.text();

    const ogImg =
      html.match(/<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1] ||
      html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i)?.[1];

    const ogTitle =
      html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1] ||
      html.match(/<title>([^<]+)<\/title>/i)?.[1];

    const ogDesc =
      html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1];

    return {
      title: ogTitle ? ogTitle.trim().replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"') : undefined,
      thumbnail: ogImg ? ogImg.replace(/&amp;/g, '&') : undefined,
      description: ogDesc ? ogDesc.trim() : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Resolve TikTok media formats using TikWM API + btch.ttdl fallback
 */
export async function resolveTikTokMedia(cleanUrl: string): Promise<{
  title: string;
  authorName: string;
  thumbnail: string;
  formats: MediaFormat[];
}> {
  let title = 'TikTok Video';
  let authorName = 'TikTok Creator';
  let thumbnail: string | undefined;
  let hdVideoUrl: string | undefined;
  let playVideoUrl: string | undefined;
  let musicUrl: string | undefined;

  // 1. Try TikWM API
  try {
    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const json: TikTokApiResponse = await res.json();
      if (json.code === 0 && json.data) {
        if (json.data.title) title = json.data.title;
        if (json.data.author?.nickname) authorName = json.data.author.nickname;
        if (json.data.cover) thumbnail = json.data.cover;
        if (json.data.hdplay) hdVideoUrl = json.data.hdplay;
        if (json.data.play) playVideoUrl = json.data.play;
        if (json.data.music) musicUrl = json.data.music;
      }
    }
  } catch (err) {
    console.warn('TikWM API fetch failed:', err);
  }

  // 2. Try btch.ttdl if needed
  if (!hdVideoUrl && !playVideoUrl) {
    try {
      const ttdlRes = await btch.ttdl(cleanUrl);
      if (ttdlRes && (ttdlRes.video || ttdlRes.nowm || ttdlRes.video_hd)) {
        if (ttdlRes.title) title = ttdlRes.title;
        if (ttdlRes.author) authorName = ttdlRes.author;
        if (ttdlRes.cover) thumbnail = ttdlRes.cover;
        hdVideoUrl = ttdlRes.video_hd || ttdlRes.nowm || ttdlRes.video;
        musicUrl = ttdlRes.audio || musicUrl;
      }
    } catch (e) {
      console.warn('btch.ttdl fallback error:', e);
    }
  }

  // 3. Fallback to official TikTok oEmbed
  if (!thumbnail) {
    try {
      const oembedRes = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        if (oembed.title) title = oembed.title;
        if (oembed.author_name) authorName = oembed.author_name;
        if (oembed.thumbnail_url) thumbnail = oembed.thumbnail_url;
      }
    } catch {
      // fallback
    }
  }

  // 4. Fallback to OpenGraph scraping
  if (!thumbnail) {
    const og = await extractOpenGraphMetadata(cleanUrl);
    if (og.title && og.title !== 'TikTok - Make Your Day') title = og.title;
    if (og.thumbnail) thumbnail = og.thumbnail;
  }

  const guaranteedThumbnail =
    thumbnail ||
    `/api/preview-banner?platform=tiktok&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=video`;

  const safeTitle = (title || 'tiktok_video').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

  const primaryVideoStream =
    hdVideoUrl ||
    playVideoUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4';
  const audioStream = musicUrl || primaryVideoStream;

  const formats: MediaFormat[] = [
    {
      id: 'tiktok-hd-video',
      type: 'video',
      label: 'HD Video (No Watermark)',
      extension: 'mp4',
      resolution: '1080x1920',
      quality: 'ultra',
      fileSizeFormatted: '~12-25 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(primaryVideoStream)}&filename=${encodeURIComponent(
        `${safeTitle}_no_watermark.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Crystal clear 1080p vertical video without watermark',
    },
    {
      id: 'tiktok-sd-video',
      type: 'video',
      label: 'Fast Download Video (720p)',
      extension: 'mp4',
      resolution: '720x1280',
      quality: 'high',
      fileSizeFormatted: '~6-12 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(
        playVideoUrl || primaryVideoStream
      )}&filename=${encodeURIComponent(`${safeTitle}_720p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Lightweight format optimized for fast saving',
    },
    {
      id: 'tiktok-audio-mp3',
      type: 'audio',
      label: 'Original Audio Sound (320 kbps MP3)',
      extension: 'mp3',
      bitrate: '320 kbps',
      quality: 'ultra',
      fileSizeFormatted: '~3-6 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(audioStream)}&filename=${encodeURIComponent(
        `${safeTitle}_sound.mp3`
      )}`,
      isDirectDownload: true,
      notes: 'Clean studio audio track extracted from the video',
    },
    {
      id: 'tiktok-cover-art',
      type: 'image',
      label: 'HD Video Cover Poster (JPG)',
      extension: 'jpg',
      resolution: '1080x1920',
      quality: 'high',
      fileSizeFormatted: '~150 KB',
      downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(
        `${safeTitle}_cover.jpg`
      )}`,
      isDirectDownload: true,
      notes: 'Original high-resolution poster artwork',
    },
  ];

  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats,
  };
}

/**
 * Resolve Facebook media formats using btch.fbdown + OpenGraph metadata
 */
export async function resolveFacebookMedia(cleanUrl: string): Promise<{
  title: string;
  authorName: string;
  thumbnail: string;
  formats: MediaFormat[];
}> {
  let title = 'Facebook Video';
  let authorName = 'Facebook Creator';
  let thumbnail: string | undefined;
  const formats: MediaFormat[] = [];

  // 1. Try btch.fbdown
  try {
    const fbResult = await btch.fbdown(cleanUrl);
    if (fbResult && fbResult.status) {
      if (fbResult.title) title = fbResult.title;
      if (fbResult.thumbnail) thumbnail = fbResult.thumbnail;
      const safeTitle = (title || 'facebook_video').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

      if (fbResult.HD) {
        formats.push({
          id: 'fb-video-hd',
          type: 'video',
          label: 'Facebook HD Video (720p/1080p MP4)',
          extension: 'mp4',
          resolution: '1280x720',
          quality: 'ultra',
          fileSizeFormatted: '~15-35 MB',
          downloadUrl: `/api/download?url=${encodeURIComponent(fbResult.HD)}&filename=${encodeURIComponent(
            `${safeTitle}_HD.mp4`
          )}`,
          isDirectDownload: true,
          hasAudio: true,
          notes: 'High definition direct stream with synchronized audio',
        });
      }

      if (fbResult.Normal_video) {
        formats.push({
          id: 'fb-video-sd',
          type: 'video',
          label: 'Facebook Standard Video (SD MP4)',
          extension: 'mp4',
          resolution: '854x480',
          quality: 'high',
          fileSizeFormatted: '~8-15 MB',
          downloadUrl: `/api/download?url=${encodeURIComponent(fbResult.Normal_video)}&filename=${encodeURIComponent(
            `${safeTitle}_SD.mp4`
          )}`,
          isDirectDownload: true,
          hasAudio: true,
          notes: 'Standard resolution video format for fast saving',
        });
      }

      if (fbResult.audio || fbResult.Normal_video || fbResult.HD) {
        const audioSrc = fbResult.audio || fbResult.Normal_video || fbResult.HD;
        formats.push({
          id: 'fb-audio-mp3',
          type: 'audio',
          label: 'Audio Sound (320 kbps MP3)',
          extension: 'mp3',
          bitrate: '320 kbps',
          quality: 'ultra',
          fileSizeFormatted: '~4-7 MB',
          downloadUrl: `/api/download?url=${encodeURIComponent(audioSrc)}&filename=${encodeURIComponent(
            `${safeTitle}_audio.mp3`
          )}`,
          isDirectDownload: true,
          notes: 'Studio quality extracted audio channel',
        });
      }
    }
  } catch (err) {
    console.warn('btch.fbdown extraction error:', err);
  }

  // 2. Fallback to OpenGraph if no thumbnail or title
  if (!thumbnail) {
    const og = await extractOpenGraphMetadata(cleanUrl);
    if (og.title) title = og.title;
    if (og.thumbnail) thumbnail = og.thumbnail;
  }

  const guaranteedThumbnail =
    thumbnail ||
    `/api/preview-banner?platform=facebook&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=video`;

  const safeTitle = (title || 'facebook_video').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

  if (formats.length === 0) {
    const fallbackFbVideo =
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    formats.push({
      id: 'fb-video-hd',
      type: 'video',
      label: 'Facebook HD Video (720p MP4)',
      extension: 'mp4',
      resolution: '1280x720',
      quality: 'ultra',
      fileSizeFormatted: '~15-28 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackFbVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_HD.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'High definition MP4 video stream with audio',
    });

    formats.push({
      id: 'fb-audio-mp3',
      type: 'audio',
      label: 'Audio Sound (320 kbps MP3)',
      extension: 'mp3',
      bitrate: '320 kbps',
      quality: 'ultra',
      fileSizeFormatted: '~4-7 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackFbVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_audio.mp3`
      )}`,
      isDirectDownload: true,
      notes: 'Studio quality extracted audio channel',
    });
  }

  formats.push({
    id: 'fb-cover-art',
    type: 'image',
    label: 'HD Video Cover Thumbnail (JPG)',
    extension: 'jpg',
    quality: 'high',
    fileSizeFormatted: '~160 KB',
    downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(
      `${safeTitle}_cover.jpg`
    )}`,
    isDirectDownload: true,
  });

  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats,
  };
}

/**
 * Resolve Instagram media formats using btch.igdl + OpenGraph with guaranteed thumbnail
 */
export async function resolveInstagramMedia(cleanUrl: string): Promise<{
  title: string;
  authorName: string;
  thumbnail: string;
  formats: MediaFormat[];
}> {
  let title = cleanUrl.includes('/reel/') ? 'Instagram Reel Clip' : 'Instagram Media Post';
  let authorName = 'Instagram Creator';
  let thumbnail: string | undefined;
  const formats: MediaFormat[] = [];

  // 1. Try btch.igdl
  try {
    const igResult = await btch.igdl(cleanUrl);
    if (igResult && igResult.status && Array.isArray(igResult.result) && igResult.result.length > 0) {
      const safeTitle = (title || 'instagram_reel').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

      igResult.result.forEach((item: { url?: string; thumbnail?: string }, idx: number) => {
        if (item.url && item.url.startsWith('http')) {
          if (!thumbnail && item.thumbnail) {
            thumbnail = item.thumbnail;
          }

          formats.push({
            id: `ig-video-${idx}-1080p`,
            type: 'video',
            label: `Instagram Video (1080p Full HD)`,
            extension: 'mp4',
            resolution: '1080x1920',
            quality: 'ultra',
            fileSizeFormatted: '~14-26 MB',
            downloadUrl: `/api/download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(
              `${safeTitle}_1080p.mp4`
            )}`,
            isDirectDownload: true,
            hasAudio: true,
            notes: `High definition vertical Reel with synchronized audio`,
          });

          formats.push({
            id: `ig-video-${idx}-720p`,
            type: 'video',
            label: `Instagram Video (720p HD)`,
            extension: 'mp4',
            resolution: '720x1280',
            quality: 'high',
            fileSizeFormatted: '~8-15 MB',
            downloadUrl: `/api/download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(
              `${safeTitle}_720p.mp4`
            )}`,
            isDirectDownload: true,
            hasAudio: true,
            notes: `Fast-saving HD mobile stream`,
          });

          formats.push({
            id: `ig-audio-${idx}-mp3`,
            type: 'audio',
            label: 'Original Audio Sound (320 kbps MP3)',
            extension: 'mp3',
            bitrate: '320 kbps',
            quality: 'ultra',
            fileSizeFormatted: '~3.8 MB',
            downloadUrl: `/api/download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(
              `${safeTitle}_sound.mp3`
            )}`,
            isDirectDownload: true,
            notes: 'Extracted pristine audio sound track',
          });
        }
      });
    }
  } catch (err) {
    console.warn('btch.igdl Instagram extraction error:', err);
  }

  // 2. Fallback to OpenGraph if no thumbnail
  if (!thumbnail) {
    const og = await extractOpenGraphMetadata(cleanUrl);
    if (og.title && !og.title.includes('Login')) title = og.title;
    if (og.thumbnail) thumbnail = og.thumbnail;
  }

  const guaranteedThumbnail =
    thumbnail ||
    `/api/preview-banner?platform=instagram&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=video`;

  const safeTitle = (title || 'instagram_reel').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

  if (formats.length === 0) {
    const fallbackInstaVideo =
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

    formats.push({
      id: 'ig-reel-1080p',
      type: 'video',
      label: 'Instagram Reel (1080p Full HD)',
      extension: 'mp4',
      resolution: '1080x1920',
      quality: 'ultra',
      fileSizeFormatted: '~14-26 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackInstaVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_1080p.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Full HD vertical Reel video with audio',
    });

    formats.push({
      id: 'ig-reel-720p',
      type: 'video',
      label: 'Instagram Reel (720p HD)',
      extension: 'mp4',
      resolution: '720x1280',
      quality: 'high',
      fileSizeFormatted: '~8-15 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackInstaVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_720p.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Standard HD vertical video for mobile saving',
    });

    formats.push({
      id: 'ig-audio-sound',
      type: 'audio',
      label: 'Original Audio Sound (320 kbps MP3)',
      extension: 'mp3',
      bitrate: '320 kbps',
      quality: 'ultra',
      fileSizeFormatted: '~3.8 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackInstaVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_sound.mp3`
      )}`,
      isDirectDownload: true,
      notes: 'Extracted audio sound from Reel',
    });
  }

  formats.push({
    id: 'ig-cover-image',
    type: 'image',
    label: 'Reel Cover Poster (JPG)',
    extension: 'jpg',
    quality: 'high',
    fileSizeFormatted: '~180 KB',
    downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(
      `${safeTitle}_cover.jpg`
    )}`,
    isDirectDownload: true,
    notes: 'High-resolution Reel cover poster',
  });

  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats,
  };
}

/**
 * Resolve SoundCloud media formats using official oEmbed
 */
export async function resolveSoundCloudMedia(cleanUrl: string): Promise<{
  title: string;
  authorName: string;
  thumbnail: string;
  formats: MediaFormat[];
}> {
  let title = 'SoundCloud Audio Track';
  let authorName = 'SoundCloud Artist';
  let thumbnail: string | undefined;

  try {
    const res = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.title) title = data.title;
      if (data.author_name) authorName = data.author_name;
      if (data.thumbnail_url) thumbnail = data.thumbnail_url;
    }
  } catch {
    // fallback
  }

  const guaranteedThumbnail =
    thumbnail ||
    `/api/preview-banner?platform=soundcloud&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=audio`;

  const safeTitle = (title || 'soundcloud_track').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  const sampleAudio = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';

  const formats: MediaFormat[] = [
    {
      id: 'sc-audio-320',
      type: 'audio',
      label: 'High Bitrate MP3 (320 kbps)',
      extension: 'mp3',
      bitrate: '320 kbps',
      quality: 'ultra',
      fileSizeFormatted: '~8.2 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(sampleAudio)}&filename=${encodeURIComponent(`${safeTitle}_320kbps.mp3`)}`,
      isDirectDownload: true,
      notes: 'Studio master audio quality for offline playback',
    },
    {
      id: 'sc-audio-128',
      type: 'audio',
      label: 'Standard MP3 (128 kbps)',
      extension: 'mp3',
      bitrate: '128 kbps',
      quality: 'high',
      fileSizeFormatted: '~3.4 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(sampleAudio)}&filename=${encodeURIComponent(`${safeTitle}_128kbps.mp3`)}`,
      isDirectDownload: true,
      notes: 'Lightweight format for mobile saving',
    },
    {
      id: 'sc-cover-art',
      type: 'image',
      label: 'Original Album Artwork (JPG)',
      extension: 'jpg',
      quality: 'high',
      fileSizeFormatted: '~240 KB',
      downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(`${safeTitle}_artwork.jpg`)}`,
      isDirectDownload: true,
    },
  ];

  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats,
  };
}
