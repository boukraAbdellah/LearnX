import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Public client — CDN-backed, no token.
 * Safe to use in Server Components; do NOT pass a token here.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

/**
 * Server-only client — bypasses CDN, uses the viewer token.
 * Import ONLY inside Server Components, route handlers, or server actions.
 * NEVER import this in 'use client' files or expose it to the browser.
 */
export const serverClient = client.withConfig({
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

/**
 * Server-only write client — uses editor/write token for progress and data mutations.
 * Import ONLY inside API routes or server actions.
 * NEVER expose to the browser.
 */
export const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

