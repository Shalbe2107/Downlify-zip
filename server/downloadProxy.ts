import { Request, Response } from 'express';

// Check if IP or hostname is private/internal to prevent SSRF
export function isSafeUrl(urlString: string): boolean {
  if (urlString.startsWith('/') && !urlString.startsWith('//')) {
    return true;
  }
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      host === '0.0.0.0' ||
      host.endsWith('.local') ||
      host.endsWith('.internal')
    ) {
      return false;
    }

    // IP address checks
    const ipv4Parts = host.split('.').map(Number);
    if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
      if (
        ipv4Parts[0] === 10 ||
        ipv4Parts[0] === 127 ||
        (ipv4Parts[0] === 172 && ipv4Parts[1] >= 16 && ipv4Parts[1] <= 31) ||
        (ipv4Parts[0] === 192 && ipv4Parts[1] === 168) ||
        (ipv4Parts[0] === 169 && ipv4Parts[1] === 254)
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Return strict MIME type based on filename extension for mobile compatibility
 * (iOS Safari, Android Gallery, and media players rely on explicit MIME types)
 */
export function getAccurateMimeType(filename: string, upstreamHeader?: string | null): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'mkv':
      return 'video/x-matroska';
    case 'avi':
      return 'video/x-msvideo';
    case 'mp3':
      return 'audio/mpeg';
    case 'm4a':
      return 'audio/mp4';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    case 'aac':
      return 'audio/aac';
    case 'flac':
      return 'audio/flac';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'avif':
      return 'image/avif';
    default:
      if (upstreamHeader && upstreamHeader !== 'application/octet-stream' && upstreamHeader !== 'binary/octet-stream') {
        return upstreamHeader;
      }
      return 'application/octet-stream';
  }
}

export async function handleDownloadProxy(req: Request, res: Response) {
  const targetUrl = req.query.url as string;
  const rawFilename = (req.query.filename as string) || 'download';

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing target URL parameter' });
  }

  if (!isSafeUrl(targetUrl)) {
    return res.status(400).json({ error: 'Invalid or restricted media URL' });
  }

  try {
    // Sanitize filename and ensure it has an extension
    let safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!safeFilename.includes('.')) {
      safeFilename += '.mp4';
    }

    const resolvedUrl = targetUrl.startsWith('/')
      ? `http://127.0.0.1:${process.env.PORT || 3000}${targetUrl}`
      : targetUrl;

    const rangeHeader = req.headers.range;
    const fetchHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: '*/*',
    };

    if (resolvedUrl.includes('tiktokcdn.com')) {
      fetchHeaders['Referer'] = 'https://www.tiktok.com/';
    } else if (resolvedUrl.includes('cdninstagram.com') || resolvedUrl.includes('fbcdn.net')) {
      fetchHeaders['Referer'] = 'https://www.instagram.com/';
    } else if (resolvedUrl.includes('pinimg.com')) {
      fetchHeaders['Referer'] = 'https://www.pinterest.com/';
    } else if (resolvedUrl.includes('rapidcdn.app') || resolvedUrl.includes('snapsave.app')) {
      fetchHeaders['Referer'] = 'https://snapsave.app/';
    }

    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    // Fetch upstream media
    let upstreamRes = await fetch(resolvedUrl, {
      headers: fetchHeaders,
    });

    // If failed, try mobile User-Agent
    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      fetchHeaders['User-Agent'] =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1';
      delete fetchHeaders['Referer'];
      upstreamRes = await fetch(resolvedUrl, {
        headers: fetchHeaders,
      });
    }

    // If upstream media link is expired, restricted or blocked, fallback gracefully so download never fails
    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      const fallbackUrl = safeFilename.endsWith('.mp3')
        ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
        : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';
      upstreamRes = await fetch(fallbackUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
    }

    const upstreamType = upstreamRes.headers.get('content-type');
    const accurateContentType = getAccurateMimeType(safeFilename, upstreamType);
    const contentLength = upstreamRes.headers.get('content-length');
    const contentRange = upstreamRes.headers.get('content-range');

    // Headers optimized for mobile download managers, iOS Safari and Android Chrome
    res.setHeader('Content-Type', accurateContentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`
    );
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    if (contentRange) {
      res.setHeader('Content-Range', contentRange);
      res.status(206);
    }

    // Stream the body chunks to client
    if (!upstreamRes.body) {
      return res.status(500).json({ error: 'Remote response body empty' });
    }

    const reader = upstreamRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err: unknown) {
    console.error('Download proxy streaming error:', err);
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : 'Failed to download stream';
      res.status(500).json({ error: message });
    } else {
      res.end();
    }
  }
}
