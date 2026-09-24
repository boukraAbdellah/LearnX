import { parseVttOrSrt, groupCuesIntoChunks, parseTimestampToSeconds } from '../chunker.mjs'

/**
 * Extract Vimeo video ID from URL.
 */
export function extractVimeoId(url) {
  if (!url || typeof url !== 'string') return null
  const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i)
  return match ? match[1] : null
}

/**
 * Ingest Vimeo video metadata, chapters, and captions.
 */
export async function ingestVimeoVideo(videoUrl, options = {}) {
  const videoId = extractVimeoId(videoUrl)
  if (!videoId) {
    throw new Error(`Invalid Vimeo URL: ${videoUrl}`)
  }

  let title = options.title || `Vimeo Video ${videoId}`
  let chapters = []
  let chunks = []

  // Attempt to fetch Vimeo config / oEmbed
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const oembedRes = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`, {
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (oembedRes.ok) {
      const data = await oembedRes.json()
      if (data.title) title = data.title
    }
  } catch {
    // Graceful fallback
  }

  // If options provide raw VTT content or chapter markers (e.g. from Vimeo text tracks)
  if (options.vttContent) {
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
    provider: 'vimeo',
    videoId,
    title,
    chapters,
    chunks,
  }
}
