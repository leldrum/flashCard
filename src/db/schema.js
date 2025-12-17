import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Users Table
export const usersTable = sqliteTable('users', {
  id: text().primaryKey(),
  username: text({ length: 30 }).notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  role: text({ enum: ['user', 'admin'] }).notNull().default('user'),
  createdAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull()
})

// Collections Table
export const collectionsTable = sqliteTable('collections', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text({ length: 255 }).notNull(),
  description: text(),
  isPublic: integer({ mode: 'boolean' }).default(false).notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull()
})

// Flashcards Table
export const flashcardsTable = sqliteTable('flashcards', {
  id: text().primaryKey(),
  collectionId: text()
    .notNull()
    .references(() => collectionsTable.id, { onDelete: 'cascade' }),
  front: text().notNull(),
  back: text().notNull(),
  frontUrl: text(),
  backUrl: text(),
  level: integer().default(1).notNull(),
  lastReviewedAt: integer({ mode: 'timestamp' }),
  nextReviewAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull()
})

// User Progress Table (for public collections)
export const userProgressTable = sqliteTable('user_progress', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  flashcardId: text()
    .notNull()
    .references(() => flashcardsTable.id, { onDelete: 'cascade' }),
  level: integer().default(1).notNull(),
  lastReviewedAt: integer({ mode: 'timestamp' }),
  nextReviewAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: integer({ mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull()
})

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  collections: many(collectionsTable),
  progress: many(userProgressTable)
}))

export const collectionsRelations = relations(
  collectionsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [collectionsTable.userId],
      references: [usersTable.id]
    }),
    flashcards: many(flashcardsTable)
  })
)

export const flashcardsRelations = relations(
  flashcardsTable,
  ({ one, many }) => ({
    collection: one(collectionsTable, {
      fields: [flashcardsTable.collectionId],
      references: [collectionsTable.id]
    }),
    userProgress: many(userProgressTable)
  })
)

export const userProgressRelations = relations(
  userProgressTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [userProgressTable.userId],
      references: [usersTable.id]
    }),
    flashcard: one(flashcardsTable, {
      fields: [userProgressTable.flashcardId],
      references: [flashcardsTable.id]
    })
  })
)
