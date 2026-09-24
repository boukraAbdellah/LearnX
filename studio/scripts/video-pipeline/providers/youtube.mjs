import { parseTimestampToSeconds, groupCuesIntoChunks } from '../chunker.mjs'

/**
 * Extract YouTube 11-character video ID from a URL.
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  )
  return match ? match[1] : null
}

/**
 * Parse chapter markers from a text description containing timestamps.
 * e.g. "00:00 - Introduction\n01:30 - Setting up Next.js\n04:15 - Server Actions"
 */
export function parseChaptersFromDescription(text) {
  if (!text || typeof text !== 'string') return []
  const lines = text.split('\n')
  const chapters = []

  // Matches "00:00 Introduction" or "00:00 - Introduction" or "[01:30] Something"
  const chapterRegex = /(?:\[|\()?\s*((?:\d{1,2}:)?\d{1,2}:\d{2})\s*(?:\]|\))?\s*[-–—:]?\s*(.+)/

  for (const line of lines) {
    const trimmed = line.trim()
    const match = trimmed.match(chapterRegex)
    if (match) {
      const timestamp = match[1]
      const label = match[2].trim().replace(/^[-–—:]\s*/, '')
      if (label && label.length > 2) {
        chapters.push({
          _key: `chap-${chapters.length}`,
          startSeconds: parseTimestampToSeconds(timestamp),
          label,
        })
      }
    }
  }

  return chapters
}

/**
 * Ingest YouTube video metadata and captions.
 * In offline environments or when YouTube rate limits, returns structured cues or falls back gracefully.
 */
export async function ingestYouTubeVideo(videoUrl, options = {}) {
  const videoId = extractYouTubeId(videoUrl)
  if (!videoId) {
    throw new Error(`Invalid YouTube URL: ${videoUrl}`)
  }

  let title = options.title || `YouTube Video ${videoId}`
  let chapters = []
  let chunks = []

  // Try to fetch public caption track or description if network is accessible
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1200)
    const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (pageRes.ok) {
      const html = await pageRes.text()

      // 1. Try to extract title from page
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/ - YouTube$/, '').trim()
      }

      // 2. Try to extract chapters from video description in playerResponse
      const descMatch = html.match(/"shortDescription":"(.*?)"/)
      if (descMatch && descMatch[1]) {
        const unescapedDesc = JSON.parse(`"${descMatch[1]}"`)
        const parsedChapters = parseChaptersFromDescription(unescapedDesc)
        if (parsedChapters.length > 0) {
          chapters = parsedChapters
        }
      }

      // 3. Try to extract timedtext caption tracks
      const captionMatch = html.match(/"captionTracks":\s*(\[.*?\])/)
      if (captionMatch && captionMatch[1]) {
        const tracks = JSON.parse(captionMatch[1])
        const englishTrack = tracks.find((t) => t.languageCode === 'en' || t.vssId?.includes('en')) || tracks[0]
        if (englishTrack && englishTrack.baseUrl) {
          const capRes = await fetch(englishTrack.baseUrl)
          if (capRes.ok) {
            const xml = await capRes.text()
            // Parse XML text cues: <text start="1.23" dur="4.56">hello</text>
            const cueRegex = /<text\s+start="([\d.]+)"(?:\s+dur="([\d.]+)")?>([\s\S]*?)<\/text>/g
            const cues = []
            let m
            while ((m = cueRegex.exec(xml)) !== null) {
              const start = parseFloat(m[1])
              const dur = parseFloat(m[2] || '3')
              const rawText = m[3]
                .replace(/&amp;/g, '&')
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/\n/g, ' ')
                .trim()
              if (rawText) {
                cues.push({
                  startSeconds: start,
                  endSeconds: start + dur,
                  text: rawText,
                })
              }
            }

            if (cues.length > 0) {
              chunks = groupCuesIntoChunks(cues)
            }
          }
        }
      }
    }
  } catch {
    // Network or scraping failed, gracefully fall back to authored / grounded metadata
  }

  return {
    provider: 'youtube',
    videoId,
    title,
    chapters,
    chunks,
  }
}
