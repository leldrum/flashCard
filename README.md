# R5.05 — API RESTful de gestion de flashcards

Backend d’un système de révision par répétition espacée: authentification, gestion des collections et flashcards, routes protégées par JWT, base SQLite via Drizzle.

## Sommaire
- Contexte et objectifs
- Stack technique et contraintes
- Installation et configuration
- Lancement en développement
- Initialisation de la base (Drizzle)

## Contexte et objectifs
Développer une API RESTful pour gérer des collections de flashcards avec répétition espacée.

Objectifs principaux:
- Inscription et connexion utilisateurs
- Création, modification, partage de collections (public/privé)
- Révision des cartes selon 5 niveaux et délais croissants
- Droits d’accès et rôle administrateur

## Stack technique
- Node.js + Express (JavaScript)
- Base locale: SQLite (via `@libsql/client`)
- ORM: Drizzle
- Librairies: `zod`, `bcrypt`, `jsonwebtoken`, `dotenv`, `nodemon`

## Installation et configuration
Pré-requis: Node.js LTS installé.

1) Cloner le dépôt et installer les dépendances:
```powershell
git clone https://github.com/leldrum/flashCard.git
cd flashCard
npm install
```

2) Créer le fichier `.env` à la racine et définir:
```dotenv
JWT_SECRET="2xsdSq4sXr1dBheDWagepd6QaeQ8kekA9ktD33F4qG92wFytV90Jjr3jrXidkm5y"
DB_FILE=file:local.db
```

Notes:
- `JWT_SECRET` est requis pour signer les tokens.
- `DB_FILE` indique l’URL SQLite utilisée par Drizzle/LibSQL.

## Lancement en développement
```powershell
npm run dev
```
Le serveur démarre sur `http://localhost:3000`.

## Initialisation de la base (Drizzle)
1) Pousser le schéma:
```powershell
npm run db:push
```
2) Lancer le studio:
```powershell
npm run db:studio
```
3) Insérer des données de démonstration:
```powershell
npm run db:seed
```

