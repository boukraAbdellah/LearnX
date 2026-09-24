import { type SchemaTypeDefinition } from 'sanity'

import { categoryType } from './categoryType'
import { courseType } from './courseType'
import { instructorType } from './instructorType'
import { lessonType } from './lessonType'
import { moduleType } from './moduleType'
import { progressType } from './progressType'
import { videoType } from './videoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  // Order matters: dependent types must come before types that reference them.
  // category and instructor before course; lesson before module; module before course; video and progress independent.
  types: [categoryType, instructorType, lessonType, moduleType, courseType, videoType, progressType],
}

