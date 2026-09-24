import { defineField, defineType } from 'sanity'
import { CheckmarkCircleIcon } from '@sanity/icons'

export const progressType = defineType({
  name: 'progress',
  title: 'Learner Progress',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'Clerk User ID',
      type: 'string',
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'completedLessons',
      title: 'Completed Lessons',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'lesson' }],
        },
      ],
    }),
    defineField({
      name: 'courseProgress',
      title: 'Course Progress & Resume States',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'course',
              title: 'Course',
              type: 'reference',
              to: [{ type: 'course' }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'lastLesson',
              title: 'Last Visited Lesson',
              type: 'reference',
              to: [{ type: 'lesson' }],
            }),
            defineField({
              name: 'lastPositionSeconds',
              title: 'Last Position (Seconds)',
              type: 'number',
            }),
            defineField({
              name: 'updatedAt',
              title: 'Updated At',
              type: 'datetime',
            }),
          ],
          preview: {
            select: {
              title: 'course.title',
              subtitle: 'lastLesson.title',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'userId',
      completedCount: 'completedLessons.length',
    },
    prepare({ title, completedCount }) {
      return {
        title: title ? `Learner: ${title}` : 'Learner Progress',
        subtitle: `${completedCount || 0} completed lessons`,
      }
    },
  },
})
