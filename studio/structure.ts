import type { StructureResolver } from 'sanity/structure'

/**
 * Explicit Studio structure for LearnX.
 * Two sections: Course Content and Taxonomy — with a divider between them.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('LearnX')
    .items([
      // ── Course Content ───────────────────────────────────────────────────────
      S.listItem()
        .title('Courses')
        .schemaType('course')
        .child(S.documentTypeList('course').title('All Courses')),

      S.listItem()
        .title('Lessons')
        .schemaType('lesson')
        .child(S.documentTypeList('lesson').title('All Lessons')),

      S.divider(),

      // ── Taxonomy ─────────────────────────────────────────────────────────────
      S.listItem()
        .title('Instructors')
        .schemaType('instructor')
        .child(S.documentTypeList('instructor').title('All Instructors')),

      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(S.documentTypeList('category').title('All Categories')),

      S.divider(),

      // ── Video Intelligence ───────────────────────────────────────────────────
      S.listItem()
        .title('Video Intelligence')
        .schemaType('video')
        .child(S.documentTypeList('video').title('Video Documents')),
    ])
