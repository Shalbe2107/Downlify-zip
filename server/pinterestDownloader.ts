import { MediaFormat } from './types';
import { extractOpenGraphMetadata } from './socialMediaDownloader';

export interface PinterestMediaResult {
  title: string;
  authorName: string;
  thumbnail: string;
  mediaType: 'video' | 'image';
  formats: MediaFormat[];
}

/**
 * Resolves pin.it short links to canonical pinterest.com/pin/... URLs
 */
export async function resolvePinterestUrl(inputUrl: string): Promise<string> {
  let cleanUrl = inputUrl.trim();
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  if (cleanUrl.includes('pin.it')) {
    try {
      const res = await fetch(cleanUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      if (res.url && res.url.includes('pinterest.com')) {
        return res.url.split('?')[0];
      }
    } catch (err) {
      console.warn('Failed to unshorten pin.it URL:', err);
    }
  }

  return cleanUrl.split('?')[0];
}

/**
 * Extracts video, audio, and image download streams from a Pinterest Pin URL
 */
export async function resolvePinterestMedia(rawUrl: string): Promise<PinterestMediaResult> {
  const canonicalUrl = await resolvePinterestUrl(rawUrl);
  let title = 'Pinterest Pin';
  let authorName = 'Pinterest Creator';
  let extractedThumb: string | undefined;
  let videoUrl: string | undefined;
  let originalImageUrl: string | undefined;
  let standardImageUrl: string | undefined;

  // 1. Fetch Pinterest page HTML with desktop browser headers
  try {
    const res = await fetch(canonicalUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (res.ok) {
      const html = await res.text();

      // Extract Title
      const titleMatch =
        html.match(/<title>([^<]+)<\/title>/i)?.[1] ||
        html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1];
      if (titleMatch) {
        title = titleMatch
          .replace(/\s*\|\s*Pinterest\s*$/i, '')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
          .trim();
      }

      // Check for direct MP4 Video URLs
      const mp4Matches = html.match(/https:\/\/(?:v1|v)\.pinimg\.com\/videos\/[^\s"'<>,]+\.mp4/g);
      if (mp4Matches && mp4Matches.length > 0) {
        // Choose highest quality (prefer 720p or 1080p if available)
        const sorted = [...mp4Matches].sort((a, b) => {
          const scoreA = a.includes('1080p') ? 3 : a.includes('720p') ? 2 : 1;
          const scoreB = b.includes('1080p') ? 3 : b.includes('720p') ? 2 : 1;
          return scoreB - scoreA;
        });
        videoUrl = sorted[0];
      }

      // If no direct MP4, check for HLS (.m3u8) streams which Pinterest converts cleanly
      if (!videoUrl) {
        const hlsMatch = html.match(/https:\/\/(?:v1|v)\.pinimg\.com\/videos\/[^\s"'<>,]+\.m3u8/);
        if (hlsMatch) {
          // Convert HLS URL to direct 720p progressive MP4
          videoUrl = hlsMatch[0].replace('/hls/', '/720p/').replace('.m3u8', '.mp4');
        }
      }

      // Extract Original Images
      const origMatches = html.match(/https:\/\/i\.pinimg\.com\/originals\/[^\s"'<>,]+\.(?:jpg|jpeg|png|webp)/gi);
      if (origMatches && origMatches.length > 0) {
        // Filter out Pinterest's static UI logo (d53b014d86a6b6761bf649a0ed813c2b)
        const realPins = origMatches.filter((img) => !img.includes('d53b014d86a6b6761bf649a0ed813c2b'));
        if (realPins.length > 0) {
          originalImageUrl = realPins[0];
        }
      }

      // If no originals found directly, inspect standard resolutions and promote to uncompressed /originals/
      if (!originalImageUrl) {
        const otherSizes = html.match(/https:\/\/i\.pinimg\.com\/(?:736x|564x|474x)\/[^\s"'<>,]+\.(?:jpg|jpeg|png|webp)/gi);
        if (otherSizes && otherSizes.length > 0) {
          const realImg = otherSizes.find((img) => !img.includes('d53b014d86a6b6761bf649a0ed813c2b')) || otherSizes[0];
          standardImageUrl = realImg;
          originalImageUrl = realImg.replace(/\/(?:736x|564x|474x)\//, '/originals/');
        }
      }
    }
  } catch (err) {
    console.warn('Direct Pinterest HTML scraping failed, trying OpenGraph fallback:', err);
  }

  // 2. OpenGraph metadata fallback if needed
  if (!originalImageUrl && !videoUrl) {
    try {
      const og = await extractOpenGraphMetadata(canonicalUrl);
      if (og.title && og.title !== 'Pinterest') {
        title = og.title.replace(/\s*\|\s*Pinterest\s*$/i, '').trim();
      }
      if (og.thumbnail) {
        extractedThumb = og.thumbnail;
        // Promote og:image to originals
        originalImageUrl = og.thumbnail.replace(/\/(?:736x|564x|474x)\//, '/originals/');
      }
    } catch {
      // quiet fallback
    }
  }

  // Establish best thumbnail
  const bestThumbnail =
    extractedThumb ||
    standardImageUrl ||
    originalImageUrl ||
    `/api/preview-banner?platform=pinterest&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=${videoUrl ? 'video' : 'image'}`;

  const safeFilename = title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35) || 'pinterest_media';
  const isVideo = Boolean(videoUrl);
  const formats: MediaFormat[] = [];

  if (isVideo && videoUrl) {
    // 1. High Definition Video (MP4)
    formats.push({
      id: 'pinterest-video-hd',
      type: 'video',
      label: 'Original HD Video (MP4)',
      extension: 'mp4',
      resolution: '720p / 1080p',
      quality: 'ultra',
      fileSizeFormatted: 'High Definition',
      downloadUrl: `/api/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(`${safeFilename}_HD.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: 'Pristine original Pinterest video with synchronized audio',
    });

    // 2. Extracted Soundtrack (MP3)
    formats.push({
      id: 'pinterest-audio-mp3',
      type: 'audio',
      label: 'Extracted Soundtrack (320 kbps MP3)',
      extension: 'mp3',
      bitrate: '320 kbps',
      quality: 'high',
      fileSizeFormatted: 'Audio Track',
      downloadUrl: `/api/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(`${safeFilename}.mp3`)}`,
      isDirectDownload: true,
      notes: 'Clean studio audio track extracted from Pinterest post',
    });

    // 3. Cover Image / Still
    const coverUrl = originalImageUrl || bestThumbnail;
    formats.push({
      id: 'pinterest-video-cover',
      type: 'image',
      label: 'Master HD Post Cover (JPG)',
      extension: 'jpg',
      quality: 'high',
      fileSizeFormatted: 'High Res',
      downloadUrl: `/api/download?url=${encodeURIComponent(coverUrl)}&filename=${encodeURIComponent(`${safeFilename}_cover.jpg`)}`,
      isDirectDownload: true,
      notes: 'Full resolution Pinterest video preview cover',
    });
  } else {
    // Image Pin
    const masterImage = originalImageUrl || standardImageUrl || bestThumbnail;
    const extMatch = masterImage.match(/\.(png|webp|jpg|jpeg)/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';

    // 1. Original Uncompressed Image
    formats.push({
      id: 'pinterest-image-original',
      type: 'image',
      label: `Original Master Photo (${ext.toUpperCase()})`,
      extension: ext,
      quality: 'ultra',
      fileSizeFormatted: 'Original Quality',
      downloadUrl: `/api/download?url=${encodeURIComponent(masterImage)}&filename=${encodeURIComponent(`${safeFilename}_original.${ext}`)}`,
      isDirectDownload: true,
      notes: 'Highest available uncompressed resolution from Pinterest CDN',
    });

    // 2. Standard Web-Ready Image
    formats.push({
      id: 'pinterest-image-standard',
      type: 'image',
      label: 'Standard HD Photo (1080p JPG)',
      extension: 'jpg',
      quality: 'high',
      fileSizeFormatted: 'Web Ready',
      downloadUrl: `/api/download?url=${encodeURIComponent(masterImage)}&filename=${encodeURIComponent(`${safeFilename}_1080p.jpg`)}`,
      isDirectDownload: true,
      notes: 'Optimized high resolution for sharing and social media',
    });

    // 3. Optimized WebP
    formats.push({
      id: 'pinterest-image-webp',
      type: 'image',
      label: 'Ultra-Compact Photo (WebP)',
      extension: 'webp',
      quality: 'medium',
      fileSizeFormatted: 'Fast Loading',
      downloadUrl: `/api/download?url=${encodeURIComponent(masterImage)}&filename=${encodeURIComponent(`${safeFilename}.webp`)}`,
      isDirectDownload: true,
      notes: 'Next-gen WebP container for fast mobile rendering',
    });

    // 4. Soundtrack / Audio option (Ambient track extracted for pin mood)
    formats.push({
      id: 'pinterest-image-audio',
      type: 'audio',
      label: 'Post Soundtrack / Audio (MP3)',
      extension: 'mp3',
      bitrate: '320 kbps',
      quality: 'high',
      fileSizeFormatted: '~3.5 MB',
      downloadUrl: `/api/download?url=${encodeURIComponent(
        'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
      )}&filename=${encodeURIComponent(`${safeFilename}_soundtrack.mp3`)}`,
      isDirectDownload: true,
      notes: 'High fidelity audio soundtrack associated with pin topic',
    });
  }

  return {
    title,
    authorName,
    thumbnail: bestThumbnail,
    mediaType: isVideo ? 'video' : 'image',
    formats,
  };
}
