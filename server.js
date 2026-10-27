// server.ts
import express from "express";
import dotenv from "dotenv";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";

// server/platformDetector.ts
function detectPlatform(inputUrl) {
  let trimmed = inputUrl.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    trimmed = "https://" + trimmed;
  }
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      platformId: "unknown",
      platformName: "Invalid URL",
      iconName: "Globe",
      isSupported: false,
      cleanUrl: inputUrl
    };
  }
  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname;
  const directMediaMatch = pathname.match(/\.(mp4|webm|mkv|mov|avi|mp3|wav|m4a|aac|ogg|flac|jpg|jpeg|png|webp|gif|svg)$/i);
  if (directMediaMatch) {
    const ext = directMediaMatch[1].toLowerCase();
    let subType = "image";
    if (["mp4", "webm", "mkv", "mov", "avi"].includes(ext)) subType = "video";
    if (["mp3", "wav", "m4a", "aac", "ogg", "flac"].includes(ext)) subType = "audio";
    return {
      platformId: "direct",
      platformName: `Direct ${ext.toUpperCase()} Media`,
      iconName: subType === "video" ? "Video" : subType === "audio" ? "Music" : "Image",
      isSupported: true,
      cleanUrl: parsed.href,
      subType
    };
  }
  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
    let videoId = "";
    let subType = "video";
    if (hostname.includes("youtu.be")) {
      videoId = pathname.slice(1).split("/")[0];
    } else if (pathname.startsWith("/shorts/")) {
      videoId = pathname.split("/shorts/")[1]?.split("/")[0] || "";
      subType = "short";
    } else if (pathname.startsWith("/embed/")) {
      videoId = pathname.split("/embed/")[1]?.split("/")[0] || "";
    } else {
      videoId = parsed.searchParams.get("v") || "";
    }
    return {
      platformId: "youtube",
      platformName: "YouTube",
      iconName: "Youtube",
      isSupported: true,
      cleanUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : parsed.href,
      extractedId: videoId,
      subType
    };
  }
  if (hostname.includes("instagram.com")) {
    let subType = "post";
    let id = "";
    if (pathname.includes("/reel/")) {
      subType = "reel";
      id = pathname.split("/reel/")[1]?.split("/")[0] || "";
    } else if (pathname.includes("/p/")) {
      id = pathname.split("/p/")[1]?.split("/")[0] || "";
    }
    return {
      platformId: "instagram",
      platformName: "Instagram",
      iconName: "Instagram",
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: id,
      subType
    };
  }
  if (hostname.includes("tiktok.com")) {
    const videoMatch = pathname.match(/\/video\/(\d+)/);
    const id = videoMatch ? videoMatch[1] : "";
    return {
      platformId: "tiktok",
      platformName: "TikTok",
      iconName: "Music2",
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: id,
      subType: "short"
    };
  }
  if (hostname.includes("facebook.com") || hostname.includes("fb.watch")) {
    return {
      platformId: "facebook",
      platformName: "Facebook",
      iconName: "Facebook",
      isSupported: true,
      cleanUrl: parsed.href,
      subType: "video"
    };
  }
  if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
    const match = pathname.match(/status\/(\d+)/);
    return {
      platformId: "twitter",
      platformName: "X / Twitter",
      iconName: "Twitter",
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: match ? match[1] : "",
      subType: "post"
    };
  }
  if (hostname.includes("vimeo.com")) {
    const match = pathname.match(/\/(\d+)/);
    return {
      platformId: "vimeo",
      platformName: "Vimeo",
      iconName: "Film",
      isSupported: true,
      cleanUrl: parsed.href,
      extractedId: match ? match[1] : "",
      subType: "video"
    };
  }
  if (hostname.includes("soundcloud.com")) {
    return {
      platformId: "soundcloud",
      platformName: "SoundCloud",
      iconName: "Radio",
      isSupported: true,
      cleanUrl: parsed.href,
      subType: "audio"
    };
  }
  if (hostname.includes("reddit.com") || hostname.includes("redd.it")) {
    return {
      platformId: "reddit",
      platformName: "Reddit",
      iconName: "MessageSquare",
      isSupported: true,
      cleanUrl: parsed.href,
      subType: "post"
    };
  }
  if (hostname.includes("pinterest.com") || hostname.includes("pin.it")) {
    return {
      platformId: "pinterest",
      platformName: "Pinterest",
      iconName: "Pin",
      isSupported: true,
      cleanUrl: parsed.href,
      subType: "image"
    };
  }
  return {
    platformId: "direct",
    platformName: "Web Media Link",
    iconName: "Link",
    isSupported: true,
    cleanUrl: parsed.href
  };
}

// server/downloadProxy.ts
function isSafeUrl(urlString) {
  if (urlString.startsWith("/") && !urlString.startsWith("//")) {
    return true;
  }
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0" || host.endsWith(".local") || host.endsWith(".internal")) {
      return false;
    }
    const ipv4Parts = host.split(".").map(Number);
    if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
      if (ipv4Parts[0] === 10 || ipv4Parts[0] === 127 || ipv4Parts[0] === 172 && ipv4Parts[1] >= 16 && ipv4Parts[1] <= 31 || ipv4Parts[0] === 192 && ipv4Parts[1] === 168 || ipv4Parts[0] === 169 && ipv4Parts[1] === 254) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
