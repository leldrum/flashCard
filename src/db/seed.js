import bcrypt from 'bcrypt';
import { db } from './db.js';
import { cardTable, collectionTable, userTable, levelTable, revisionTable } from './schema.js';

async function seed() {
    try {
        console.log('Seeding database...');

        await db.delete(revisionTable);
        await db.delete(cardTable);
        await db.delete(collectionTable);
        await db.delete(userTable);
        await db.delete(levelTable);
      
        // Créer plusieurs utilisateurs
        const passwords = ['Password123!', 'SecurePass456!', 'MyFlashCards789!'];
        const hashedPasswords = await Promise.all(passwords.map(pwd => bcrypt.hash(pwd, 12)));

        const seedUsers = [
            {
                firstName: 'Alice',
                name: 'Durand',
                email: 'alice@example.com',
                password: hashedPasswords[0],
                isAdmin: true,
            },
            {
                firstName: 'Bruno',
                name: 'Martin',
                email: 'bruno@example.com',
                password: hashedPasswords[1],
                isAdmin: false,
            },
            {
                firstName: 'Claire',
                name: 'Bernard',
                email: 'claire@example.com',
                password: hashedPasswords[2],
                isAdmin: false,
            },
        ];

        const insertedUsers = await db.insert(userTable).values(seedUsers).returning();

        const seedCollections = [
            // Collections d'Alice (Admin)
            {
                title: 'Vocabulaire Anglais - Niveau A1',
                description: 'Collection de mots anglais pour débutants - animaux, objets du quotidien',
                isPrivate: false,
                idUser: insertedUsers[0].idUser,
            },
            {
                title: 'Capitales du Monde',
                description: 'Apprendre les capitales des pays du monde entier',
                isPrivate: false,
                idUser: insertedUsers[0].idUser,
            },
            {
                title: 'Programmation JavaScript',
                description: 'Concepts clés et méthodes essentielles en JavaScript',
                isPrivate: false,
                idUser: insertedUsers[0].idUser,
            },
            // Collections de Bruno
            {
                title: 'Formules Mathématiques',
                description: 'Formules essentielles pour les examens de mathématiques',
                isPrivate: true,
                idUser: insertedUsers[1].idUser,
            },
            {
                title: 'Histoire de France',
                description: 'Dates et événements importants de l\'histoire française',
                isPrivate: false,
                idUser: insertedUsers[1].idUser,
            },
            // Collections de Claire
            {
                title: 'Espagnol - Vocabulaire Basique',
                description: 'Mots et expressions essentiels en espagnol',
                isPrivate: false,
                idUser: insertedUsers[2].idUser,
            },
            {
                title: 'Géographie Physique',
                description: 'Fleuves, montagnes, océans et phénomènes naturels',
                isPrivate: false,
                idUser: insertedUsers[2].idUser,
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
            // === Vocabulaire Anglais - Niveau A1 (Collection 0) ===
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
                frontText: 'Apple',
                backText: 'Pomme',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[0].idCollection,
            },
            // === Capitales du Monde (Collection 1) ===
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
                frontText: 'Madrid',
                backText: 'Espagne',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[1].idCollection,
            },
            {
                frontText: 'Rome',
                backText: 'Italie',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[1].idCollection,
            },
            // === JavaScript (Collection 2) ===
            {
                frontText: 'Array.map()',
                backText: 'Crée un nouveau tableau en appliquant une fonction à chaque élément',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[2].idCollection,
            },
            {
                frontText: 'Array.filter()',
                backText: 'Crée un nouveau tableau avec les éléments qui passent un test',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[2].idCollection,
            },
            {
                frontText: 'Promise',
                backText: 'Objet représentant une opération asynchrone qui aboutira à succès ou à un échec',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[2].idCollection,
            },
            {
                frontText: 'async/await',
                backText: 'Syntaxe pour gérer les promesses de manière synchrone',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[2].idCollection,
            },
            // === Mathématiques (Collection 3) ===
            {
                frontText: 'a² + b² = c²',
                backText: 'Théorème de Pythagore',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[3].idCollection,
            },
            {
                frontText: 'sin²θ + cos²θ = 1',
                backText: 'Identité trigonométrique fondamentale',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[3].idCollection,
            },
            // === Histoire de France (Collection 4) ===
            {
                frontText: '1789',
                backText: 'Révolution française - prise de la Bastille',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[4].idCollection,
            },
            {
                frontText: '1804',
                backText: 'Napoléon Bonaparte devient Empereur',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[4].idCollection,
            },
            {
                frontText: '1914-1918',
                backText: 'Première Guerre mondiale',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[4].idCollection,
            },
            // === Espagnol (Collection 5) ===
            {
                frontText: 'Hola',
                backText: 'Bonjour',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[5].idCollection,
            },
            {
                frontText: 'Gracias',
                backText: 'Merci',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[5].idCollection,
            },
            {
                frontText: 'Sí',
                backText: 'Oui',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[5].idCollection,
            },
            // === Géographie Physique (Collection 6) ===
            {
                frontText: 'Nil',
                backText: 'Plus long fleuve du monde (Afrique)',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[6].idCollection,
            },
            {
                frontText: 'Everest',
                backText: 'Plus haute montagne du monde',
                frontUrl: null,
                backUrl: null,
                idCollection: insertedCollections[6].idCollection,
            },
        ];

        const insertedCards = await db.insert(cardTable).values(seedCards).returning();

        // Générer des dates pour les révisions
        const now = new Date();
        const dates = {
            oneHourAgo: new Date(now.getTime() - 60 * 60 * 1000),
            oneDayAgo: new Date(now.getTime() - 24 * 60 * 60 * 1000),
            twoDaysAgo: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
            threeDaysAgo: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            fourDaysAgo: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
            sevenDaysAgo: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
            fourteenDaysAgo: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
            thirtyDaysAgo: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };

        const seedRevisions = [
            // === Révisions pour Alice ===
            { idCard: insertedCards[0].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.fourDaysAgo },
            { idCard: insertedCards[1].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.twoDaysAgo },
            { idCard: insertedCards[2].idCard, idLevel: insertedLevels[0].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.oneDayAgo },
            { idCard: insertedCards[3].idCard, idLevel: insertedLevels[3].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.sevenDaysAgo },
            // Capitales
            { idCard: insertedCards[5].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.oneDayAgo },
            { idCard: insertedCards[6].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.threeDaysAgo },
            { idCard: insertedCards[7].idCard, idLevel: insertedLevels[4].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.fourteenDaysAgo },
            // JavaScript
            { idCard: insertedCards[10].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.twoDaysAgo },
            { idCard: insertedCards[11].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.oneDayAgo },
            { idCard: insertedCards[12].idCard, idLevel: insertedLevels[3].idLevel, idUser: insertedUsers[0].idUser, lastRevision: dates.fourDaysAgo },
            
            // === Révisions pour Bruno ===
            // Mathématiques
            { idCard: insertedCards[14].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[1].idUser, lastRevision: dates.sevenDaysAgo },
            { idCard: insertedCards[15].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[1].idUser, lastRevision: dates.oneDayAgo },
            // Histoire
            { idCard: insertedCards[16].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[1].idUser, lastRevision: dates.fourDaysAgo },
            { idCard: insertedCards[17].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[1].idUser, lastRevision: dates.oneDayAgo },
            { idCard: insertedCards[18].idCard, idLevel: insertedLevels[3].idLevel, idUser: insertedUsers[1].idUser, lastRevision: dates.sevenDaysAgo },
            
            // === Révisions pour Claire ===
            // Espagnol
            { idCard: insertedCards[19].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[2].idUser, lastRevision: dates.twoDaysAgo },
            { idCard: insertedCards[20].idCard, idLevel: insertedLevels[0].idLevel, idUser: insertedUsers[2].idUser, lastRevision: dates.oneHourAgo },
            // Géographie
            { idCard: insertedCards[22].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[2].idUser, lastRevision: dates.threeDaysAgo },
            { idCard: insertedCards[23].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[2].idUser, lastRevision: dates.oneDayAgo },
        ];

        await db.insert(revisionTable).values(seedRevisions);
        console.log('Database seeded successfully!');
    
    } catch (error) {
        console.log('Error seeding database', error);
    }
}

seed();
