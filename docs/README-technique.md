# Documentation technique — API Flashcards

Ce document liste les endpoints de l’API avec leur rôle, le type d’authentification requis et les principaux champs d’entrée (route params, query params, body). Il commence par l’authentification, puis couvre les collections, les cartes et les routes admin.

## Authentification

- Méthode: POST — Chemin: /auth/register
  - Rôle: Inscription d’un nouvel utilisateur.
  - Authentification: Publique.
  - Body (JSON):
    - email: string, format email
    - firstName: string, 3-30
    - name: string, 3-30
    - password: string, 8-255
  - Réponses:
    - 201: { message, user, token }
    - 409: email déjà utilisé
    - 500: erreur serveur

- Méthode: POST — Chemin: /auth/login
  - Rôle: Connexion utilisateur par email + mot de passe.
  - Authentification: Publique.
  - Body (JSON):
    - email: string, format email
    - password: string, 8-255
  - Réponses:
    - 200: { message, userData, token }
    - 401: identifiants invalides
    - 500: erreur serveur

- Méthode: GET — Chemin: /auth/me
  - Rôle: Obtenir les informations du compte connecté.
  - Authentification: Authentifiée (JWT Bearer).
  - Headers:
    - Authorization: Bearer <token>
  - Réponses:
    - 200: { user }
    - 401: token invalide/expiré
    - 403: token manquant
    - 404: utilisateur introuvable

## Collections

- Méthode: GET — Chemin: /collections/search/:title
  - Rôle: Rechercher des collections publiques par titre.
  - Authentification: Publique.
  - Route params:
    - title: string, 1-300
  - Réponses:
    - 200: liste des collections publiques correspondantes

- Méthode: GET — Chemin: /collections/mine
  - Rôle: Lister les collections de l’utilisateur connecté.
  - Authentification: Authentifiée (JWT Bearer).
  - Headers:
    - Authorization: Bearer <token>
  - Réponses:
    - 200: liste des collections de l’utilisateur

- Méthode: GET — Chemin: /collections/:id
  - Rôle: Consulter une collection par identifiant.
  - Authentification: Authentifiée (JWT Bearer). Accès si propriétaire ou si collection publique.
  - Route params:
    - id: UUID
  - Réponses:
    - 200: détails de la collection
    - 404: collection introuvable ou non accessible

- Méthode: POST — Chemin: /collections
  - Rôle: Créer une collection.
  - Authentification: Authentifiée (JWT Bearer).
  - Body (JSON):
    - title: string, 1-300
    - description: string, 1-300 (optionnel)
    - isPrivate: boolean
  - Réponses:
    - 201: collection créée

- Méthode: PATCH — Chemin: /collections/:id
  - Rôle: Modifier une collection (titre, description, visibilité).
  - Authentification: Authentifiée (JWT Bearer). Uniquement propriétaire.
  - Route params:
    - id: UUID
  - Body (JSON, optionnel):
    - title: string, 1-300
    - description: string, 1-300
    - isPrivate: boolean
  - Réponses:
    - 200: collection mise à jour
    - 403/404: accès refusé ou introuvable

- Méthode: DELETE — Chemin: /collections/:id
  - Rôle: Supprimer une collection.
  - Authentification: Authentifiée (JWT Bearer). Uniquement propriétaire.
  - Route params:
    - id: UUID
  - Réponses:
    - 200/204: suppression effectuée
    - 403/404: accès refusé ou introuvable

## Cartes (Flashcards)

Toutes les routes de cartes nécessitent authentification (JWT Bearer).

- Méthode: POST — Chemin: /cards
  - Rôle: Créer une flashcard dans une collection possédée.
  - Authentification: Authentifiée.
  - Body (JSON):
    - frontText: string, 1-300
    - backText: string, 1-300
    - frontUrl: string (optionnel)
    - backUrl: string (optionnel)
    - idCollection: string (UUID de la collection)
  - Réponses:
    - 201: carte créée

- Méthode: POST — Chemin: /cards/:id/revise
  - Rôle: Enregistrer la révision d’une carte (mise à jour niveau et dates).
  - Authentification: Authentifiée.
  - Route params:
    - id: UUID (carte)
  - Réponses:
    - 200: révision enregistrée

- Méthode: GET — Chemin: /cards/collection/:id/review
  - Rôle: Récupérer les cartes à réviser d’une collection.
  - Authentification: Authentifiée. Uniquement propriétaire (ou admin si prévu).
  - Route params:
    - id: UUID (collection)
  - Réponses:
    - 200: liste des cartes à réviser

- Méthode: GET — Chemin: /cards/collection/:id
  - Rôle: Lister les cartes d’une collection.
  - Authentification: Authentifiée. Accès si propriétaire ou collection publique.
  - Route params:
    - id: UUID (collection)
  - Réponses:
    - 200: liste des cartes

- Méthode: GET — Chemin: /cards/:id
  - Rôle: Consulter une carte par identifiant.
  - Authentification: Authentifiée. Accès si propriétaire ou collection publique.
  - Route params:
    - id: UUID (carte)
  - Réponses:
    - 200: détails de la carte

- Méthode: PATCH — Chemin: /cards/:id
  - Rôle: Modifier une carte (textes, URLs).
  - Authentification: Authentifiée. Uniquement propriétaire de la collection.
  - Route params:
    - id: UUID (carte)
  - Body (JSON, optionnel):
    - frontText: string, 1-300
    - backText: string, 1-300
    - frontUrl: string
    - backUrl: string
  - Réponses:
    - 200: carte mise à jour

- Méthode: DELETE — Chemin: /cards/:id
  - Rôle: Supprimer une carte.
  - Authentification: Authentifiée. Uniquement propriétaire de la collection.
  - Route params:
    - id: UUID (carte)
  - Réponses:
    - 200/204: suppression effectuée

## Utilisateurs (Admin)

Ces routes sont protégées: rôle administrateur requis (`checkAdminRole`).

- Méthode: GET — Chemin: /users/
  - Rôle: Lister les utilisateurs (triés par date de création décroissante).
  - Authentification: Admin (JWT + rôle admin).
  - Réponses:
    - 200: liste des utilisateurs

- Méthode: GET — Chemin: /users/:id
  - Rôle: Consulter un utilisateur par identifiant.
  - Authentification: Admin.
  - Route params:
    - id: UUID (utilisateur)
  - Réponses:
    - 200: détails utilisateur

- Méthode: DELETE — Chemin: /users/:id
  - Rôle: Supprimer un utilisateur (conséquences sur collections/cartes définies côté base).
  - Authentification: Admin.
  - Route params:
    - id: UUID (utilisateur)
  - Réponses:
    - 200/204: suppression effectuée

## Notes techniques

- Validation: `zod` sur body/params via middleware `validation`.
- Authentification: JWT via `jsonwebtoken`; header `Authorization: Bearer <token>`.
- Base de données: SQLite via Drizzle et `@libsql/client`; schéma dans src/db/schema.js.
- Environnements: variables dans `.env` — `JWT_SECRET`, `DB_FILE`.

## Codes d’erreur fréquents

- 401: identifiants invalides ou token invalide/expiré
- 403: token manquant ou accès interdit (rôle/propriété)
- 404: ressource introuvable
- 409: email déjà utilisé
- 500: erreur serveur