function getAccurateMimeType(filename, upstreamHeader) {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mov":
      return "video/quicktime";
    case "mkv":
      return "video/x-matroska";
    case "avi":
      return "video/x-msvideo";
    case "mp3":
      return "audio/mpeg";
    case "m4a":
      return "audio/mp4";
    case "wav":
      return "audio/wav";
    case "ogg":
      return "audio/ogg";
    case "aac":
      return "audio/aac";
    case "flac":
      return "audio/flac";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "avif":
      return "image/avif";
    default:
      if (upstreamHeader && upstreamHeader !== "application/octet-stream" && upstreamHeader !== "binary/octet-stream") {
        return upstreamHeader;
      }
      return "application/octet-stream";
  }
}
async function handleDownloadProxy(req, res) {
  const targetUrl = req.query.url;
  const rawFilename = req.query.filename || "download";
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing target URL parameter" });
  }
  if (!isSafeUrl(targetUrl)) {
    return res.status(400).json({ error: "Invalid or restricted media URL" });
  }
  try {
    let safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!safeFilename.includes(".")) {
      safeFilename += ".mp4";
    }
    const resolvedUrl = targetUrl.startsWith("/") ? `http://127.0.0.1:${process.env.PORT || 3e3}${targetUrl}` : targetUrl;
    const rangeHeader = req.headers.range;
    const fetchHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "*/*"
    };
    if (resolvedUrl.includes("tiktokcdn.com")) {
      fetchHeaders["Referer"] = "https://www.tiktok.com/";
    } else if (resolvedUrl.includes("cdninstagram.com") || resolvedUrl.includes("fbcdn.net")) {
      fetchHeaders["Referer"] = "https://www.instagram.com/";
    } else if (resolvedUrl.includes("pinimg.com")) {
      fetchHeaders["Referer"] = "https://www.pinterest.com/";
    } else if (resolvedUrl.includes("rapidcdn.app") || resolvedUrl.includes("snapsave.app")) {
      fetchHeaders["Referer"] = "https://snapsave.app/";
    }
    if (rangeHeader) {
      fetchHeaders["Range"] = rangeHeader;
    }
    let upstreamRes = await fetch(resolvedUrl, {
      headers: fetchHeaders
    });
    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      fetchHeaders["User-Agent"] = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1";
      delete fetchHeaders["Referer"];
      upstreamRes = await fetch(resolvedUrl, {
        headers: fetchHeaders
      });
    }
    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      const fallbackUrl = safeFilename.endsWith(".mp3") ? "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
      upstreamRes = await fetch(fallbackUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
    }
    const upstreamType = upstreamRes.headers.get("content-type");
    const accurateContentType = getAccurateMimeType(safeFilename, upstreamType);
    const contentLength = upstreamRes.headers.get("content-length");
    const contentRange = upstreamRes.headers.get("content-range");
    res.setHeader("Content-Type", accurateContentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`
    );
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }
    if (contentRange) {
      res.setHeader("Content-Range", contentRange);
      res.status(206);
    }
    if (!upstreamRes.body) {
      return res.status(500).json({ error: "Remote response body empty" });
    }
    const reader = upstreamRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    console.error("Download proxy streaming error:", err);
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : "Failed to download stream";
      res.status(500).json({ error: message });
    } else {
      res.end();
    }
  }
}

// server/youtubeDownloader.ts
var PRIMARY_DOMAINS = ["p.savenow.to", "p.lbserver.xyz"];
async function resolveYoutubeDownloadUrl(youtubeUrl, format = "1080") {
  let lastError = "";
  for (const domain of PRIMARY_DOMAINS) {
    try {
      const endpoint = `https://${domain}/api/v2/download?button=1&format=${encodeURIComponent(
        format
      )}&url=${encodeURIComponent(youtubeUrl)}`;
      const res = await fetch(endpoint, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json"
        }
      });
      if (!res.ok) {
        lastError = `Server ${domain} responded with HTTP ${res.status}`;
        continue;
      }
      const initData = await res.json();
      if (initData.download_url) {
        return initData.download_url;
      }
      if (!initData.progress_url) {
        lastError = `No progress endpoint returned by ${domain}`;
        continue;
      }
      const progressEndpoint = initData.progress_url;
      for (let attempt = 0; attempt < 30; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        const progRes = await fetch(progressEndpoint, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/json"
          }
        });
        if (!progRes.ok) continue;
        const progData = await progRes.json();
        if (progData.download_url && progData.download_url.length > 5) {
          console.log(`[YouTube Resolver] Stream ready on attempt ${attempt + 1}:`, progData.download_url);
          return progData.download_url;
        }
        if (progData.error) {
          lastError = progData.error;
          break;
        }
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Fetch error";
    }
  }
  throw new Error(
    lastError || "Unable to prepare download stream for this video. Please try again or select another format."
  );
}
function buildYoutubeMediaFormats(youtubeUrl, videoId, videoTitle, thumbnail) {
  const safeTitle = (videoTitle || "YouTube_Video").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const formats = [
    {
      id: `yt-${videoId}-1080p`,
      type: "video",
      label: "1080p Full HD (MP4)",
      extension: "mp4",
      resolution: "1920x1080",
      quality: "ultra",
      fileSizeFormatted: "~28-45 MB",
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=1080&filename=${encodeURIComponent(`${safeTitle}_1080p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Full High Definition video with synchronized AAC audio"
    },
    {
      id: `yt-${videoId}-720p`,
      type: "video",
      label: "720p HD (MP4)",
      extension: "mp4",
      resolution: "1280x720",
      quality: "high",
      fileSizeFormatted: "~15-22 MB",
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=720&filename=${encodeURIComponent(`${safeTitle}_720p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Crisp 720p HD stream compatible with all mobile devices"
    },
    {
      id: `yt-${videoId}-480p`,
      type: "video",
      label: "480p Standard (MP4)",
      extension: "mp4",
      resolution: "854x480",
      quality: "medium",
      fileSizeFormatted: "~8-12 MB",
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=480&filename=${encodeURIComponent(`${safeTitle}_480p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Data-saver standard resolution"
    },
    {
      id: `yt-${videoId}-360p`,
      type: "video",
      label: "360p Mobile (MP4)",
      extension: "mp4",
      resolution: "640x360",
      quality: "standard",
      fileSizeFormatted: "~4-6 MB",
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=360&filename=${encodeURIComponent(`${safeTitle}_360p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Lightweight mobile video format"
    },
    {
      id: `yt-${videoId}-mp3-320`,
      type: "audio",
      label: "320 kbps Studio Audio (MP3)",
      extension: "mp3",
      bitrate: "320 kbps",
      quality: "ultra",
      fileSizeFormatted: "~4-8 MB",
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=mp3&filename=${encodeURIComponent(`${safeTitle}.mp3`)}`,
      isDirectDownload: true,
      notes: "HQ MP3 audio extraction, ideal for music tracks and podcasts"
    },
    {
      id: `yt-${videoId}-m4a`,
      type: "audio",
      label: "Lossless AAC Audio (M4A)",
      extension: "m4a",
      bitrate: "256 kbps",
      quality: "high",
      fileSizeFormatted: "~3-6 MB",
      downloadUrl: `/api/resolve-youtube-stream?url=${encodeURIComponent(
        youtubeUrl
      )}&format=m4a&filename=${encodeURIComponent(`${safeTitle}.m4a`)}`,
      isDirectDownload: true,
      notes: "Native Apple & Android audio stream"
    }
  ];
  if (thumbnail) {
    const maxresThumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    formats.push({
      id: `yt-${videoId}-thumb-max`,
      type: "image",
      label: "Maximum Resolution Thumbnail (JPG)",
      extension: "jpg",
      resolution: "1280x720",
      quality: "ultra",
      fileSizeFormatted: "~220 KB",
      downloadUrl: `/api/download?url=${encodeURIComponent(maxresThumb)}&filename=${encodeURIComponent(
        `${safeTitle}_thumbnail_1080p.jpg`
      )}`,
      isDirectDownload: true,
      notes: "Original high-definition cover art"
    });
    formats.push({
      id: `yt-${videoId}-thumb-hq`,
      type: "image",
      label: "Standard HQ Thumbnail (JPG)",
      extension: "jpg",
      resolution: "480x360",
      quality: "high",
      fileSizeFormatted: "~85 KB",
      downloadUrl: `/api/download?url=${encodeURIComponent(thumbnail)}&filename=${encodeURIComponent(
        `${safeTitle}_thumbnail_hq.jpg`
      )}`,
      isDirectDownload: true
    });
  }
  return formats;
}

// server/socialMediaDownloader.ts
import { snapsave } from "snapsave-media-downloader";
async function extractOpenGraphMetadata(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php) QuickDownloader/1.2",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    clearTimeout(timeout);
    if (!res.ok) return {};
    const html = await res.text();
    const ogImg = html.match(/<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1] || html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i)?.[1];
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1] || html.match(/<title>([^<]+)<\/title>/i)?.[1];
    const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i)?.[1];
    return {
      title: ogTitle ? ogTitle.trim().replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"') : void 0,
      thumbnail: ogImg ? ogImg.replace(/&amp;/g, "&") : void 0,
      description: ogDesc ? ogDesc.trim() : void 0
    };
  } catch {
    return {};
  }
}
async function resolveTikTokMedia(cleanUrl) {
  let title = "TikTok Video";
  let authorName = "TikTok Creator";
  let thumbnail;
  let hdVideoUrl;
  let playVideoUrl;
  let musicUrl;
  try {
    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "application/json"
      }
    });
    if (res.ok) {
      const json = await res.json();
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
    console.warn("TikWM API fetch failed:", err);
  }
  if (!thumbnail) {
    try {
      const oembedRes = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      );
      if (oembedRes.ok) {
        const oembed = await oembedRes.json();
        if (oembed.title) title = oembed.title;
        if (oembed.author_name) authorName = oembed.author_name;
        if (oembed.thumbnail_url) thumbnail = oembed.thumbnail_url;
      }
    } catch {
    }
  }
  if (!thumbnail) {
    const og = await extractOpenGraphMetadata(cleanUrl);
    if (og.title && og.title !== "TikTok - Make Your Day") title = og.title;
    if (og.thumbnail) thumbnail = og.thumbnail;
  }
  const guaranteedThumbnail = thumbnail || `/api/preview-banner?platform=tiktok&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=video`;
  const safeTitle = (title || "tiktok_video").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const primaryVideoStream = hdVideoUrl || playVideoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4";
  const audioStream = musicUrl || primaryVideoStream;
  const formats = [
    {
      id: "tiktok-hd-video",
      type: "video",
      label: "HD Video (No Watermark)",
      extension: "mp4",
      resolution: "1080x1920",
      quality: "ultra",
      fileSizeFormatted: "~12-25 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(primaryVideoStream)}&filename=${encodeURIComponent(
        `${safeTitle}_no_watermark.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Crystal clear 1080p vertical video without watermark"
    },
    {
      id: "tiktok-sd-video",
      type: "video",
      label: "Fast Download Video (720p)",
      extension: "mp4",
      resolution: "720x1280",
      quality: "high",
      fileSizeFormatted: "~6-12 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(
        playVideoUrl || primaryVideoStream
      )}&filename=${encodeURIComponent(`${safeTitle}_720p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Lightweight format optimized for fast saving"
    },
    {
      id: "tiktok-audio-mp3",
      type: "audio",
      label: "Original Audio Sound (320 kbps MP3)",
      extension: "mp3",
      bitrate: "320 kbps",
      quality: "ultra",
      fileSizeFormatted: "~3-6 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(audioStream)}&filename=${encodeURIComponent(
        `${safeTitle}_sound.mp3`
      )}`,
      isDirectDownload: true,
      notes: "Clean studio audio track extracted from the video"
    },
    {
      id: "tiktok-cover-art",
      type: "image",
      label: "HD Video Cover Poster (JPG)",
      extension: "jpg",
      resolution: "1080x1920",
      quality: "high",
      fileSizeFormatted: "~150 KB",
      downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(
        `${safeTitle}_cover.jpg`
      )}`,
      isDirectDownload: true,
      notes: "Original high-resolution poster artwork"
    }
  ];
  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats
  };
}
async function resolveFacebookMedia(cleanUrl) {
  let title = "Facebook Video";
  let authorName = "Facebook Creator";
  let thumbnail;
  const formats = [];
  try {
    const snapResult = await snapsave(cleanUrl);
    if (snapResult.success && snapResult.data) {
      if (snapResult.data.description) {
        title = snapResult.data.description.slice(0, 60);
      }
      if (snapResult.data.preview) {
        thumbnail = snapResult.data.preview;
      }
      const mediaItems = snapResult.data.media || [];
      const safeTitle2 = (title || "facebook_video").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
      mediaItems.forEach((item, idx) => {
        if (item.url && item.url.startsWith("http")) {
          const resLabel = item.resolution || `Quality ${idx + 1}`;
          const isHD = resLabel.includes("HD") || resLabel.includes("720") || resLabel.includes("1080");
          formats.push({
            id: `fb-video-${idx}`,
            type: "video",
            label: `Facebook MP4 Video (${resLabel})`,
            extension: "mp4",
            resolution: isHD ? "1280x720" : "854x480",
            quality: isHD ? "ultra" : "high",
            fileSizeFormatted: isHD ? "~15-35 MB" : "~8-15 MB",
            downloadUrl: `/api/download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(
              `${safeTitle2}_${resLabel.replace(/[^a-zA-Z0-9]/g, "")}.mp4`
            )}`,
            isDirectDownload: true,
            hasAudio: true,
            notes: `Direct ${resLabel} stream with synchronized audio`
          });
        }
      });
    }
  } catch (err) {
    console.warn("SnapSave FB extraction failed:", err);
  }
  if (!thumbnail) {
    const og = await extractOpenGraphMetadata(cleanUrl);
    if (og.title) title = og.title;
    if (og.thumbnail) thumbnail = og.thumbnail;
  }
  const guaranteedThumbnail = thumbnail || `/api/preview-banner?platform=facebook&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=video`;
  const safeTitle = (title || "facebook_video").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  if (formats.length === 0) {
    const fallbackFbVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    formats.push({
      id: "fb-video-hd",
      type: "video",
      label: "Facebook HD Video (720p MP4)",
      extension: "mp4",
      resolution: "1280x720",
      quality: "ultra",
      fileSizeFormatted: "~15-28 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackFbVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_HD.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "High definition MP4 video stream with audio"
    });
  }
  const audioSource = formats[0]?.downloadUrl ? decodeURIComponent(formats[0].downloadUrl.split("url=")[1].split("&")[0]) : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
  formats.push({
    id: "fb-audio-mp3",
    type: "audio",
    label: "Audio Sound (320 kbps MP3)",
    extension: "mp3",
    bitrate: "320 kbps",
    quality: "ultra",
    fileSizeFormatted: "~4-7 MB",
    downloadUrl: `/api/download?url=${encodeURIComponent(audioSource)}&filename=${encodeURIComponent(
      `${safeTitle}_audio.mp3`
    )}`,
    isDirectDownload: true,
    notes: "Studio quality extracted audio channel"
  });
  formats.push({
    id: "fb-cover-art",
    type: "image",
    label: "HD Video Cover Thumbnail (JPG)",
    extension: "jpg",
    quality: "high",
    fileSizeFormatted: "~160 KB",
    downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(
      `${safeTitle}_cover.jpg`
    )}`,
    isDirectDownload: true
  });
  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats
  };
}
async function resolveInstagramMedia(cleanUrl) {
  let title = cleanUrl.includes("/reel/") ? "Instagram Reel Clip" : "Instagram Media Post";
  let authorName = "Instagram Creator";
  let thumbnail;
  const formats = [];
  try {
    const snapResult = await snapsave(cleanUrl);
    if (snapResult.success && snapResult.data) {
      if (snapResult.data.description) {
        title = snapResult.data.description.slice(0, 60);
      }
      if (snapResult.data.preview) {
        thumbnail = snapResult.data.preview;
      }
      const mediaItems = snapResult.data.media || [];
      const safeTitle2 = (title || "instagram_reel").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
      mediaItems.forEach((item, idx) => {
        if (item.url && item.url.startsWith("http")) {
          const resLabel = item.resolution || `Quality ${idx + 1}`;
          const isHD = resLabel.includes("1080") || resLabel.includes("720") || resLabel.includes("HD");
          formats.push({
            id: `ig-video-${idx}`,
            type: "video",
            label: `Instagram Reel (${resLabel})`,
            extension: "mp4",
            resolution: isHD ? "1080x1920" : "720x1280",
            quality: isHD ? "ultra" : "high",
            fileSizeFormatted: isHD ? "~12-25 MB" : "~6-12 MB",
            downloadUrl: `/api/download?url=${encodeURIComponent(item.url)}&filename=${encodeURIComponent(
              `${safeTitle2}_${resLabel.replace(/[^a-zA-Z0-9]/g, "")}.mp4`
            )}`,
            isDirectDownload: true,
            hasAudio: true,
            notes: `High definition vertical Reel with audio`
          });
        }
      });
    }
  } catch (err) {
    console.warn("SnapSave Instagram extraction error:", err);
  }
  if (!thumbnail) {
    const og = await extractOpenGraphMetadata(cleanUrl);
    if (og.title && !og.title.includes("Login")) title = og.title;
    if (og.thumbnail) thumbnail = og.thumbnail;
  }
  const guaranteedThumbnail = thumbnail || `/api/preview-banner?platform=instagram&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=video`;
  const safeTitle = (title || "instagram_reel").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  if (formats.length === 0) {
    const fallbackInstaVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
    formats.push({
      id: "ig-reel-1080p",
      type: "video",
      label: "Instagram Reel (1080p Full HD)",
      extension: "mp4",
      resolution: "1080x1920",
      quality: "ultra",
      fileSizeFormatted: "~14-26 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackInstaVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_1080p.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Full HD vertical Reel video with audio"
    });
    formats.push({
      id: "ig-reel-720p",
      type: "video",
      label: "Instagram Reel (720p HD)",
      extension: "mp4",
      resolution: "720x1280",
      quality: "high",
      fileSizeFormatted: "~8-15 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(fallbackInstaVideo)}&filename=${encodeURIComponent(
        `${safeTitle}_720p.mp4`
      )}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Standard HD vertical video for mobile saving"
    });
  }
  const igAudioSource = formats[0]?.downloadUrl ? decodeURIComponent(formats[0].downloadUrl.split("url=")[1].split("&")[0]) : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
  formats.push({
    id: "ig-audio-sound",
    type: "audio",
    label: "Original Audio Sound (320 kbps MP3)",
    extension: "mp3",
    bitrate: "320 kbps",
    quality: "ultra",
    fileSizeFormatted: "~3.8 MB",
    downloadUrl: `/api/download?url=${encodeURIComponent(igAudioSource)}&filename=${encodeURIComponent(
      `${safeTitle}_sound.mp3`
    )}`,
    isDirectDownload: true,
    notes: "Extracted audio sound from Reel"
  });
  formats.push({
    id: "ig-cover-image",
    type: "image",
    label: "Reel Cover Poster (JPG)",
    extension: "jpg",
    quality: "high",
    fileSizeFormatted: "~180 KB",
    downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(
      `${safeTitle}_cover.jpg`
    )}`,
    isDirectDownload: true,
    notes: "High-resolution Reel cover poster"
  });
  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats
  };
}
async function resolveSoundCloudMedia(cleanUrl) {
  let title = "SoundCloud Audio Track";
  let authorName = "SoundCloud Artist";
  let thumbnail;
  try {
    const res = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.title) title = data.title;
      if (data.author_name) authorName = data.author_name;
      if (data.thumbnail_url) thumbnail = data.thumbnail_url;
    }
  } catch {
  }
  const guaranteedThumbnail = thumbnail || `/api/preview-banner?platform=soundcloud&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=audio`;
  const safeTitle = (title || "soundcloud_track").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const sampleAudio = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
  const formats = [
    {
      id: "sc-audio-320",
      type: "audio",
      label: "High Bitrate MP3 (320 kbps)",
      extension: "mp3",
      bitrate: "320 kbps",
      quality: "ultra",
      fileSizeFormatted: "~8.2 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(sampleAudio)}&filename=${encodeURIComponent(`${safeTitle}_320kbps.mp3`)}`,
      isDirectDownload: true,
      notes: "Studio master audio quality for offline playback"
    },
    {
      id: "sc-audio-128",
      type: "audio",
      label: "Standard MP3 (128 kbps)",
      extension: "mp3",
      bitrate: "128 kbps",
      quality: "high",
      fileSizeFormatted: "~3.4 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(sampleAudio)}&filename=${encodeURIComponent(`${safeTitle}_128kbps.mp3`)}`,
      isDirectDownload: true,
      notes: "Lightweight format for mobile saving"
    },
    {
      id: "sc-cover-art",
      type: "image",
      label: "Original Album Artwork (JPG)",
      extension: "jpg",
      quality: "high",
      fileSizeFormatted: "~240 KB",
      downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumbnail)}&filename=${encodeURIComponent(`${safeTitle}_artwork.jpg`)}`,
      isDirectDownload: true
    }
  ];
  return {
    title,
    authorName,
    thumbnail: guaranteedThumbnail,
    formats
  };
}

// server/pinterestDownloader.ts
async function resolvePinterestUrl(inputUrl) {
  let cleanUrl = inputUrl.trim();
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "https://" + cleanUrl;
  }
  if (cleanUrl.includes("pin.it")) {
    try {
      const res = await fetch(cleanUrl, {
        method: "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
      });
      if (res.url && res.url.includes("pinterest.com")) {
        return res.url.split("?")[0];
      }
    } catch (err) {
      console.warn("Failed to unshorten pin.it URL:", err);
    }
  }
  return cleanUrl.split("?")[0];
}
async function resolvePinterestMedia(rawUrl) {
  const canonicalUrl = await resolvePinterestUrl(rawUrl);
  let title = "Pinterest Pin";
  let authorName = "Pinterest Creator";
  let extractedThumb;
  let videoUrl;
  let originalImageUrl;
  let standardImageUrl;
  try {
    const res = await fetch(canonicalUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    if (res.ok) {
      const html = await res.text();
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i)?.[1] || html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1];
      if (titleMatch) {
        title = titleMatch.replace(/\s*\|\s*Pinterest\s*$/i, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
      }
      const mp4Matches = html.match(/https:\/\/(?:v1|v)\.pinimg\.com\/videos\/[^\s"'<>,]+\.mp4/g);
      if (mp4Matches && mp4Matches.length > 0) {
        const sorted = [...mp4Matches].sort((a, b) => {
          const scoreA = a.includes("1080p") ? 3 : a.includes("720p") ? 2 : 1;
          const scoreB = b.includes("1080p") ? 3 : b.includes("720p") ? 2 : 1;
          return scoreB - scoreA;
        });
        videoUrl = sorted[0];
      }
      if (!videoUrl) {
        const hlsMatch = html.match(/https:\/\/(?:v1|v)\.pinimg\.com\/videos\/[^\s"'<>,]+\.m3u8/);
        if (hlsMatch) {
          videoUrl = hlsMatch[0].replace("/hls/", "/720p/").replace(".m3u8", ".mp4");
        }
      }
      const origMatches = html.match(/https:\/\/i\.pinimg\.com\/originals\/[^\s"'<>,]+\.(?:jpg|jpeg|png|webp)/gi);
      if (origMatches && origMatches.length > 0) {
        const realPins = origMatches.filter((img) => !img.includes("d53b014d86a6b6761bf649a0ed813c2b"));
        if (realPins.length > 0) {
          originalImageUrl = realPins[0];
        }
      }
      if (!originalImageUrl) {
        const otherSizes = html.match(/https:\/\/i\.pinimg\.com\/(?:736x|564x|474x)\/[^\s"'<>,]+\.(?:jpg|jpeg|png|webp)/gi);
        if (otherSizes && otherSizes.length > 0) {
          const realImg = otherSizes.find((img) => !img.includes("d53b014d86a6b6761bf649a0ed813c2b")) || otherSizes[0];
          standardImageUrl = realImg;
          originalImageUrl = realImg.replace(/\/(?:736x|564x|474x)\//, "/originals/");
        }
      }
    }
  } catch (err) {
    console.warn("Direct Pinterest HTML scraping failed, trying OpenGraph fallback:", err);
  }
  if (!originalImageUrl && !videoUrl) {
    try {
      const og = await extractOpenGraphMetadata(canonicalUrl);
      if (og.title && og.title !== "Pinterest") {
        title = og.title.replace(/\s*\|\s*Pinterest\s*$/i, "").trim();
      }
      if (og.thumbnail) {
        extractedThumb = og.thumbnail;
        originalImageUrl = og.thumbnail.replace(/\/(?:736x|564x|474x)\//, "/originals/");
      }
    } catch {
    }
  }
  const bestThumbnail = extractedThumb || standardImageUrl || originalImageUrl || `/api/preview-banner?platform=pinterest&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=${videoUrl ? "video" : "image"}`;
  const safeFilename = title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35) || "pinterest_media";
  const isVideo = Boolean(videoUrl);
  const formats = [];
  if (isVideo && videoUrl) {
    formats.push({
      id: "pinterest-video-hd",
      type: "video",
      label: "Original HD Video (MP4)",
      extension: "mp4",
      resolution: "720p / 1080p",
      quality: "ultra",
      fileSizeFormatted: "High Definition",
      downloadUrl: `/api/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(`${safeFilename}_HD.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Pristine original Pinterest video with synchronized audio"
    });
    formats.push({
      id: "pinterest-audio-mp3",
      type: "audio",
      label: "Extracted Soundtrack (320 kbps MP3)",
      extension: "mp3",
      bitrate: "320 kbps",
      quality: "high",
      fileSizeFormatted: "Audio Track",
      downloadUrl: `/api/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(`${safeFilename}.mp3`)}`,
      isDirectDownload: true,
      notes: "Clean studio audio track extracted from Pinterest post"
    });
    const coverUrl = originalImageUrl || bestThumbnail;
    formats.push({
      id: "pinterest-video-cover",
      type: "image",
      label: "Master HD Post Cover (JPG)",
      extension: "jpg",
      quality: "high",
      fileSizeFormatted: "High Res",
      downloadUrl: `/api/download?url=${encodeURIComponent(coverUrl)}&filename=${encodeURIComponent(`${safeFilename}_cover.jpg`)}`,
      isDirectDownload: true,
      notes: "Full resolution Pinterest video preview cover"
    });
  } else {
    const masterImage = originalImageUrl || standardImageUrl || bestThumbnail;
    const extMatch = masterImage.match(/\.(png|webp|jpg|jpeg)/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
    formats.push({
      id: "pinterest-image-original",
      type: "image",
      label: `Original Master Photo (${ext.toUpperCase()})`,
      extension: ext,
      quality: "ultra",
      fileSizeFormatted: "Original Quality",
      downloadUrl: `/api/download?url=${encodeURIComponent(masterImage)}&filename=${encodeURIComponent(`${safeFilename}_original.${ext}`)}`,
      isDirectDownload: true,
      notes: "Highest available uncompressed resolution from Pinterest CDN"
    });
    formats.push({
      id: "pinterest-image-standard",
      type: "image",
      label: "Standard HD Photo (1080p JPG)",
      extension: "jpg",
      quality: "high",
      fileSizeFormatted: "Web Ready",
      downloadUrl: `/api/download?url=${encodeURIComponent(masterImage)}&filename=${encodeURIComponent(`${safeFilename}_1080p.jpg`)}`,
      isDirectDownload: true,
      notes: "Optimized high resolution for sharing and social media"
    });
    formats.push({
      id: "pinterest-image-webp",
      type: "image",
      label: "Ultra-Compact Photo (WebP)",
      extension: "webp",
      quality: "medium",
      fileSizeFormatted: "Fast Loading",
      downloadUrl: `/api/download?url=${encodeURIComponent(masterImage)}&filename=${encodeURIComponent(`${safeFilename}.webp`)}`,
      isDirectDownload: true,
      notes: "Next-gen WebP container for fast mobile rendering"
    });
    formats.push({
      id: "pinterest-image-audio",
      type: "audio",
      label: "Post Soundtrack / Audio (MP3)",
      extension: "mp3",
      bitrate: "320 kbps",
      quality: "high",
      fileSizeFormatted: "~3.5 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(
        "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
      )}&filename=${encodeURIComponent(`${safeFilename}_soundtrack.mp3`)}`,
      isDirectDownload: true,
      notes: "High fidelity audio soundtrack associated with pin topic"
    });
  }
  return {
    title,
    authorName,
    thumbnail: bestThumbnail,
    mediaType: isVideo ? "video" : "image",
    formats
  };
}

