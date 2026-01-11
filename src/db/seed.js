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
        const passwords = ['Password123!', 'SecurePass456!', 'MyFlashCards789!', 'EmptyUser123!'];
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
            {
                firstName: 'David',
                name: 'Lefevre',
                email: 'david@example.com',
                password: hashedPasswords[3],
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

        // Générer des dates pour tester les révisions
        // Niveaux et leurs délais : 1=1j, 2=2j, 3=4j, 4=8j, 5=16j
        const now = new Date();
        
        const seedRevisions = [
            // === TESTS POUR ALICE ===
            // Card 0 (Dog) - Niveau 1 (délai 1j) - Révisée il y a 2j → PRÊTE à réviser
            { idCard: insertedCards[0].idCard, idLevel: insertedLevels[0].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
            
            // Card 1 (Cat) - Niveau 2 (délai 2j) - Révisée il y a 3j → PRÊTE à réviser
            { idCard: insertedCards[1].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
            
            // Card 2 (House) - Niveau 3 (délai 4j) - Révisée il y a 5j → PRÊTE à réviser
            { idCard: insertedCards[2].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
            
            // Card 3 (Water) - Niveau 4 (délai 8j) - Révisée il y a 10j → PRÊTE à réviser
            { idCard: insertedCards[3].idCard, idLevel: insertedLevels[3].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) },
            
            // Card 5 (Paris) - Niveau 1 (délai 1j) - Révisée il y a 12h → PAS PRÊTE (trop tôt)
            { idCard: insertedCards[5].idCard, idLevel: insertedLevels[0].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 12 * 60 * 60 * 1000) },
            
            // Card 6 (Berlin) - Niveau 2 (délai 2j) - Révisée il y a 1j → PAS PRÊTE (trop tôt)
            { idCard: insertedCards[6].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
            
            // Card 7 (Tokyo) - Niveau 5 (délai 16j) - Révisée il y a 20j → PRÊTE à réviser
            { idCard: insertedCards[7].idCard, idLevel: insertedLevels[4].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000) },
            
            // Card 10 (Array.map()) - Niveau 3 (délai 4j) - Révisée il y a 2j → PAS PRÊTE (trop tôt)
            { idCard: insertedCards[10].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[0].idUser, lastRevision: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
            
            // === TESTS POUR BRUNO ===
            // Card 14 (a² + b² = c²) - Niveau 2 (délai 2j) - Révisée il y a 4j → PRÊTE
            { idCard: insertedCards[14].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[1].idUser, lastRevision: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
            
            // Card 15 (sin²θ + cos²θ = 1) - Niveau 4 (délai 8j) - Révisée il y a 9j → PRÊTE
            { idCard: insertedCards[15].idCard, idLevel: insertedLevels[3].idLevel, idUser: insertedUsers[1].idUser, lastRevision: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000) },
            
            // Card 16 (1789) - Niveau 1 (délai 1j) - Révisée il y a 6h → PAS PRÊTE
            { idCard: insertedCards[16].idCard, idLevel: insertedLevels[0].idLevel, idUser: insertedUsers[1].idUser, lastRevision: new Date(now.getTime() - 6 * 60 * 60 * 1000) },
            
            // Bruno révise des cartes publiques d'Alice
            // Card 0 (Dog) - Niveau 2 (délai 2j) - Révisée il y a 3j → PRÊTE
            { idCard: insertedCards[0].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[1].idUser, lastRevision: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
            
            // Card 5 (Paris) - Niveau 3 (délai 4j) - Révisée il y a 1j → PAS PRÊTE
            { idCard: insertedCards[5].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[1].idUser, lastRevision: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
            
            // === TESTS POUR CLAIRE ===
            // Card 19 (Hola) - Niveau 1 (délai 1j) - Révisée il y a 2j → PRÊTE
            { idCard: insertedCards[19].idCard, idLevel: insertedLevels[0].idLevel, idUser: insertedUsers[2].idUser, lastRevision: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
            
            // Card 20 (Gracias) - Niveau 5 (délai 16j) - Révisée il y a 10j → PAS PRÊTE
            { idCard: insertedCards[20].idCard, idLevel: insertedLevels[4].idLevel, idUser: insertedUsers[2].idUser, lastRevision: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) },
            
            // Card 22 (Nil) - Niveau 3 (délai 4j) - Révisée il y a 5j → PRÊTE
            { idCard: insertedCards[22].idCard, idLevel: insertedLevels[2].idLevel, idUser: insertedUsers[2].idUser, lastRevision: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
            
            // Claire révise aussi des cartes publiques d'Alice
            // Card 0 (Dog) - Niveau 4 (délai 8j) - Révisée il y a 4j → PAS PRÊTE
            { idCard: insertedCards[0].idCard, idLevel: insertedLevels[3].idLevel, idUser: insertedUsers[2].idUser, lastRevision: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
            
            // Card 1 (Cat) - Niveau 2 (délai 2j) - Révisée il y a 3j → PRÊTE
            { idCard: insertedCards[1].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[2].idUser, lastRevision: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
            
            // === TESTS POUR DAVID (utilisateur sans collections) ===
            // Card 0 (Dog) - Niveau 1 (délai 1j) - Révisée il y a 2j → PRÊTE
            { idCard: insertedCards[0].idCard, idLevel: insertedLevels[0].idLevel, idUser: insertedUsers[3].idUser, lastRevision: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
            
            // Card 5 (Paris) - Niveau 2 (délai 2j) - Révisée il y a 1j → PAS PRÊTE
            { idCard: insertedCards[5].idCard, idLevel: insertedLevels[1].idLevel, idUser: insertedUsers[3].idUser, lastRevision: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
        ];

        await db.insert(revisionTable).values(seedRevisions);
        console.log('Database seeded successfully!');
    
    } catch (error) {
        console.log('Error seeding database', error);
    }
}

seed();
