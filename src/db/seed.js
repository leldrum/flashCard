import bcrypt from 'bcrypt';
import { db } from './db.js';
import { cardTable, collectionTable, userTable } from './schema.js';

async function seed() {
    try {
        console.log('Seeding database..');

        await db.delete(cardTable);
        await db.delete(collectionTable);
        await db.delete(userTable);

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
                frontText: 'Paris',
                backText: 'France',
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
                frontText: '1789',
                backText: 'Révolution française',
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
        ];

        await db.insert(cardTable).values(seedCards);

        console.log('Database seeded successfully');
        console.log('email:', insertedUsers[0].email);
        console.log('password: Password123!');
    } catch (error) {
        console.log('Error seeding database', error);
    }
}

seed();
