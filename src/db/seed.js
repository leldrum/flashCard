import bcrypt from 'bcrypt';
import { db } from './db.js';
import { cardTable, collectionTable, userTable, levelTable, revisionTable } from './schema.js';

async function seed() {
    try {
        console.log('Seeding database..');

        await db.delete(revisionTable);
        await db.delete(cardTable);
        await db.delete(collectionTable);
        await db.delete(userTable);
        await db.delete(levelTable);
      

        const mdpHash1 = await bcrypt.hash('Password123!', 12);
        const mdpHash2 = await bcrypt.hash('Password123!', 12);

        const seedUsers = [
            {
                firstName: 'Alice',
                name: 'Durand',
                email: 'alice@example.com',
                password: mdpHash1,
                isAdmin: true,
            },
            {
                firstName: 'Bruno',
                name: 'Martin',
                email: 'bruno@example.com',
                password: mdpHash2,
                isAdmin: false,
            },
        ];

        const insertedUsers = await db.insert(userTable).values(seedUsers).returning();

        const seedCollections = [
            {
                title: 'Vocabulaire Anglais',
                description: 'Collection de mots anglais pour débutants',
                isPrivate: false,
                idUser: insertedUsers[0].idUser,
            },
            {
                title: 'Capitales du Monde',
                description: 'Apprendre les capitales des pays du monde',
                isPrivate: false,
                idUser: insertedUsers[0].idUser,
            },
            {
                title: 'Formules Mathématiques',
                description: 'Formules essentielles pour les examens',
                isPrivate: true,
                idUser: insertedUsers[1].idUser,
            },
            {
                title: 'Histoire de France',
                description: 'Dates et événements importants',
                isPrivate: false,
                idUser: insertedUsers[1].idUser,
            },
            {
                title: 'Programmation JavaScript',
                description: 'Concepts clés en JavaScript',
                isPrivate: false,
                idUser: insertedUsers[0].idUser,
            },
        ];

        const seedLevels = [
            {
                level: '1',
                delay: '1',
            },
            {
                level: '2',
                delay: '2',
            },
            {
                level: '3',
                delay: '4',
            },
            {
                level: '4',
                delay: '8',
            },
            {
                level: '5',
                delay: '16',
            },
        ];

        const insertedLevels = await db.insert(levelTable).values(seedLevels).returning();

        const insertedCollections = await db.insert(collectionTable).values(seedCollections).returning();

        const seedCards = [
            {
                frontText: 'Dog',
                backText: 'Chien',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[0].idCollection,
            },
            {
                frontText: 'Cat',
                backText: 'Chat',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[0].idCollection,
            },
            {
                frontText: 'House',
                backText: 'Maison',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[0].idCollection,
            },
            {
                frontText: 'Water',
                backText: 'Eau',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[0].idCollection,
            },
            {
                frontText: 'Paris',
                backText: 'France',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[1].idCollection,
            },
            {
                frontText: 'Berlin',
                backText: 'Allemagne',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[1].idCollection,
            },
            {
                frontText: 'Tokyo',
                backText: 'Japon',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[1].idCollection,
            },
            {
                frontText: 'E = mc²',
                backText: 'Énergie masse-lumière',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[2].idCollection,
            },
            {
                frontText: 'a² + b² = c²',
                backText: 'Théorème de Pythagore',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[2].idCollection,
            },
            {
                frontText: '1789',
                backText: 'Révolution française',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[3].idCollection,
            },
            {
                frontText: '1945',
                backText: 'Fin de la Seconde Guerre mondiale',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[3].idCollection,
            },
            {
                frontText: 'Array.map()',
                backText: 'Crée un nouveau tableau en appliquant une fonction à chaque élément',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[4].idCollection,
            },
            {
                frontText: 'Array.filter()',
                backText: 'Crée un nouveau tableau avec les éléments qui passent un test',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[4].idCollection,
            },
            {
                frontText: 'Promise',
                backText: 'Objet représentant une opération asynchrone',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[4].idCollection,
            },
        ];

        const insertedCards = await db.insert(cardTable).values(seedCards).returning();

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
        const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const seedRevisions = [
          
            {
                idCard: insertedCards[0].idCard, 
                idLevel: insertedLevels[2].idLevel,
                idUser: insertedUsers[0].idUser,
                lastRevision: fourDaysAgo,
            },
            {
                idCard: insertedCards[1].idCard, 
                idLevel: insertedLevels[1].idLevel,
                idUser: insertedUsers[0].idUser,
                lastRevision: twoDaysAgo,
            },
            {
                idCard: insertedCards[2].idCard, 
                idLevel: insertedLevels[0].idLevel, 
                idUser: insertedUsers[0].idUser,
                lastRevision: oneDayAgo,
            },
            {
                idCard: insertedCards[3].idCard, 
                idLevel: insertedLevels[0].idLevel, 
                idUser: insertedUsers[0].idUser,
                lastRevision: now,
            },
            {
                idCard: insertedCards[4].idCard, 
                idLevel: insertedLevels[3].idLevel, 
                idUser: insertedUsers[0].idUser,
                lastRevision: sevenDaysAgo,
            },
            {
                idCard: insertedCards[5].idCard, 
                idLevel: insertedLevels[1].idLevel, 
                idUser: insertedUsers[0].idUser,
                lastRevision: oneDayAgo,
            },
            {
                idCard: insertedCards[9].idCard, 
                idLevel: insertedLevels[2].idLevel, 
                idUser: insertedUsers[1].idUser,
                lastRevision: fourDaysAgo,
            },
            {
                idCard: insertedCards[10].idCard, 
                idLevel: insertedLevels[0].idLevel, 
                idUser: insertedUsers[1].idUser,
                lastRevision: oneDayAgo,
            },
           
            {
                idCard: insertedCards[11].idCard, 
                idLevel: insertedLevels[4].idLevel, 
                idUser: insertedUsers[0].idUser,
                lastRevision: sevenDaysAgo,
            },
            {
                idCard: insertedCards[12].idCard, 
                idLevel: insertedLevels[1].idLevel, 
                idUser: insertedUsers[0].idUser,
                lastRevision: twoDaysAgo,
            },
        ];

        await db.insert(revisionTable).values(seedRevisions);
        console.log('Database seeded successfully!');
    
    } catch (error) {
        console.log(' Error seeding database', error);
    }
}

seed();
