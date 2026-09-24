import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const videoType = defineType({
  name: 'video',
  title: 'Video Intelligence',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
      description: 'Canonical video URL (YouTube, Vimeo, Bunny Stream)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Bunny Stream', value: 'bunny' },
          { title: 'Custom / Other', value: 'custom' },
        ],
      },
    }),
    defineField({
      name: 'title',
      title: 'Video Title',
      type: 'string',
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'chapters',
      title: 'Chapters (Table of Contents)',
      description: 'Ordered list of chapter markers with start timestamps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chapter',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Seconds',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'label',
              title: 'Chapter Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'startSeconds',
            },
            prepare({ title, subtitle }) {
              const sec = subtitle ?? 0
              const m = Math.floor(sec / 60)
              const s = Math.floor(sec % 60)
              const time = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
              return {
                title: title || 'Untitled Chapter',
                subtitle: `At ${time} (${sec}s)`,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'chunks',
      title: 'Transcript Chunks',
      description: 'Timestamped transcript segments (short pieces, never monolithic)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chunk',
          fields: [
            defineField({
              name: 'startSeconds',
              title: 'Start Seconds',
              type: 'number',
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: 'text',
              title: 'Chunk Text',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'text',
              subtitle: 'startSeconds',
            },
            prepare({ title, subtitle }) {
              const sec = subtitle ?? 0
              const m = Math.floor(sec / 60)
              const s = Math.floor(sec % 60)
              const time = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
              return {
                title: title ? (title.length > 60 ? `${title.slice(0, 57)}...` : title) : 'Empty chunk',
                subtitle: `At ${time} (${sec}s)`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Video',
        subtitle: subtitle || 'No URL',
      }
    },
  },
})