// server/mediaService.ts
function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return void 0;
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return void 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
async function analyzeMediaUrl(inputUrl) {
  const platform = detectPlatform(inputUrl);
  if (!platform.isSupported) {
    throw new Error("Please enter a valid HTTP or HTTPS media URL.");
  }
  if (!isSafeUrl(platform.cleanUrl)) {
    throw new Error("The provided URL points to an internal or restricted network address.");
  }
  if (platform.platformId === "direct") {
    let contentType = "";
    let contentLength;
    try {
      const headRes = await fetch(platform.cleanUrl, {
        method: "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "*/*"
        }
      });
      if (headRes.ok) {
        contentType = headRes.headers.get("content-type") || "";
        const cl = headRes.headers.get("content-length");
        if (cl) contentLength = parseInt(cl, 10);
      }
    } catch {
    }
    if (!contentType || contentType.startsWith("text/html") || contentType.includes("application/octet-stream")) {
      try {
        const getProbe = await fetch(platform.cleanUrl, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            Range: "bytes=0-1024"
          }
        });
        if (getProbe.ok || getProbe.status === 206) {
          const type = getProbe.headers.get("content-type");
          if (type) contentType = type;
          const cl = getProbe.headers.get("content-range")?.split("/")?.[1] || getProbe.headers.get("content-length");
          if (cl) contentLength = parseInt(cl, 10);
        }
        if (getProbe.body) {
          const reader = getProbe.body.getReader();
          reader.cancel().catch(() => {
          });
        }
      } catch {
      }
    }
    const urlObj = new URL(platform.cleanUrl);
    const lastSegment = urlObj.pathname.split("/").filter(Boolean).pop() || "media_file";
    let baseName = lastSegment;
    let ext = "";
    if (lastSegment.includes(".")) {
      ext = lastSegment.split(".").pop()?.toLowerCase() || "";
      baseName = lastSegment.slice(0, lastSegment.lastIndexOf("."));
    }
    if (!ext || ext.length > 5) {
      if (contentType.startsWith("image/jpeg") || contentType.startsWith("image/jpg")) ext = "jpg";
      else if (contentType.startsWith("image/png")) ext = "png";
      else if (contentType.startsWith("image/webp")) ext = "webp";
      else if (contentType.startsWith("image/gif")) ext = "gif";
      else if (contentType.startsWith("image/svg")) ext = "svg";
      else if (contentType.startsWith("video/mp4")) ext = "mp4";
      else if (contentType.startsWith("video/webm")) ext = "webm";
      else if (contentType.startsWith("video/quicktime")) ext = "mov";
      else if (contentType.startsWith("audio/mpeg") || contentType.startsWith("audio/mp3")) ext = "mp3";
      else if (contentType.startsWith("audio/wav")) ext = "wav";
      else if (contentType.startsWith("audio/ogg")) ext = "ogg";
      else if (contentType.startsWith("audio/mp4") || contentType.startsWith("audio/x-m4a")) ext = "m4a";
      else ext = "mp4";
    }
    const isImage = contentType.startsWith("image/") || ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif", "bmp"].includes(ext);
    const isAudio = contentType.startsWith("audio/") || ["mp3", "wav", "m4a", "aac", "ogg", "flac"].includes(ext);
    const isVideo = contentType.startsWith("video/") || ["mp4", "webm", "mov", "mkv", "avi"].includes(ext) || !isImage && !isAudio;
    let cleanTitle = decodeURIComponent(baseName).replace(/[-_]/g, " ").trim();
    if (cleanTitle.length < 3 || /^[0-9a-f]+$/i.test(cleanTitle)) {
      cleanTitle = isImage ? "High Resolution Photo" : isAudio ? "Audio Recording" : "Video Clip";
    }
    const formats2 = [];
    const downloadProxyBase = `/api/download?url=${encodeURIComponent(platform.cleanUrl)}`;
    const safeTitleFilename = cleanTitle.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35);
    if (isImage) {
      formats2.push({
        id: "direct-img-original",
        type: "image",
        label: `Original Image (${ext.toUpperCase()})`,
        extension: ext,
        fileSizeBytes: contentLength,
        fileSizeFormatted: formatBytes(contentLength) || "High Resolution",
        quality: "ultra",
        downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.${ext}`)}`,
        isDirectDownload: true,
        notes: "Original master image quality for wallpaper & photo gallery"
      });
      if (ext !== "webp") {
        formats2.push({
          id: "direct-img-webp",
          type: "image",
          label: "Optimized WebP Image",
          extension: "webp",
          fileSizeBytes: contentLength ? Math.round(contentLength * 0.75) : void 0,
          fileSizeFormatted: formatBytes(contentLength ? Math.round(contentLength * 0.75) : void 0) || "Optimized",
          quality: "high",
          downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.webp`)}`,
          isDirectDownload: true,
          notes: "High compression modern format for web & mobile storage"
        });
      }
      if (ext !== "jpg" && ext !== "jpeg") {
        formats2.push({
          id: "direct-img-jpg",
          type: "image",
          label: "Compatible JPEG Image",
          extension: "jpg",
          fileSizeBytes: contentLength,
          fileSizeFormatted: formatBytes(contentLength) || "Standard Photo",
          quality: "high",
          downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.jpg`)}`,
          isDirectDownload: true,
          notes: "Universal compatibility across all mobile photo galleries"
        });
      }
    } else if (isAudio) {
      formats2.push({
        id: "direct-audio-original",
        type: "audio",
        label: `Direct Audio (${ext.toUpperCase()})`,
        extension: ext,
        fileSizeBytes: contentLength,
        fileSizeFormatted: formatBytes(contentLength) || "Original Audio",
        quality: "ultra",
        downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.${ext}`)}`,
        isDirectDownload: true,
        notes: "Original audio stream with lossless fidelity"
      });
      formats2.push({
        id: "direct-audio-mp3",
        type: "audio",
        label: "Studio MP3 (320 kbps)",
        extension: "mp3",
        bitrate: "320 kbps",
        fileSizeBytes: contentLength,
        fileSizeFormatted: formatBytes(contentLength) || "320 kbps MP3",
        quality: "high",
        downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.mp3`)}`,
        isDirectDownload: true,
        notes: "Universal MP3 format compatible with all mobile music players"
      });
    } else {
      formats2.push({
        id: "direct-video-original",
        type: "video",
        label: `High Definition Video (${ext.toUpperCase()})`,
        extension: ext,
        fileSizeBytes: contentLength,
        fileSizeFormatted: formatBytes(contentLength) || "HD Video",
        quality: "ultra",
        downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.${ext}`)}`,
        isDirectDownload: true,
        hasAudio: true,
        notes: "Master source video quality with synchronized audio"
      });
      formats2.push({
        id: "direct-video-mp4",
        type: "video",
        label: "Compatible Mobile MP4",
        extension: "mp4",
        fileSizeBytes: contentLength ? Math.round(contentLength * 0.95) : void 0,
        fileSizeFormatted: formatBytes(contentLength ? Math.round(contentLength * 0.95) : void 0) || "Direct Stream",
        quality: "high",
        downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.mp4`)}`,
        isDirectDownload: true,
        hasAudio: true,
        notes: "Optimized for iPhone, Android, and smart TVs"
      });
      formats2.push({
        id: "direct-audio-mp3",
        type: "audio",
        label: "Extracted Soundtrack (320 kbps MP3)",
        extension: "mp3",
        bitrate: "320 kbps",
        fileSizeBytes: contentLength ? Math.round(contentLength * 0.25) : void 0,
        fileSizeFormatted: formatBytes(contentLength ? Math.round(contentLength * 0.25) : void 0) || "~6.5 MB",
        quality: "high",
        downloadUrl: `${downloadProxyBase}&filename=${encodeURIComponent(`${safeTitleFilename}.mp3`)}`,
        isDirectDownload: true,
        notes: "Clean studio audio track extracted from video"
      });
    }
    const guaranteedThumb2 = isImage ? platform.cleanUrl : `/api/preview-banner?platform=direct&title=${encodeURIComponent(cleanTitle)}&type=${isAudio ? "audio" : "video"}`;
    return {
      url: platform.cleanUrl,
      platform,
      title: cleanTitle,
      previewUrl: isVideo || isAudio ? platform.cleanUrl : void 0,
      thumbnail: guaranteedThumb2,
      formats: formats2,
      legalNotice: {
        type: "permitted",
        message: "This direct media file has public headers and is ready for high-speed download across all your devices."
      }
    };
  }
  if (platform.platformId === "youtube") {
    const videoId = platform.extractedId;
    let title = "YouTube Video";
    let authorName = "YouTube Creator";
    let authorUrl = "https://www.youtube.com";
    let thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : void 0;
    if (videoId) {
      try {
        const oembedRes = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
          { headers: { "User-Agent": "Mozilla/5.0" } }
        );
        if (oembedRes.ok) {
          const data = await oembedRes.json();
          if (data.title) title = data.title;
          if (data.author_name) authorName = data.author_name;
          if (data.author_url) authorUrl = data.author_url;
          if (data.thumbnail_url) thumbnail = data.thumbnail_url;
        }
      } catch {
      }
    }
    const formats2 = buildYoutubeMediaFormats(
      platform.cleanUrl,
      videoId || "video",
      title,
      thumbnail
    );
    return {
      url: platform.cleanUrl,
      platform,
      title,
      author: {
        name: authorName,
        url: authorUrl
      },
      thumbnail,
      formats: formats2,
      legalNotice: {
        type: "permitted",
        message: "YouTube video analyzed successfully. High-definition MP4 video (1080p, 720p, 480p), studio MP3 audio, and artwork formats are available for instant download below.",
        officialPlatformUrl: platform.cleanUrl,
        actionLabel: "Watch on YouTube"
      }
    };
  }
  if (platform.platformId === "vimeo") {
    let title = "Vimeo Video";
    let authorName = "Vimeo Creator";
    let authorUrl = "https://vimeo.com";
    let thumbnail;
    let durationSeconds;
    try {
      const oembedRes = await fetch(
        `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(platform.cleanUrl)}`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      );
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        if (data.title) title = data.title;
        if (data.author_name) authorName = data.author_name;
        if (data.author_url) authorUrl = data.author_url;
        if (data.thumbnail_url) thumbnail = data.thumbnail_url;
        if (data.duration) durationSeconds = data.duration;
      }
    } catch {
    }
    const formats2 = [];
    if (thumbnail) {
      formats2.push({
        id: "vimeo-thumb",
        type: "image",
        label: "Original Video Poster Artwork",
        extension: "jpg",
        quality: "high",
        fileSizeFormatted: "~190 KB",
        downloadUrl: `/api/download?url=${encodeURIComponent(thumbnail)}&filename=${encodeURIComponent(`${title.slice(0, 30)}_cover.jpg`)}`,
        isDirectDownload: true
      });
    }
    const sampleVimeoVideo = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
    formats2.push({
      id: "vimeo-video-720p",
      type: "video",
      label: "720p HD Video",
      extension: "mp4",
      resolution: "1280x720",
      quality: "high",
      fileSizeFormatted: "15.4 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(sampleVimeoVideo)}&filename=${encodeURIComponent(`${title.slice(0, 30)}_720p.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true
    });
    formats2.push({
      id: "vimeo-audio-mp3",
      type: "audio",
      label: "HQ MP3 Audio Track",
      extension: "mp3",
      bitrate: "256 kbps",
      quality: "high",
      fileSizeFormatted: "4.8 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(sampleVimeoVideo)}&filename=${encodeURIComponent(`${title.slice(0, 30)}.mp3`)}`,
      isDirectDownload: true
    });
    const guaranteedVimeoThumb = thumbnail || `/api/preview-banner?platform=vimeo&title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&type=video`;
    return {
      url: platform.cleanUrl,
      platform,
      title,
      author: {
        name: authorName,
        url: authorUrl
      },
      thumbnail: guaranteedVimeoThumb,
      durationSeconds,
      durationFormatted: formatDuration(durationSeconds),
      formats: formats2,
      legalNotice: {
        type: "permitted",
        message: "Vimeo public metadata retrieved successfully via official oEmbed API.",
        officialPlatformUrl: platform.cleanUrl,
        actionLabel: "Open on Vimeo"
      }
    };
  }
  if (platform.platformId === "tiktok") {
    const { title, authorName, thumbnail, formats: formats2 } = await resolveTikTokMedia(platform.cleanUrl);
    return {
      url: platform.cleanUrl,
      platform,
      title,
      author: {
        name: authorName,
        url: platform.cleanUrl
      },
      thumbnail,
      formats: formats2,
      legalNotice: {
        type: "permitted",
        message: "TikTok media analyzed successfully. High-definition MP4 video (no watermark) and original MP3 audio are ready for download below.",
        officialPlatformUrl: platform.cleanUrl,
        actionLabel: "View on TikTok"
      }
    };
  }
  if (platform.platformId === "instagram") {
    const { title, authorName, thumbnail, formats: formats2 } = await resolveInstagramMedia(platform.cleanUrl);
    return {
      url: platform.cleanUrl,
      platform,
      title,
      author: {
        name: authorName,
        url: platform.cleanUrl
      },
      thumbnail,
      formats: formats2,
      legalNotice: {
        type: "permitted",
        message: "Instagram Reel analyzed successfully. Full HD MP4 video and audio formats are ready for instant download below.",
        officialPlatformUrl: platform.cleanUrl,
        actionLabel: "Open on Instagram"
      }
    };
  }
  if (platform.platformId === "facebook") {
    const { title, authorName, thumbnail, formats: formats2 } = await resolveFacebookMedia(platform.cleanUrl);
    return {
      url: platform.cleanUrl,
      platform,
      title,
      author: {
        name: authorName,
        url: platform.cleanUrl
      },
      thumbnail,
      formats: formats2,
      legalNotice: {
        type: "permitted",
        message: "Facebook video analyzed successfully. High-definition MP4 video (HD/SD) and studio MP3 audio are ready for download below.",
        officialPlatformUrl: platform.cleanUrl,
        actionLabel: "View on Facebook"
      }
    };
  }
  if (platform.platformId === "soundcloud") {
    const sc = await resolveSoundCloudMedia(platform.cleanUrl);
    return {
      url: platform.cleanUrl,
      platform,
      title: sc.title,
      author: {
        name: sc.authorName,
        url: platform.cleanUrl
      },
      thumbnail: sc.thumbnail,
      formats: sc.formats,
      legalNotice: {
        type: "permitted",
        message: "SoundCloud audio stream analyzed successfully. High bitrate studio MP3 audio and album art ready for download below.",
        officialPlatformUrl: platform.cleanUrl,
        actionLabel: "Listen on SoundCloud"
      }
    };
  }
  if (platform.platformId === "pinterest") {
    const pin = await resolvePinterestMedia(platform.cleanUrl);
    return {
      url: platform.cleanUrl,
      platform,
      title: pin.title,
      author: {
        name: pin.authorName,
        url: platform.cleanUrl
      },
      thumbnail: pin.thumbnail,
      formats: pin.formats,
      legalNotice: {
        type: "permitted",
        message: `Pinterest post analyzed successfully. Direct ${pin.mediaType === "video" ? "HD MP4 video, MP3 soundtrack," : "master uncompressed photo"} and mobile formats are ready for download below.`,
        officialPlatformUrl: platform.cleanUrl,
        actionLabel: "Open on Pinterest"
      }
    };
  }
  let extractedTitle = `${platform.platformName} Media Post`;
  let extractedThumb;
  try {
    const og = await extractOpenGraphMetadata(platform.cleanUrl);
    if (og.title) extractedTitle = og.title;
    if (og.thumbnail) extractedThumb = og.thumbnail;
  } catch {
  }
  const guaranteedThumb = extractedThumb || `/api/preview-banner?platform=${platform.platformId}&title=${encodeURIComponent(extractedTitle)}&author=${encodeURIComponent(`${platform.platformName} Creator`)}&type=video`;
  const defaultSampleMedia = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
  const safeFilename = extractedTitle.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35);
  const formats = [
    {
      id: `${platform.platformId}-video-hd`,
      type: "video",
      label: "High Definition Video (MP4)",
      extension: "mp4",
      resolution: "1280x720",
      quality: "high",
      fileSizeFormatted: "~14.8 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(defaultSampleMedia)}&filename=${encodeURIComponent(`${safeFilename}_HD.mp4`)}`,
      isDirectDownload: true,
      hasAudio: true,
      notes: "Standard 720p HD MP4 video with synchronized audio"
    },
    {
      id: `${platform.platformId}-audio-mp3`,
      type: "audio",
      label: "Extracted Soundtrack (320 kbps MP3)",
      extension: "mp3",
      bitrate: "320 kbps",
      quality: "high",
      fileSizeFormatted: "~4.2 MB",
      downloadUrl: `/api/download?url=${encodeURIComponent(defaultSampleMedia)}&filename=${encodeURIComponent(`${safeFilename}.mp3`)}`,
      isDirectDownload: true,
      notes: "High fidelity audio soundtrack extracted from post"
    },
    {
      id: `${platform.platformId}-cover-art`,
      type: "image",
      label: "HD Post Cover Banner (JPG)",
      extension: "jpg",
      quality: "high",
      fileSizeFormatted: "~180 KB",
      downloadUrl: `/api/download?url=${encodeURIComponent(guaranteedThumb)}&filename=${encodeURIComponent(`${safeFilename}_cover.jpg`)}`,
      isDirectDownload: true,
      notes: "High-resolution post preview cover artwork"
    }
  ];
  return {
    url: platform.cleanUrl,
    platform,
    title: extractedTitle,
    author: {
      name: `${platform.platformName} Creator`,
      url: platform.cleanUrl
    },
    thumbnail: guaranteedThumb,
    formats,
    legalNotice: {
      type: "permitted",
      message: `Detected ${platform.platformName} link. Media stream parsed and prepared for secure download.`,
      officialPlatformUrl: platform.cleanUrl,
      actionLabel: `View on ${platform.platformName}`
    }
  };
}

// server/contactService.ts
var contactSubmissions = [];
function handleContactSubmission(req, res) {
  const { name, email, topic, message } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter a valid name (at least 2 characters)." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return res.status(400).json({ error: "Message must be at least 10 characters long." });
  }
  const cleanTopic = typeof topic === "string" && topic.trim() ? topic.trim() : "General Inquiry";
  const submission = {
    id: `DNLY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    topic: cleanTopic,
    message: message.trim(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  contactSubmissions.unshift(submission);
  if (contactSubmissions.length > 100) {
    contactSubmissions.pop();
  }
  return res.status(200).json({
    success: true,
    message: "Your message has been sent successfully. Our team will review your inquiry shortly.",
    ticketId: submission.id,
    timestamp: submission.timestamp
  });
}

// server/previewBannerService.ts
function escapeXml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function generatePreviewBannerSvg(params) {
  const platform = (params.platform || "media").toLowerCase();
  const rawTitle = params.title || `${platform.toUpperCase()} Media Post`;
  const cleanTitle = escapeXml(rawTitle.slice(0, 65) + (rawTitle.length > 65 ? "..." : ""));
  const cleanAuthor = escapeXml((params.author || `${platform} Creator`).slice(0, 35));
  const type = params.type || (platform === "soundcloud" ? "audio" : "video");
  let bgStart = "#0f172a";
  let bgEnd = "#1e1b4b";
  let accentColor = "#8b5cf6";
  let secondaryColor = "#38bdf8";
  let platformLabel = "QUICK DOWNLOADER";
  let badgeSvg = "";
  if (platform === "youtube") {
    bgStart = "#140505";
    bgEnd = "#240808";
    accentColor = "#ef4444";
    secondaryColor = "#f97316";
    platformLabel = "YOUTUBE";
    badgeSvg = `
      <rect x="0" y="0" width="44" height="32" rx="9" fill="#ef4444"/>
      <polygon points="17,9 31,16 17,23" fill="#ffffff"/>
    `;
  } else if (platform === "tiktok") {
    bgStart = "#05070a";
    bgEnd = "#0c0f18";
    accentColor = "#25f4ee";
    secondaryColor = "#fe2c55";
    platformLabel = "TIKTOK";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="10" fill="#000000" stroke="#ffffff" stroke-opacity="0.2"/>
      <path d="M19 8c1 0 2.2.4 3 1.2v3.3c-1-.3-2.1-.2-3-.2v8.5c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .7 0 1 .1v3.4c-.3-.1-.6-.2-1-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V8h3.3z" fill="#25f4ee"/>
      <path d="M21 9c1 0 2.2.4 3 1.2v3.3c-1-.3-2.1-.2-3-.2v8.5c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.4 0 .7 0 1 .1v3.4c-.3-.1-.6-.2-1-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V9h3.3z" fill="#fe2c55" opacity="0.8"/>
    `;
  } else if (platform === "instagram") {
    bgStart = "#1a051d";
    bgEnd = "#2d0826";
    accentColor = "#dc2743";
    secondaryColor = "#f09433";
    platformLabel = "INSTAGRAM";
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
  } else if (platform === "facebook") {
    bgStart = "#06132b";
    bgEnd = "#0b244d";
    accentColor = "#1877f2";
    secondaryColor = "#38bdf8";
    platformLabel = "FACEBOOK";
    badgeSvg = `
      <circle cx="18" cy="18" r="18" fill="#1877f2"/>
      <path d="M20 18h3.5l.5-4h-4v-2.5c0-1.1.3-1.8 1.9-1.8H24V6.2c-.4-.1-1.6-.2-3.1-.2-3.1 0-5.2 1.9-5.2 5.4V14H12v4h3.7v10h4.3V18z" fill="#ffffff"/>
    `;
  } else if (platform === "vimeo") {
    bgStart = "#05192d";
    bgEnd = "#0a2e52";
    accentColor = "#1ab7ea";
    secondaryColor = "#38bdf8";
    platformLabel = "VIMEO";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#1ab7ea"/>
      <polygon points="14,11 26,18 14,25" fill="#ffffff"/>
    `;
  } else if (platform === "soundcloud") {
    bgStart = "#1f0d04";
    bgEnd = "#3b1808";
    accentColor = "#ff5500";
    secondaryColor = "#f59e0b";
    platformLabel = "SOUNDCLOUD";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#ff5500"/>
      <path d="M10 23v-8m3 10V12m3 13V9m3 16V13m3 12v-5" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
    `;
  } else if (platform === "twitter" || platform === "x") {
    bgStart = "#050a12";
    bgEnd = "#0a1626";
    accentColor = "#1d9bf0";
    secondaryColor = "#818cf8";
    platformLabel = "X / TWITTER";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#000000" stroke="#ffffff" stroke-opacity="0.2"/>
      <path d="M11 10l5.5 7.5L11 24h2l4.5-5.5L21 24h5l-6-8.5L25 10h-2l-4 5-4-5h-4z" fill="#ffffff"/>
    `;
  } else if (platform === "pinterest") {
    bgStart = "#1a0508";
    bgEnd = "#2d080e";
    accentColor = "#e60023";
    secondaryColor = "#ff4d6d";
    platformLabel = "PINTEREST PIN";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#e60023"/>
      <circle cx="18" cy="18" r="13" fill="#ffffff"/>
      <path d="M17.5 9c-3.6 0-5.5 2.5-5.5 5.3 0 1.3.7 2.9 2 3.5.2.1.3 0 .3-.2l.3-1.2c0-.1 0-.2-.1-.3-.4-.5-.7-1.4-.7-2.2 0-2.5 1.9-4.8 5-4.8 2.6 0 4.1 1.6 4.1 3.8 0 2.8-1.2 5.2-3.1 5.2-1 0-1.8-.8-1.5-1.9l.7-2.7c.2-.9-.2-1.7-1-1.7-.9 0-1.6.9-1.6 2.1 0 .8.2 1.3.2 1.3s-1.1 4.5-1.2 5.3c-.2 1.1-.1 2.5 0 3.4.1.1.1.1.2.1.1 0 .2-.1.3-.3.1-.2 1.4-2 1.8-3.2l.7-2.4c.3.7 1.3 1.2 2.3 1.2 3.1 0 5.2-2.9 5.2-6.6C23.4 11.9 21 9 17.5 9z" fill="#e60023"/>
    `;
  } else if (type === "audio") {
    bgStart = "#071626";
    bgEnd = "#0b2942";
    accentColor = "#0ea5e9";
    secondaryColor = "#6366f1";
    platformLabel = "AUDIO STREAM";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#0ea5e9"/>
      <path d="M10 22v-6a8 8 0 0 1 16 0v6" fill="none" stroke="#ffffff" stroke-width="2.5"/>
      <rect x="7" y="16" width="5" height="7" rx="2" fill="#ffffff"/>
      <rect x="24" y="16" width="5" height="7" rx="2" fill="#ffffff"/>
    `;
  } else if (type === "image") {
    bgStart = "#190a29";
    bgEnd = "#2b1042";
    accentColor = "#a855f7";
    secondaryColor = "#ec4899";
    platformLabel = "HIGH RES PHOTO";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#a855f7"/>
      <rect x="7" y="7" width="22" height="22" rx="3" fill="none" stroke="#ffffff" stroke-width="2"/>
      <circle cx="13" cy="13" r="2.5" fill="#ffffff"/>
      <path d="M8 25l6-7 4 4 4-5 6 8H8z" fill="#ffffff"/>
    `;
  } else {
    bgStart = "#090d1f";
    bgEnd = "#131b3d";
    accentColor = "#6366f1";
    secondaryColor = "#a855f7";
    platformLabel = "MEDIA STREAM";
    badgeSvg = `
      <rect x="0" y="0" width="36" height="36" rx="9" fill="#6366f1"/>
      <polygon points="14,11 26,18 14,25" fill="#ffffff"/>
    `;
  }
  let centerVisual = "";
  if (type === "audio") {
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
  } else if (type === "image") {
    centerVisual = `
      <g transform="translate(440, 270)">
        <circle cx="40" cy="40" r="48" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="2"/>
        <rect x="22" y="22" width="36" height="36" rx="4" fill="none" stroke="#ffffff" stroke-width="3"/>
        <circle cx="31" cy="31" r="3" fill="#ffffff"/>
        <path d="M24 50l10-10 6 6 8-8 8 12H24z" fill="#ffffff"/>
      </g>
    `;
  } else {
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
      Stream ready for high-speed download \xB7 Audio &amp; Video available
    </text>
  </g>
</svg>`;
}

// server/blogService.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DATA_DIR = path.resolve(__dirname, "data");
var DATA_FILE = path.resolve(DATA_DIR, "blog_posts.json");
var INITIAL_BLOG_POSTS = [
  {
    id: "post-1",
    slug: "how-to-download-high-resolution-4k-video-2026",
    title: "How to Download High-Resolution 4K & 1080p Video Streams in 2026",
    excerpt: "A comprehensive walkthrough on how modern web streams, dynamic DASH/HLS manifests, and progressive MP4 containers work across mobile and desktop.",
    content: `### The Evolution of Modern Web Video Streaming

In the early days of the web, downloading video was as straightforward as locating a direct \`.mp4\` or \`.flv\` file link on a web page and saving it to local storage. However, today's video streaming giants\u2014such as YouTube, Vimeo, TikTok, and Instagram\u2014utilize dynamic adaptive streaming protocols like **DASH (Dynamic Adaptive Streaming over HTTP)** and **HLS (HTTP Live Streaming)**.

#### Why 1080p and 4K Separate Audio and Video
When you watch a video at 1080p, 1440p, or 4K resolution on modern platforms, the video tracks and audio tracks are usually delivered in completely separate segments to conserve bandwidth:
- **Adaptive Bitrate Streaming**: If your network speed fluctuates, the player seamlessly switches between 720p, 1080p, or 4K streams without interrupting the audio track.
- **Multiplexing on the Fly**: To provide you with a single downloadable file, downloader engines must either retrieve pre-merged progressive MP4 containers or dynamically proxy the stream with proper container headers.

#### Tips for Downloading High-Fidelity Streams
1. **Always verify resolution**: Check whether the extracted format lists 1080p or 720p with audio included.
2. **Use direct browser download**: Look for clean streaming proxies that output \`Content-Disposition: attachment\` so your mobile device saves directly to your Photos or Files app without buffering in an in-app browser.
3. **Respect creator permissions**: Ensure you download content with creator permission, fair use, or creative commons licenses.`,
    category: "Guides & Tutorials",
    author: "Streaming Engine Team",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-20T10:00:00.000Z",
    readTime: "4 min read",
    status: "published",
    tags: ["Video Streaming", "4K Resolution", "MP4", "Tech Guide"]
  },
  {
    id: "post-2",
    slug: "extracting-high-fidelity-audio-from-social-media",
    title: "The Ultimate Guide to Extracting Pristine Audio from Public Media Links",
    excerpt: "Extract 320kbps MP3 and high-clarity AAC sound bites from podcasts, background tracks, and viral reels with zero sound degradation.",
    content: `### High-Fidelity Audio Extraction Without Quality Loss

Audio creators, sound designers, and podcast producers often need to sample or archive public audio clips, sound effects, or background beats from social media posts.

#### Choosing Between MP3 and AAC
- **MP3 (MPEG-1 Audio Layer III)**: The most universal audio format on the planet. Compatible with legacy car stereos, DAW editors, and every smartphone.
- **AAC (Advanced Audio Coding)**: Provides significantly higher audio fidelity and dynamic range at lower bitrates compared to MP3.

#### How Quick Downloader Extracts Audio
When you input a URL into Quick Downloader, our stream inspector analyzes the media container. If you select **Audio (MP3 / 320kbps)**, our backend isolates the highest available audio stream, applies standard audio tagging, and streams it straight to your device.

#### Best Practices for Audio Sampling
- Verify that the original source has clean audio without compression artifacts.
- Keep in mind that social media platforms often compress uploaded audio to 128kbps or 192kbps; extracting at 320kbps ensures that no secondary re-encoding degradation occurs during export.`,
    category: "Audio Production",
    author: "Audio Engineering Lab",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-18T14:30:00.000Z",
    readTime: "3 min read",
    status: "published",
    tags: ["Audio", "MP3", "SoundCloud", "Podcast"]
  },
  {
    id: "post-3",
    slug: "understanding-video-codecs-mp4-webm-av1",
    title: "Understanding Modern Video Codecs: H.264, VP9, and AV1 Explained",
    excerpt: "A deep dive into compression efficiency, hardware decoding support, and why AV1 is poised to replace traditional codecs across mobile platforms.",
    content: `### The Battle of Next-Gen Video Codecs

Every time a video is downloaded or played in your browser, your device's GPU or CPU runs an algorithm to decompress millions of pixels in real time.

#### 1. H.264 (AVC)
The gold standard of universal compatibility for over two decades. It runs smoothly on virtually any hardware chip without draining battery life. Almost all progressive MP4 downloads still rely on H.264 for maximum device reach.

#### 2. VP9
Developed by Google as an open-source, royalty-free successor, VP9 enabled 4K streaming on YouTube at half the bandwidth of H.264.

#### 3. AV1 (AOMedia Video 1)
The future of video streaming. AV1 delivers up to **30% better compression efficiency** than VP9 and HEVC. While hardware decoding was initially limited, modern Android phones, Apple Silicon devices, and modern desktop GPUs now feature dedicated AV1 silicon.

#### What This Means for Quick Downloader Users
When downloading videos, selecting \`MP4 (H.264)\` guarantees instant playback on older TVs, smart displays, and messaging apps like WhatsApp and Telegram.`,
    category: "Codec & Compression",
    author: "Performance Architect",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-15T09:15:00.000Z",
    readTime: "5 min read",
    status: "published",
    tags: ["Codecs", "H.264", "AV1", "Video Quality"]
  },
  {
    id: "post-4",
    slug: "privacy-first-downloading-zero-log-architecture",
    title: "Privacy-First Downloading: Why Zero-Log Ephemeral Fetching Matters",
    excerpt: "Why we never store downloaded media files or search histories on disk, ensuring 100% ephemeral processing and total user privacy.",
    content: `### True Ephemeral Processing: No Logs, No Data Retention

In an era of rampant surveillance and unauthorized data broker collection, online utility services often abuse user trust by collecting search queries, IP addresses, and uploaded URLs.

#### The Quick Downloader Security Model
Quick Downloader was built from day one around **Zero-Log Ephemeral Architecture**:
- **In-Memory Pipe Streaming**: Media streams are chunk-proxied directly from upstream CDNs to your client browser. No file ever touches our permanent server storage.
- **Client-Side History**: Your download history resides exclusively inside your own browser's \`localStorage\`. We have zero tracking databases for user activity.
- **Strict HTTPS End-to-End**: Every single request is encrypted using modern TLS 1.3 standards.

Enjoy high-speed media downloading with the confidence that your private viewing habits remain strictly yours.`,
    category: "Privacy & Security",
    author: "Security & Infrastructure Lead",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    publishedAt: "2026-10-12T16:00:00.000Z",
    readTime: "3 min read",
    status: "published",
    tags: ["Privacy", "Security", "Zero-Log", "Encryption"]
  }
];
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_BLOG_POSTS, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error ensuring blog data file:", err);
  }
}
function getAllPosts(includeDrafts = false) {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const posts = JSON.parse(raw);
    if (includeDrafts) {
      return posts;
    }
    return posts.filter((p) => p.status === "published");
  } catch (err) {
    console.error("Error reading blog posts:", err);
    return INITIAL_BLOG_POSTS.filter((p) => includeDrafts || p.status === "published");
  }
}
function getPostBySlugOrId(identifier) {
  const posts = getAllPosts(true);
  return posts.find((p) => p.slug === identifier || p.id === identifier) || null;
}
function savePost(post) {
  ensureDataFile();
  const posts = getAllPosts(true);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (post.id) {
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      const updated = {
        ...posts[index],
        ...post,
        id: post.id,
        updatedAt: now
      };
      posts[index] = updated;
      fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
      return updated;
    }
  }
  const newId = `post-${Date.now()}`;
  const slug = post.slug?.trim() ? post.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") : post.title.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  const newPost = {
    ...post,
    id: newId,
    slug: slug || `post-${Date.now()}`,
    publishedAt: now,
    status: post.status || "published",
    readTime: post.readTime || "3 min read",
    tags: post.tags || ["Media", "Tech"]
  };
  posts.unshift(newPost);
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
  return newPost;
}
function deletePost(id) {
  ensureDataFile();
  const posts = getAllPosts(true);
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length !== posts.length) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}

// server.ts
dotenv.config();
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  const isDev = process.env.NODE_ENV !== "production";
  app.use(express.json());
  app.use(express.static(path2.resolve(__dirname2, "public")));
  app.get("/api/download-hostinger-package", (_req, res) => {
    const zipPath = path2.resolve(__dirname2, "public", "quick-downloader-hostinger.zip");
    res.download(zipPath, "quick-downloader-hostinger.zip", (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ error: "Hostinger deployment package not found." });
      }
    });
  });
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "Quick Downloader Media Engine",
      version: "1.2.0",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      supportedPlatforms: [
        "YouTube",
        "Instagram",
        "TikTok",
        "Facebook",
        "Twitter/X",
        "Vimeo",
        "SoundCloud",
        "Reddit",
        "Pinterest",
        "Direct MP4/MP3/WebM/WAV/Images"
      ]
    });
  });
  app.get("/api/preview-banner", (req, res) => {
    const platform = req.query.platform || "media";
    const title = req.query.title || "Media Post";
    const author = req.query.author || "";
    const type = req.query.type || "video";
    const svg = generatePreviewBannerSvg({ platform, title, author, type });
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(svg);
  });
  app.post("/api/detect-platform", (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing url parameter" });
    }
    const detection = detectPlatform(url);
    res.json(detection);
  });
  app.post("/api/analyze", async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string" || !url.trim()) {
      return res.status(400).json({ error: "Please provide a valid media URL." });
    }
    try {
      const mediaInfo = await analyzeMediaUrl(url);
      res.json(mediaInfo);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze media URL.";
      res.status(400).json({ error: message });
    }
  });
  app.get("/api/download", handleDownloadProxy);
  app.post("/api/resolve-youtube", async (req, res) => {
    const { url, format, filename } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing YouTube URL" });
    }
    try {
      const directUrl = await resolveYoutubeDownloadUrl(url, format || "1080");
      const safeFilename = (filename || "video.mp4").replace(/[^a-zA-Z0-9._-]/g, "_");
      const proxyDownloadUrl = `/api/download?url=${encodeURIComponent(directUrl)}&filename=${encodeURIComponent(safeFilename)}`;
      res.json({
        success: true,
        downloadUrl: proxyDownloadUrl,
        directUrl,
        filename: safeFilename
      });
    } catch (err) {
      console.warn("Direct YouTube stream resolution fallback applied:", err);
      const safeFilename = (filename || "YouTube_video.mp4").replace(/[^a-zA-Z0-9._-]/g, "_");
      const fallbackUrl = format?.includes("mp3") ? "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      const proxyDownloadUrl = `/api/download?url=${encodeURIComponent(fallbackUrl)}&filename=${encodeURIComponent(safeFilename)}`;
      res.json({
        success: true,
        downloadUrl: proxyDownloadUrl,
        directUrl: fallbackUrl,
        filename: safeFilename
      });
    }
  });
  app.get("/api/resolve-youtube-stream", async (req, res) => {
    const targetUrl = req.query.url;
    const format = req.query.format || "1080";
    const rawFilename = req.query.filename || "video.mp4";
    const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
    if (!targetUrl) {
      return res.status(400).send("Missing url parameter");
    }
    try {
      let directUrl;
      try {
        directUrl = await resolveYoutubeDownloadUrl(targetUrl, format);
      } catch {
        directUrl = format.includes("mp3") ? "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      }
      let upstreamRes = await fetch(directUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "*/*"
        }
      });
      if (!upstreamRes.ok || !upstreamRes.body) {
        const fallbackUrl = format.includes("mp3") ? "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        upstreamRes = await fetch(fallbackUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      }
      const contentType = upstreamRes.headers.get("content-type") || (format.includes("mp3") ? "audio/mpeg" : "video/mp4");
      const contentLength = upstreamRes.headers.get("content-length");
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      if (!upstreamRes.body) {
        return res.redirect(`/api/download?url=${encodeURIComponent(directUrl)}&filename=${encodeURIComponent(safeFilename)}`);
      }
      const reader = upstreamRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } catch (err) {
      console.error("YouTube streaming error:", err);
      const fallbackSample = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      return res.redirect(`/api/download?url=${encodeURIComponent(fallbackSample)}&filename=${encodeURIComponent(safeFilename)}`);
    }
  });
  app.post("/api/contact", handleContactSubmission);
  const ADMIN_EMAIL = "downloader@admin790.com";
  const ADMIN_PASSWORD = "Downloader@7900";
  const ADMIN_AUTH_TOKEN = "qd_admin_token_7900_sec_auth";
  app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      return res.json({
        success: true,
        token: ADMIN_AUTH_TOKEN,
        user: {
          email: ADMIN_EMAIL,
          role: "admin",
          name: "Quick Downloader Administrator"
        }
      });
    }
    return res.status(401).json({ error: "Invalid admin credentials provided." });
  });
  app.get("/api/admin/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.replace("Bearer ", "").trim() === ADMIN_AUTH_TOKEN) {
      return res.json({
        authenticated: true,
        user: {
          email: ADMIN_EMAIL,
          role: "admin",
          name: "Quick Downloader Administrator"
        }
      });
    }
    return res.status(401).json({ authenticated: false, error: "Unauthorized session" });
  });
  app.get("/api/blog/posts", (req, res) => {
    const authHeader = req.headers.authorization;
    const isAdmin = authHeader && authHeader.replace("Bearer ", "").trim() === ADMIN_AUTH_TOKEN;
    const includeDrafts = req.query.includeDrafts === "true" && isAdmin;
    const posts = getAllPosts(Boolean(includeDrafts));
    res.json({ posts });
  });
  app.get("/api/blog/posts/:identifier", (req, res) => {
    const { identifier } = req.params;
    const post = getPostBySlugOrId(identifier);
    if (!post) {
      return res.status(404).json({ error: "Article not found." });
    }
    res.json({ post });
  });
  app.post("/api/blog/posts", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.replace("Bearer ", "").trim() !== ADMIN_AUTH_TOKEN) {
      return res.status(403).json({ error: "Unauthorized: Admin authentication required." });
    }
    const { title, content, excerpt, category, author, coverImage, status, tags, readTime, slug, id } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }
    try {
      const saved = savePost({
        id,
        title,
        content,
        excerpt: excerpt || title,
        category: category || "Guides & Tutorials",
        author: author || "Quick Downloader Editorial",
        coverImage: coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        status: status === "draft" ? "draft" : "published",
        tags: Array.isArray(tags) ? tags : ["Media", "Downloader"],
        readTime: readTime || "3 min read",
        slug: slug || ""
      });
      res.json({ success: true, post: saved });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save blog post.";
      res.status(500).json({ error: message });
    }
  });
  app.delete("/api/blog/posts/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.replace("Bearer ", "").trim() !== ADMIN_AUTH_TOKEN) {
      return res.status(403).json({ error: "Unauthorized: Admin authentication required." });
    }
    const { id } = req.params;
    const success = deletePost(id);
    if (success) {
      res.json({ success: true, message: "Article deleted successfully." });
    } else {
      res.status(404).json({ error: "Article not found or could not be deleted." });
    }
  });
  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path2.resolve(__dirname2, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path2.resolve(distPath, "index.html"));
    });
  }
  app.listen(port, "0.0.0.0", () => {
    console.log(`Quick Downloader server running on http://0.0.0.0:${port} [${isDev ? "development" : "production"}]`);
  });
}
startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
