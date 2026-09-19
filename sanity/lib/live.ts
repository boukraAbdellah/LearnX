// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'

/**
 * For private datasets the client passed to defineLive must carry the
 * read token, otherwise sanityFetch GROQ queries return nothing.
 * serverToken covers the Live Content API websocket only.
 */
const privateClient = client.withConfig({
  token: process.env.SANITY_API_READ_TOKEN,
})

export const { sanityFetch, SanityLive } = defineLive({
  client: privateClient,
  // Required for the Live Content API to work with a private dataset.
  // Never expose the read token to the browser — defineLive handles this safely.
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: false,
})
