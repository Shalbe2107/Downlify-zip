import React, { useState, useEffect } from 'react';
import { 
  MediaInfo, 
  MediaFormat, 
  PlatformId 
} from '../types';
import { 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Volume2, 
  FileVideo, 
  FileAudio, 
  FileImage, 
  Info, 
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Share2
} from 'lucide-react';

interface MediaResultCardProps {
  mediaInfo: MediaInfo;
  onDownloadStart?: (format: MediaFormat) => void;
}

export const MediaResultCard: React.FC<MediaResultCardProps> = ({
  mediaInfo,
  onDownloadStart,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio' | 'image'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [downloadStatusText, setDownloadStatusText] = useState<string>('');
  const [lastDownloadedBlob, setLastDownloadedBlob] = useState<{
    blob: Blob;
    filename: string;
  } | null>(null);

  // Foolproof image preview states
  const [currentImgSrc, setCurrentImgSrc] = useState<string>(mediaInfo.thumbnail || '');
  const [imgErrorCount, setImgErrorCount] = useState<number>(0);

  useEffect(() => {
    setCurrentImgSrc(mediaInfo.thumbnail || '');
    setImgErrorCount(0);
  }, [mediaInfo.thumbnail, mediaInfo.url]);

  const handleImageError = () => {
    if (
      imgErrorCount === 0 &&
      currentImgSrc &&
      currentImgSrc.startsWith('http') &&
      !currentImgSrc.includes('/api/download')
    ) {
      // Stage 1 Fallback: Proxy image through our server to strip referer and bypass CDN hotlink protections
      setImgErrorCount(1);
      setCurrentImgSrc(`/api/download?url=${encodeURIComponent(currentImgSrc)}`);
    } else if (imgErrorCount < 2) {
      // Stage 2 Fallback: Render dynamic HD 16:9 SVG preview banner
      setImgErrorCount(2);
      const isVideo = mediaInfo.formats.some((f) => f.type === 'video');
      const isAudio = mediaInfo.formats.some((f) => f.type === 'audio');
      const mediaType = isVideo ? 'video' : isAudio ? 'audio' : 'image';
      setCurrentImgSrc(
        `/api/preview-banner?platform=${mediaInfo.platform.platformId}&title=${encodeURIComponent(
          mediaInfo.title
        )}&author=${encodeURIComponent(mediaInfo.author?.name || '')}&type=${mediaType}`
      );
    } else {
      setImgErrorCount(3);
    }
  };

  const filteredFormats = mediaInfo.formats.filter((f) => {
    if (activeTab === 'all') return true;
    return f.type === activeTab;
  });

  const handleDownload = async (format: MediaFormat) => {
    setDownloadingId(format.id);
    setDownloadProgress(5);
    setDownloadStatusText('Preparing stream...');
    onDownloadStart?.(format);

    const cleanBaseTitle = (mediaInfo.title || 'media_file')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .slice(0, 45);
    const cleanFilename = `${cleanBaseTitle}.${format.extension}`;

    let streamDownloadUrl = format.downloadUrl;

    try {
      // 1. If it's a YouTube stream resolver link, resolve the direct download URL first
      if (format.downloadUrl.includes('/api/resolve-youtube-stream')) {
        const urlObj = new URL(format.downloadUrl, window.location.origin);
        const ytFormat = urlObj.searchParams.get('format') || '1080';

        setDownloadStatusText(`Resolving ${format.label}...`);
        const res = await fetch('/api/resolve-youtube', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: mediaInfo.url,
            format: ytFormat,
            filename: cleanFilename,
          }),
        });

        if (!res.ok) {
          throw new Error('Unable to convert stream for this video.');
        }

        const data = await res.json();
        if (data.downloadUrl) {
          streamDownloadUrl = data.downloadUrl;
        }
      }

      setDownloadStatusText('Connecting to download stream...');
      setDownloadProgress(20);

      // 2. Fetch the stream from our same-origin proxy
      const response = await fetch(streamDownloadUrl);
      if (!response.ok) {
        throw new Error(`Stream download failed with status ${response.status}`);
      }

      const contentLengthHeader = response.headers.get('content-length');
      const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

      if (!response.body) {
        throw new Error('Empty stream response');
      }

      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];
      let receivedBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;

        if (totalBytes > 0) {
          const pct = Math.min(98, Math.round((receivedBytes / totalBytes) * 100));
          setDownloadProgress(pct);
          const mbReceived = (receivedBytes / (1024 * 1024)).toFixed(1);
          const mbTotal = (totalBytes / (1024 * 1024)).toFixed(1);
          setDownloadStatusText(`Downloading ${mbReceived}MB / ${mbTotal}MB (${pct}%)`);
        } else {
          setDownloadProgress((prev) => (prev < 90 ? prev + 5 : prev));
          setDownloadStatusText(
            `Downloading ${(receivedBytes / (1024 * 1024)).toFixed(1)} MB...`
          );
        }
      }

      setDownloadProgress(100);
      setDownloadStatusText('Saving to Downloads folder & Gallery...');

      // 3. Assemble binary Blob (same-origin memory)
      const mimeType =
        format.type === 'video'
          ? 'video/mp4'
          : format.type === 'audio'
          ? 'audio/mpeg'
          : 'image/jpeg';

      const fileBlob = new Blob(chunks, { type: mimeType });
      setLastDownloadedBlob({ blob: fileBlob, filename: cleanFilename });

      // 4. Trigger guaranteed same-origin browser download
      const blobUrl = window.URL.createObjectURL(fileBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.style.display = 'none';
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = cleanFilename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();

      setTimeout(() => {
        document.body.removeChild(downloadAnchor);
        window.URL.revokeObjectURL(blobUrl);
      }, 3000);

      setDownloadSuccessId(format.id);
      setDownloadStatusText('Saved to Downloads folder & Gallery!');

      setTimeout(() => {
        setDownloadingId(null);
        setDownloadProgress(0);
      }, 2500);

      setTimeout(() => {
        setDownloadSuccessId(null);
        setDownloadStatusText('');
      }, 6000);
    } catch (err: unknown) {
      console.warn('Fetch stream error, applying mobile direct download fallback:', err);
      setDownloadStatusText('Triggering direct browser download...');
      try {
        const directAnchor = document.createElement('a');
        directAnchor.href = streamDownloadUrl;
        directAnchor.download = cleanFilename;
        directAnchor.target = '_self';
        document.body.appendChild(directAnchor);
        directAnchor.click();
        setTimeout(() => {
          if (directAnchor.parentNode) directAnchor.parentNode.removeChild(directAnchor);
        }, 3000);

        setDownloadSuccessId(format.id);
        setDownloadStatusText('Download sent to browser Downloads manager!');
        setTimeout(() => {
          setDownloadingId(null);
          setDownloadProgress(0);
        }, 2000);
      } catch {
        setDownloadingId(null);
        setDownloadProgress(0);
        setDownloadStatusText('');
      }
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mediaInfo.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out fill-mode-both">
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/95 dark:to-purple-950/30 rounded-3xl border border-purple-200/80 dark:border-purple-800/60 shadow-2xl shadow-purple-500/10 dark:shadow-purple-950/30 overflow-hidden hover:shadow-purple-500/20 transition-all duration-300">
        {/* Card Header & Media Information */}
        <div className="p-6 sm:p-8 border-b border-purple-100/80 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            
            {/* Visual Thumbnail / Stream Preview Slot */}
            <div className="w-full md:w-72 shrink-0">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-md group">
                {mediaInfo.previewUrl && /\.(mp4|webm|mov|mkv)($|\?)/i.test(mediaInfo.previewUrl) ? (
                  <video
                    src={mediaInfo.previewUrl}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                    poster={currentImgSrc}
                  />
                ) : mediaInfo.previewUrl && /\.(mp3|ogg|wav|m4a|aac)($|\?)/i.test(mediaInfo.previewUrl) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white text-center relative overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-4 bg-sky-400 rounded-full animate-pulse" />
                      <span className="w-1.5 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-8 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      <span className="w-1.5 h-5 bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                      <span className="w-1.5 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                    </div>
                    <span className="text-xs font-bold text-sky-200 truncate max-w-[200px]">
                      {mediaInfo.title}
                    </span>
                    <audio src={mediaInfo.previewUrl} controls className="w-full mt-2 h-7" />
                  </div>
                ) : currentImgSrc && imgErrorCount < 3 ? (
                  <img
                    src={currentImgSrc}
                    alt={mediaInfo.title}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                  />
                ) : (
                  // Rich branded fallback preview banner
                  <div className="w-full h-full flex flex-col justify-between p-3.5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                        {mediaInfo.platform.platformName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 bg-black/40 px-1.5 py-0.5 rounded">
                        HD PREVIEW
                      </span>
                    </div>
                    <div className="flex items-center justify-center my-auto z-10">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="z-10 truncate">
                      <p className="text-xs font-bold text-white truncate drop-shadow">
                        {mediaInfo.title}
                      </p>
                    </div>
                  </div>
                )}

                {/* Duration or Format Badge */}
                {mediaInfo.durationFormatted && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white pointer-events-none">
                    {mediaInfo.durationFormatted}
                  </span>
                )}
              </div>
            </div>

            {/* Media Metadata Details */}
            <div className="flex-1 min-w-0">
              {/* Unboxed clean metadata (Zero-pill discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-semibold text-purple-700 dark:text-purple-400">
                  {mediaInfo.platform.platformName}
                </span>
                <span aria-hidden="true">·</span>
                {mediaInfo.author?.name ? (
                  <>
                    <span className="truncate max-w-[180px]">{mediaInfo.author.name}</span>
                    <span aria-hidden="true">·</span>
                  </>
                ) : null}
                <span>Verified Stream</span>
              </div>

              {/* Title: Restricted to maximum 2 lines */}
              <h2
                title={mediaInfo.title}
                className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 overflow-hidden text-ellipsis break-words"
              >
                {mediaInfo.title}
              </h2>

              {/* URL & Action buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Copy Original URL'}</span>
                </button>

                {mediaInfo.legalNotice?.officialPlatformUrl && (
                  <a
                    href={mediaInfo.legalNotice.officialPlatformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{mediaInfo.legalNotice.actionLabel || 'Visit Platform'}</span>
                  </a>
                )}
              </div>

              {/* Legal / Platform Notice Box */}
              {mediaInfo.legalNotice && (
                <div className={`mt-4 p-3 rounded-xl text-xs leading-relaxed flex items-start gap-2.5 ${
                  mediaInfo.legalNotice.type === 'permitted'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60'
                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60'
                }`}>
                  {mediaInfo.legalNotice.type === 'permitted' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>{mediaInfo.legalNotice.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Format Selection & Download Options */}
        <div className="p-4 sm:p-7 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Downloadable Media Formats
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your preferred quality and file container
              </p>
            </div>

            {/* Interactive Filter Tabs (Segmented control) */}
            <div className="inline-flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl shrink-0">
              {([
                { key: 'all', label: 'All' },
                { key: 'video', label: 'Video MP4' },
                { key: 'audio', label: 'Audio MP3' },
                { key: 'image', label: 'Images' }
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formats List */}
          {filteredFormats.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No formats found under the selected category.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFormats.map((format, idx) => {
                const isDownloading = downloadingId === format.id;
                const isSuccess = downloadSuccessId === format.id;
                
                // Determine quality badge styling (4K, FHD, HD, MP3, etc.)
                const res = (format.resolution || '').toLowerCase();
                const lbl = (format.label || '').toLowerCase();
                let badgeText = (format.extension || 'HD').toUpperCase();
                let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

                if (res.includes('2160') || res.includes('4k') || lbl.includes('4k')) {
                  badgeText = '4K';
                  badgeClass = 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800';
                } else if (res.includes('1080') || res.includes('fhd') || lbl.includes('1080') || lbl.includes('fhd')) {
                  badgeText = 'FHD';
                  badgeClass = 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800';
                } else if (res.includes('720') || res.includes('hd') || lbl.includes('720') || lbl.includes('hd')) {
                  badgeText = 'HD';
                  badgeClass = 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800';
                } else if (format.type === 'audio') {
                  badgeText = format.extension.toUpperCase() || 'MP3';
                  badgeClass = 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800';
                } else if (format.type === 'image') {
                  badgeText = format.extension.toUpperCase() || 'IMG';
                  badgeClass = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
                }

                const hasFps = format.bitrate?.includes('fps') || format.label.includes('60fps');
                const fpsText = format.bitrate?.includes('fps') ? format.bitrate : '60 fps';

                return (
                  <div
                    key={format.id}
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600/80 transition-all duration-200 flex items-center justify-between gap-3 sm:gap-4 group"
                  >
                    {/* Left & Middle: Badge + Clean Organized Details */}
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                      {/* Quality / Container Badge */}
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0 border select-none ${badgeClass}`}
                      >
                        {badgeText}
                      </div>

                      {/* Main Details Block */}
                      <div className="min-w-0 flex-1">
                        {/* Row 1: Format Label & optional FPS indicator */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {format.label}
                          </span>
                          {hasFps && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {fpsText}
                            </span>
                          )}
                        </div>

                        {/* Row 2: Organized metadata row where every single piece is an unbreakable unit */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                          <span className="font-semibold uppercase text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {format.extension}
                          </span>

                          {format.resolution && (
                            <>
                              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600 select-none">•</span>
                              <span className="whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                {format.resolution}
                              </span>
                            </>
                          )}

                          {format.bitrate && !format.bitrate.includes('fps') && (
                            <>
                              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600 select-none">•</span>
                              <span className="whitespace-nowrap font-medium text-indigo-600 dark:text-indigo-400">
                                {format.bitrate}
                              </span>
                            </>
                          )}

                          {format.fileSizeFormatted && (
                            <>
                              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600 select-none">•</span>
                              <span className="whitespace-nowrap font-bold text-slate-900 dark:text-white tabular-nums">
                                {format.fileSizeFormatted}
                              </span>
                            </>
                          )}

                          {format.notes && (
                            <>
                              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600 select-none">•</span>
                              <span className="whitespace-nowrap truncate max-w-[130px] sm:max-w-[200px] text-slate-500 dark:text-slate-400">
                                {format.notes}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDownload(format)}
                        disabled={isDownloading}
                        className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all duration-200 cursor-pointer whitespace-nowrap ${
                          isSuccess
                            ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                            : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-indigo-500/25 active:scale-95'
                        } disabled:opacity-75`}
                      >
                        {isDownloading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span className="truncate max-w-[120px] sm:max-w-none">
                              {downloadStatusText || `Saving (${downloadProgress}%)`}
                            </span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Download {format.extension.toUpperCase()}</span>
                            <span className="sm:hidden">Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Download Success & Gallery Storage Confirmation Banner */}
          {lastDownloadedBlob && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">
                    File Saved Successfully!
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Saved as <code className="font-mono font-semibold">{lastDownloadedBlob.filename}</code>. Check your device's <strong>Downloads folder</strong> or phone <strong>Gallery</strong>.
                  </span>
                </div>
              </div>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const file = new File(
                        [lastDownloadedBlob.blob],
                        lastDownloadedBlob.filename,
                        { type: lastDownloadedBlob.blob.type }
                      );
                      if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                          files: [file],
                          title: mediaInfo.title,
                        });
                      }
                    } catch {
                      // ignore cancelled share
                    }
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shrink-0 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Save to Gallery / Share</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
