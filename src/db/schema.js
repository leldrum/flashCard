import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid';

export const userTable = sqliteTable('users', {
    idUser: text().primaryKey().$defaultFn( () => uuidv4()),
    firstName : text({length:30}).notNull(),
    name : text({length:30}).notNull(),
    email: text().notNull().unique(),
    password: text({length:255}).notNull(),
    isAdmin: integer({mode: 'boolean'}).notNull(),
    createdAt: integer('created_at', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
})

export const collectionTable = sqliteTable('collections', {
    idCollection: text().primaryKey().$defaultFn( () => uuidv4()),
    title : text({length:255}).notNull(),
    description : text({length:255}).notNull(),
    isPrivate: integer({mode: 'boolean'}).notNull(),
    idUser: integer("idUser").references(() => userTable.idUser).notNull(),
    createdAt: integer('created_at', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
})

export const cardTable = sqliteTable('cards', {
    idCard: text().primaryKey().$defaultFn( () => uuidv4()),
    frontText : text({length:255}).notNull(),
    backText : text({length:255}).notNull(),
    frontUrl : text({length:255}),
    backUrl : text({length:255}),
    idCollection: integer("idCollection").references(() => collectionTable.idCollection).notNull(),
    createdAt: integer('created_at', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
})

export const revisionTable = sqliteTable('revisions', {
    idRevision: text().primaryKey().$defaultFn( () => uuidv4()),
    idCard : integer("idCard").references(() => cardTable.idCard).notNull(),
    idLevel: integer("idLevel").references(() => levelTable.idLevel).notNull(),
    idUser: integer("idUser").references(() => userTable.idUser).notNull(),
    lastRevision: integer('lastRevision', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
    createdAt: integer('created_at', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
})

export const levelTable = sqliteTable('levels', {
    idLevel : text().primaryKey().$defaultFn( () => uuidv4()),
    title : text({length:255}).notNull(),
    description : text({length:255}).notNull(),
    isPrivate: integer({mode: 'boolean'}).notNull(),
    idUser: integer("idUser").references(() => userTable.idUser).notNull(),
    createdAt: integer('created_at', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
})
