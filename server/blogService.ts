import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface BlogPostItem {
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

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'blog_posts.json');

const INITIAL_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'post-1',
    slug: 'how-to-download-high-resolution-4k-video-2026',
    title: 'How to Download High-Resolution 4K & 1080p Video Streams in 2026',
    excerpt: 'A comprehensive walkthrough on how modern web streams, dynamic DASH/HLS manifests, and progressive MP4 containers work across mobile and desktop.',
    content: `### The Evolution of Modern Web Video Streaming

In the early days of the web, downloading video was as straightforward as locating a direct \`.mp4\` or \`.flv\` file link on a web page and saving it to local storage. However, today's video streaming giants—such as YouTube, Vimeo, TikTok, and Instagram—utilize dynamic adaptive streaming protocols like **DASH (Dynamic Adaptive Streaming over HTTP)** and **HLS (HTTP Live Streaming)**.

#### Why 1080p and 4K Separate Audio and Video
When you watch a video at 1080p, 1440p, or 4K resolution on modern platforms, the video tracks and audio tracks are usually delivered in completely separate segments to conserve bandwidth:
- **Adaptive Bitrate Streaming**: If your network speed fluctuates, the player seamlessly switches between 720p, 1080p, or 4K streams without interrupting the audio track.
- **Multiplexing on the Fly**: To provide you with a single downloadable file, downloader engines must either retrieve pre-merged progressive MP4 containers or dynamically proxy the stream with proper container headers.

#### Tips for Downloading High-Fidelity Streams
1. **Always verify resolution**: Check whether the extracted format lists 1080p or 720p with audio included.
2. **Use direct browser download**: Look for clean streaming proxies that output \`Content-Disposition: attachment\` so your mobile device saves directly to your Photos or Files app without buffering in an in-app browser.
3. **Respect creator permissions**: Ensure you download content with creator permission, fair use, or creative commons licenses.`,
    category: 'Guides & Tutorials',
    author: 'Streaming Engine Team',
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-20T10:00:00.000Z',
    readTime: '4 min read',
    status: 'published',
    tags: ['Video Streaming', '4K Resolution', 'MP4', 'Tech Guide']
  },
  {
    id: 'post-2',
    slug: 'extracting-high-fidelity-audio-from-social-media',
    title: 'The Ultimate Guide to Extracting Pristine Audio from Public Media Links',
    excerpt: 'Extract 320kbps MP3 and high-clarity AAC sound bites from podcasts, background tracks, and viral reels with zero sound degradation.',
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
    category: 'Audio Production',
    author: 'Audio Engineering Lab',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-18T14:30:00.000Z',
    readTime: '3 min read',
    status: 'published',
    tags: ['Audio', 'MP3', 'SoundCloud', 'Podcast']
  },
  {
    id: 'post-3',
    slug: 'understanding-video-codecs-mp4-webm-av1',
    title: 'Understanding Modern Video Codecs: H.264, VP9, and AV1 Explained',
    excerpt: 'A deep dive into compression efficiency, hardware decoding support, and why AV1 is poised to replace traditional codecs across mobile platforms.',
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
    category: 'Codec & Compression',
    author: 'Performance Architect',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-15T09:15:00.000Z',
    readTime: '5 min read',
    status: 'published',
    tags: ['Codecs', 'H.264', 'AV1', 'Video Quality']
  },
  {
    id: 'post-4',
    slug: 'privacy-first-downloading-zero-log-architecture',
    title: 'Privacy-First Downloading: Why Zero-Log Ephemeral Fetching Matters',
    excerpt: 'Why we never store downloaded media files or search histories on disk, ensuring 100% ephemeral processing and total user privacy.',
    content: `### True Ephemeral Processing: No Logs, No Data Retention

In an era of rampant surveillance and unauthorized data broker collection, online utility services often abuse user trust by collecting search queries, IP addresses, and uploaded URLs.

#### The Quick Downloader Security Model
Quick Downloader was built from day one around **Zero-Log Ephemeral Architecture**:
- **In-Memory Pipe Streaming**: Media streams are chunk-proxied directly from upstream CDNs to your client browser. No file ever touches our permanent server storage.
- **Client-Side History**: Your download history resides exclusively inside your own browser's \`localStorage\`. We have zero tracking databases for user activity.
- **Strict HTTPS End-to-End**: Every single request is encrypted using modern TLS 1.3 standards.

Enjoy high-speed media downloading with the confidence that your private viewing habits remain strictly yours.`,
    category: 'Privacy & Security',
    author: 'Security & Infrastructure Lead',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    publishedAt: '2026-10-12T16:00:00.000Z',
    readTime: '3 min read',
    status: 'published',
    tags: ['Privacy', 'Security', 'Zero-Log', 'Encryption']
  }
];

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_BLOG_POSTS, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring blog data file:', err);
  }
}

export function getAllPosts(includeDrafts = false): BlogPostItem[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const posts: BlogPostItem[] = JSON.parse(raw);
    if (includeDrafts) {
      return posts;
    }
    return posts.filter((p) => p.status === 'published');
  } catch (err) {
    console.error('Error reading blog posts:', err);
    return INITIAL_BLOG_POSTS.filter((p) => includeDrafts || p.status === 'published');
  }
}

export function getPostBySlugOrId(identifier: string): BlogPostItem | null {
  const posts = getAllPosts(true);
  return posts.find((p) => p.slug === identifier || p.id === identifier) || null;
}

export function savePost(post: Omit<BlogPostItem, 'id' | 'publishedAt'> & { id?: string }): BlogPostItem {
  ensureDataFile();
  const posts = getAllPosts(true);
  const now = new Date().toISOString();

  if (post.id) {
    // Update existing
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      const updated: BlogPostItem = {
        ...posts[index],
        ...post,
        id: post.id,
        updatedAt: now,
      };
      posts[index] = updated;
      fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
      return updated;
    }
  }

  // Create new
  const newId = `post-${Date.now()}`;
  const slug = post.slug?.trim() 
    ? post.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') 
    : post.title.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

  const newPost: BlogPostItem = {
    ...post,
    id: newId,
    slug: slug || `post-${Date.now()}`,
    publishedAt: now,
    status: post.status || 'published',
    readTime: post.readTime || '3 min read',
    tags: post.tags || ['Media', 'Tech'],
  };

  posts.unshift(newPost);
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  return newPost;
}

export function deletePost(id: string): boolean {
  ensureDataFile();
  const posts = getAllPosts(true);
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length !== posts.length) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}
