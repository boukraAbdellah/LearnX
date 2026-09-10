import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons'

export const courseType = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  fields: [
    // Core identity
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
    // Marketing fields
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: 'Short marketing description shown in catalog cards',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
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
      name: 'level',
      title: 'Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: 'popular',
      title: 'Mark as Popular',
      type: 'boolean',
      initialValue: false,
      description: 'Shows a "Popular" badge on the catalog card',
    }),
    defineField({
      name: 'studentCount',
      title: 'Student Count',
      type: 'number',
      description: 'Display-only count (not calculated from learner progress)',
    }),
    // What you'll learn section
    defineField({
      name: 'learningOutcomes',
      title: 'Learning Outcomes',
      description: 'What the learner will be able to do after completing this course',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'learningOutcome',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', description: 'Emoji or icon name' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
    }),
    // Taxonomy
    defineField({
      name: 'instructor',
      title: 'Instructor',
      type: 'reference',
      to: [{ type: 'instructor' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    // Course content (modules with embedded lessons)
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'module',
        }),
      ],
      validation: (rule) => rule.required().min(1).error('A course must have at least one module'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'level',
      media: 'coverImage',
      instructor: 'instructor.name',
    },
    prepare({ title, subtitle, media, instructor }) {
      return {
        title,
        subtitle: [instructor, subtitle].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
