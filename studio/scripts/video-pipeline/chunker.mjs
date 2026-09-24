/**
 * Utility functions for parsing caption formats (VTT / SRT / timestamp cues)
 * and chunking into coherent, timestamped transcript pieces.
 */

/**
 * Parse a timestamp string ("01:23", "00:01:23.456", "1:23:45") into total seconds.
 */
export function parseTimestampToSeconds(timestamp) {
  if (typeof timestamp === 'number') return timestamp
  if (!timestamp || typeof timestamp !== 'string') return 0

  const parts = timestamp.trim().replace(',', '.').split(':')
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0
    const minutes = parseFloat(parts[1]) || 0
    const seconds = parseFloat(parts[2]) || 0
    return Math.floor(hours * 3600 + minutes * 60 + seconds)
  }
  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0
    const seconds = parseFloat(parts[1]) || 0
    return Math.floor(minutes * 60 + seconds)
  }
  return Math.floor(parseFloat(timestamp) || 0)
}

/**
 * Format seconds into mm:ss or hh:mm:ss.
 */
export function formatSecondsToTimestamp(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

/**
 * Parse simple WebVTT or SRT formatted string into cue objects.
 * Cues: Array<{ startSeconds: number, endSeconds: number, text: string }>
 */
export function parseVttOrSrt(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return []

  const lines = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const cues = []
  let currentStart = null
  let currentEnd = null
  let currentTextLines = []

  const timeRegex = /((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{1,3})?)\s*-->\s*((?:\d{1,2}:)?\d{2}:\d{2}(?:[.,]\d{1,3})?)/

  for (const line of lines) {
    const trimmed = line.trim()

    // Check for timestamp line
    const match = trimmed.match(timeRegex)
    if (match) {
      if (currentStart !== null && currentTextLines.length > 0) {
        cues.push({
          startSeconds: currentStart,
          endSeconds: currentEnd,
          text: currentTextLines.join(' ').replace(/<[^>]+>/g, '').trim(),
        })
      }
      currentStart = parseTimestampToSeconds(match[1])
      currentEnd = parseTimestampToSeconds(match[2])
      currentTextLines = []
      continue
    }

    // Ignore headers or numeric cue indices
    if (trimmed === 'WEBVTT' || /^\d+$/.test(trimmed) || trimmed === '') {
      if (trimmed === '' && currentStart !== null && currentTextLines.length > 0) {
        cues.push({
          startSeconds: currentStart,
          endSeconds: currentEnd,
          text: currentTextLines.join(' ').replace(/<[^>]+>/g, '').trim(),
        })
        currentStart = null
        currentEnd = null
        currentTextLines = []
      }
      continue
    }

    if (currentStart !== null) {
      currentTextLines.push(trimmed)
    }
  }

  if (currentStart !== null && currentTextLines.length > 0) {
    cues.push({
      startSeconds: currentStart,
      endSeconds: currentEnd,
      text: currentTextLines.join(' ').replace(/<[^>]+>/g, '').trim(),
    })
  }

  return cues
}

/**
 * Chunk raw subtitle cues into short, coherent timestamped chunks.
 *
 * Rules:
 * - A chunk should be roughly 25-45 words or 15-30 seconds long.
 * - Never store whole transcripts in one field.
 * - Retain the startSeconds of the first cue in the group.
 *
 * @param {Array<{ startSeconds: number, endSeconds?: number, text: string }>} cues
 * @returns {Array<{ _key: string, startSeconds: number, text: string }>}
 */
export function groupCuesIntoChunks(cues) {
  if (!Array.isArray(cues) || cues.length === 0) return []

  const chunks = []
  let chunkStart = cues[0].startSeconds
  let buffer = []
  let wordCount = 0

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i]
    const text = (cue.text || '').trim()
    if (!text) continue

    if (buffer.length === 0) {
      chunkStart = cue.startSeconds
    }

    buffer.push(text)
    const words = text.split(/\s+/).length
    wordCount += words

    const durationElapsed = cue.endSeconds ? cue.endSeconds - chunkStart : 0
    const isSentenceEnd = /[.!?]$/.test(text)
    const nextCuePause = cues[i + 1] ? (cues[i + 1].startSeconds - (cue.endSeconds || cue.startSeconds)) > 4 : false

    if ((wordCount >= 30 && isSentenceEnd) || wordCount >= 50 || durationElapsed >= 30 || nextCuePause || i === cues.length - 1) {
      const combinedText = buffer.join(' ').replace(/\s+/g, ' ').trim()
      if (combinedText) {
        chunks.push({
          _key: `chunk-${chunks.length}`,
          startSeconds: Math.floor(chunkStart),
          text: combinedText,
        })
      }
      buffer = []
      wordCount = 0
    }
  }

  return chunks
}

/**
 * Derive a valid Sanity document ID from a video URL.
 * Strips any characters the datastore rejects (allowed: a-z, A-Z, 0-9, _, -, .).
 */
export function deriveVideoDocumentId(videoUrl) {
  if (!videoUrl || typeof videoUrl !== 'string') return 'video.unknown'
  const clean = videoUrl
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-zA-Z0-9_.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `video.${clean}`.slice(0, 120)
}
