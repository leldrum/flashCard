import { db } from './db.js';
import { collectionTable } from './schema.js';

const collections = [
    {
        title: 'Vocabulaire Anglais',
        description: 'Collection de mots anglais pour débutants',
        isPrivate: false,
        idUser: 'user-1', // À remplacer par un vrai ID utilisateur
    },
    {
        title: 'Capitales du Monde',
        description: 'Apprendre les capitales des pays du monde',
        isPrivate: false,
        idUser: 'user-1',
    },
    {
        title: 'Formules Mathématiques',
        description: 'Formules essentielles pour les examens',
        isPrivate: true,
        idUser: 'user-1',
    },
    {
        title: 'Histoire de France',
        description: 'Dates et événements importants',
        isPrivate: false,
        idUser: 'user-2',
    },
    {
        title: 'Programmation JavaScript',
        description: 'Concepts clés en JavaScript',
        isPrivate: false,
        idUser: 'user-2',
    },
];

async function seed() {
    console.log('Seeding collections...');

    try {
        //await db.delete(collectionTable);
        await db.insert(collectionTable).values(collections);
        console.log('Collections seeded successfully!');
    } catch (error) {
        console.error('Error seeding collections:', error);
        throw error;
    }
}

seed()
