import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'br9mxbes',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /**
   * Enable auto-generation of source maps for improved stack traces
   * (See .sanity/runtime/ for generated files)
   */
  autoUpdates: true,
})
