import { parseVttOrSrt, groupCuesIntoChunks, parseTimestampToSeconds } from '../chunker.mjs'

/**
 * Extract Bunny Stream IDs from URL.
 * Supports: https://iframe.mediadelivery.net/embed/{libraryId}/{videoId}
 * or https://video.bunnycdn.com/play/{libraryId}/{videoId}
 */
export function extractBunnyInfo(url) {
  if (!url || typeof url !== 'string') return null
  const match = url.match(/(?:mediadelivery\.net\/embed|bunnycdn\.com\/play)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/i)
  if (match) {
    return {
      libraryId: match[1],
      videoId: match[2],
    }
  }
  return null
}

/**
 * Ingest Bunny Stream metadata, chapters, and captions.
 */
export async function ingestBunnyVideo(videoUrl, options = {}) {
  const bunnyInfo = extractBunnyInfo(videoUrl)
  let title = options.title || (bunnyInfo ? `Bunny Stream ${bunnyInfo.videoId}` : 'Bunny Stream Video')
  let chapters = []
  let chunks = []

  // If VTT caption track is provided or accessible
  if (options.vttUrl) {
    try {
      const res = await fetch(options.vttUrl)
      if (res.ok) {
        const text = await res.text()
        const cues = parseVttOrSrt(text)
        chunks = groupCuesIntoChunks(cues)
      }
    } catch {
      // Fallback
    }
  } else if (options.vttContent) {
    const cues = parseVttOrSrt(options.vttContent)
    chunks = groupCuesIntoChunks(cues)
  }

  if (Array.isArray(options.chapters)) {
    chapters = options.chapters.map((chap, idx) => ({
      _key: `chap-${idx}`,
      startSeconds: typeof chap.startSeconds === 'number' ? chap.startSeconds : parseTimestampToSeconds(chap.startSeconds),
      label: chap.label || chap.title || `Chapter ${idx + 1}`,
    }))
  }

  return {
    provider: 'bunny',
    bunnyInfo,
    title,
    chapters,
    chunks,
  }
}
