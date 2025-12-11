#!/usr/bin/env node

import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './src/db/schema.js'

dotenv.config()

async function initDb() {
  try {
    const client = createClient({
      url: process.env.DATABASE_URL || 'file:local.db'
    })

    const db = drizzle(client, { schema })

    console.log('Base de données initialisée avec succès')
    process.exit(0)
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    process.exit(1)
  }
}

initDb()
