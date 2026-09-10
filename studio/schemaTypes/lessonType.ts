import { defineArrayMember, defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const lessonType = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or Bunny embed URL',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid http/https URL'),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail / Poster',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Total video duration in seconds',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'freePreview',
      title: 'Free Preview',
      type: 'boolean',
      initialValue: false,
      description: 'If enabled, this lesson is viewable without enrollment',
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count',
      type: 'number',
      description: 'Display-only count (not calculated)',
    }),
    // Rich text notes
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  }),
                  defineField({
                    name: 'blank',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: true,
                  }),
                ],
              }),
            ],
          },
        }),
        // Code blocks
        defineArrayMember({
          type: 'object',
          name: 'codeBlock',
          title: 'Code Block',
          fields: [
            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  { title: 'TypeScript', value: 'typescript' },
                  { title: 'JavaScript', value: 'javascript' },
                  { title: 'JSX', value: 'jsx' },
                  { title: 'TSX', value: 'tsx' },
                  { title: 'CSS', value: 'css' },
                  { title: 'HTML', value: 'html' },
                  { title: 'Bash', value: 'bash' },
                  { title: 'JSON', value: 'json' },
                ],
              },
            }),
            defineField({ name: 'code', title: 'Code', type: 'text' }),
          ],
          preview: {
            select: { title: 'language', subtitle: 'code' },
            prepare({ title, subtitle }) {
              return {
                title: `Code: ${title ?? 'unknown'}`,
                subtitle: subtitle?.slice(0, 60) ?? '',
              }
            },
          },
        }),
      ],
    }),
    // Key points (In this lesson you will...)
    defineField({
      name: 'keyPoints',
      title: 'Key Points',
      description: 'Short list of what the learner will learn in this lesson',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    // Pro tip
    defineField({
      name: 'proTip',
      title: 'Pro Tip',
      type: 'text',
      rows: 3,
      description: 'Optional highlighted tip shown alongside the lesson',
    }),
    // Resources
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'resource',
          fields: [
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Link', value: 'link' },
                  { title: 'Article', value: 'article' },
                  { title: 'Video', value: 'video' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'Tool / Library', value: 'tool' },
                  { title: 'Documentation', value: 'docs' },
                ],
                layout: 'dropdown',
              },
            }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'type' },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'videoUrl',
      media: 'thumbnail',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `🎬 ${subtitle}` : '(no video)',
        media,
      }
    },
  },
})
