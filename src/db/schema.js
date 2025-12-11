import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core'
import { text } from "body-parser";

export const userTable = sqliteTable('users', {
    idUser: text().primaryKey().$defaultFn( () => uuidv4()),
    firstName : text({length:30}).notNull(),
    name : text({length:30}).notNull(),
    email: text().notNull().unique(),
    password: text({length:255}).notNull(),
    isAdmin: integer({mode: 'boolean'}),
    createdAt: integer('created_at', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
})

export const cardTable = sqliteTable('cards', {
    idCard: text().primaryKey().$defaultFn( () => uuidv4()),
    title : text({length:255}).notNull(),
    description : text({length:255}),
    isPrivate: integer({mode: 'boolean'}),
    idUser: integer("idUser").references(() => userTable.idUser),
    createdAt: integer('created_at', {node: 'timestamp'}).notNull().$defaultFn(() => new Date()),
})
