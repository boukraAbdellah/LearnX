import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schema } from './schemaTypes'
import { structure } from './structure'

export default defineConfig({
  name: 'learnx-studio',
  title: 'LearnX Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'br9mxbes',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2026-09-09' }),
  ],

  schema,
})
