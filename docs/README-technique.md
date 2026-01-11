# Documentation technique — API Flashcards

Ce document décrit tous les endpoints disponibles de l'API Flashcards, avec leur fonctionnalité, leur niveau d'authentification requis et les paramètres d'entrée.

## Table des matières

- [Authentification](#authentification)
- [Collections](#collections)
- [Flashcards](#flashcards)
- [Utilisateurs (Admin)](#utilisateurs-admin)
- [Notes techniques](#notes-techniques)
- [Codes d'erreur](#codes-derreur-fréquents)

---

## Authentification

### `POST /auth/register` — Inscription

Crée un nouveau compte utilisateur.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | Publique |
| **Rôle** | Inscription d'un nouvel utilisateur |

**Body (JSON):**
```json
{
  "email": "claire@example.com",
  "firstName": "Claire",
  "name": "Bernard",
  "password": "MyFlashCards789!"
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `email` | string | Format email valide |
| `firstName` | string | 3-30 caractères |
| `name` | string | 3-30 caractères |
| `password` | string | 8-255 caractères |

**Réponses:**
- `201 Created`: Inscription réussie — retourne `{ message, user, token }`
- `409 Conflict`: Email déjà utilisé
- `500 Internal Server Error`: Erreur serveur

---

### `POST /auth/login` — Connexion

Authentifie un utilisateur et retourne un token JWT.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | Publique |
| **Rôle** | Connexion par email et mot de passe |

**Body (JSON):**
```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `email` | string | Format email valide |
| `password` | string | 8-255 caractères |

**Réponses:**
- `200 OK`: Connexion réussie — retourne `{ message, userData, token }`
- `401 Unauthorized`: Mot de passe incorrect
- `404 Not Found`: Email non trouvé / utilisateur inexistant
- `500 Internal Server Error`: Erreur serveur

---

### `GET /auth/me` — Profil courant

Récupère les informations du compte de l'utilisateur connecté.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Obtenir les informations du compte connecté |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne `{ user }`
- `401 Unauthorized`: Token invalide, expiré, ou utilisateur n'existe plus en base de données
- `403 Forbidden`: Token manquant
- `404 Not Found`: Utilisateur introuvable

**Note de sécurité:** Le middleware `authenticateToken` vérifie non seulement la validité du JWT, mais aussi que l'utilisateur existe toujours en base de données. Si un utilisateur est supprimé, son token devient invalide.

---

## Collections

### `GET /collections/search/:title` — Rechercher les collections publiques

Recherche des collections publiques par titre.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | Publique |
| **Rôle** | Rechercher des collections publiques par titre |

**Paramètres:**

| Paramètre | Type | Contraintes | Localisation |
|-----------|------|-------------|--------------|
| `title` | string | 1-300 caractères | Route |

**Exemple:**
```
GET /collections/search/JavaScript
```

**Réponses:**
- `200 OK`: Retourne une liste des collections publiques correspondantes

---

### `GET /collections/mine` — Mes collections

Liste toutes les collections créées par l'utilisateur connecté.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Lister les collections de l'utilisateur |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne la liste des collections de l'utilisateur (ou message "You have no collection" si vide)

---

### `GET /collections/:id` — Détails d'une collection

Récupère les détails d'une collection. Accessible si l'utilisateur est propriétaire ou si la collection est publique.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Consulter une collection par identifiant |
| **Restrictions** | Propriétaire OU collection publique |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne les détails de la collection
- `404 Not Found`: Collection introuvable ou non accessible

---

### `POST /collections` — Créer une collection

Crée une nouvelle collection.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Créer une collection |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON):**
```json
{
  "title": "Vocabulaire Espagnol",
  "description": "Mots et expressions essentiels en espagnol",
  "isPrivate": false
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `title` | string | 1-300 caractères |
| `description` | string | 1-300 caractères (optionnel) |
| `isPrivate` | boolean | `true` ou `false` |

**Réponses:**
- `201 Created`: Collection créée avec succès

---

### `PUT /collections/:id` — Modifier une collection

Modifie une collection existante (titre, description, visibilité).

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Modifier une collection |
| **Restrictions** | Propriétaire uniquement |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON, tous les champs optionnels):**
```json
{
  "title": "Histoire Générale",
  "description": "Événements historiques mondiaux",
  "isPrivate": false
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `title` | string | 1-300 caractères (optionnel) |
| `description` | string | 1-300 caractères (optionnel) |
| `isPrivate` | boolean | (optionnel) |

**Réponses:**
- `200 OK`: Collection mise à jour avec succès
- `403 Forbidden`: Accès refusé (non propriétaire)
- `404 Not Found`: Collection introuvable

** Comportement important:** Lorsqu'une collection passe de publique à privée (`isPrivate: false` → `true`), toutes les révisions des utilisateurs (sauf le propriétaire et les admins) sont automatiquement supprimées pour préserver la confidentialité.

---

### `DELETE /collections/:id` — Supprimer une collection

Supprime une collection. Cascade : toutes les flashcards de la collection sont supprimées.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Supprimer une collection |
| **Restrictions** | Propriétaire uniquement |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK` / `204 No Content`: Suppression effectuée
- `403 Forbidden`: Accès refusé (non propriétaire)
- `404 Not Found`: Collection introuvable

---

## Flashcards

 **Toutes les routes de flashcards nécessitent une authentification JWT Bearer.**

### `POST /cards` — Créer une flashcard

Crée une nouvelle flashcard dans une collection.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Créer une flashcard dans une collection possédée |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON):**
```json
{
  "frontText": "Array.map()",
  "backText": "Crée un nouveau tableau en appliquant une fonction à chaque élément",
  "frontUrl": null,
  "backUrl": null,
  "idCollection": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `frontText` | string | 1-300 caractères |
| `backText` | string | 1-300 caractères |
| `frontUrl` | string | URL valide (optionnel) |
| `backUrl` | string | URL valide (optionnel) |
| `idCollection` | UUID | UUID de la collection |

**Réponses:**
- `201 Created`: Flashcard créée avec succès

---

### `GET /cards/collection/:id` — Lister les flashcards d'une collection

Récupère toutes les flashcards d'une collection.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Lister les flashcards d'une collection |
| **Restrictions** | Propriétaire OU collection publique |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route (collection) |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne la liste des flashcards (ou message "You have no cards in this collection" si vide)

**Note:** Pour les collections privées, seul le propriétaire peut voir et réviser les cartes. Les admins peuvent voir les collections privées mais ne peuvent pas réviser les cartes d'autres utilisateurs.

---

### `GET /cards/collection/:id/review` — Cartes à réviser

Récupère les flashcards à réviser d'une collection selon l'algorithme de révision.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Récupérer les cartes à réviser |
| **Restrictions** | Propriétaire uniquement |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route (collection) |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne la liste des flashcards à réviser

---

### `GET /cards/:id` — Détails d'une flashcard

Récupère les détails d'une flashcard.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Consulter une flashcard |
| **Restrictions** | Propriétaire OU collection publique |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne les détails de la flashcard
- `404 Not Found`: Flashcard introuvable

---

### `PUT /cards/:id` — Modifier une flashcard

Modifie une flashcard existante (textes, URLs).

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Modifier une flashcard |
| **Restrictions** | Propriétaire de la collection uniquement |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON, tous les champs optionnels):**
```json
{
  "frontText": "Dog",
  "backText": "Chien (animal domestique)",
  "frontUrl": null,
  "backUrl": null
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `frontText` | string | 1-300 caractères (optionnel) |
| `backText` | string | 1-300 caractères (optionnel) |
| `frontUrl` | string | URL valide (optionnel) |
| `backUrl` | string | URL valide (optionnel) |

**Réponses:**
- `200 OK`: Flashcard mise à jour avec succès

---

### `POST /cards/:id/revise` — Enregistrer une révision

Enregistre la révision d'une flashcard (met à jour le niveau et les dates).

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Enregistrer la révision d'une flashcard |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Révision enregistrée avec succès — retourne un objet détaillé:
```json
{
  "message": "Revision successful",
  "card": {
    "frontText": "Dog",
    "backText": "Chien",
    "frontUrl": null,
    "backUrl": null
  },
  "level": {
    "level": 2,
    "delay": 2
  },
  "lastRevision": "2026-01-11T10:30:00.000Z",
  "nextRevisionDate": "2026-01-13T10:30:00.000Z"
}
```
- `403 Forbidden`: Accès refusé (collection privée dont vous n'êtes pas propriétaire)
- `404 Not Found`: Carte introuvable

---

### `DELETE /cards/:id` — Supprimer une flashcard

Supprime une flashcard.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token requis |
| **Rôle** | Supprimer une flashcard |
| **Restrictions** | Propriétaire de la collection uniquement |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK` / `204 No Content`: Suppression effectuée
- `404 Not Found`: Flashcard introuvable

---

## Utilisateurs (Admin)

 **Toutes les routes utilisateurs nécessitent une authentification JWT Bearer ET le rôle administrateur.**

### `GET /users/` — Lister tous les utilisateurs

Récupère la liste de tous les utilisateurs (triés par date de création décroissante).

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token + rôle admin requis |
| **Rôle** | Lister tous les utilisateurs |
| **Restrictions** | Administrateur uniquement |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne la liste des utilisateurs

---

### `GET /users/:id` — Détails d'un utilisateur

Récupère les détails d'un utilisateur spécifique.

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token + rôle admin requis |
| **Rôle** | Consulter un utilisateur |
| **Restrictions** | Administrateur uniquement |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK`: Retourne les détails de l'utilisateur
- `404 Not Found`: Utilisateur introuvable

---

### `DELETE /users/:id` — Supprimer un utilisateur

Supprime un utilisateur et tous ses contenus associés.

** Attention : Cette action est irréversible et entraîne :**
- Suppression de TOUTES les collections de l'utilisateur
- Suppression de TOUTES les flashcards de ces collections
- Suppression de TOUTES les révisions associées

| Propriété | Valeur |
|-----------|--------|
| **Authentification** | ✓ JWT Bearer token + rôle admin requis |
| **Rôle** | Supprimer un utilisateur |
| **Restrictions** | Administrateur uniquement |

**Paramètres:**

| Paramètre | Type | Localisation |
|-----------|------|--------------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Réponses:**
- `200 OK` / `204 No Content`: Suppression effectuée
- `403 Forbidden`: Un administrateur ne peut pas supprimer son propre compte
- `404 Not Found`: Utilisateur introuvable

** Protection:** Un administrateur ne peut pas supprimer son propre compte pour éviter de se bloquer l'accès à l'administration.

---

## Notes techniques

### Système de révision espacée

L'application utilise un algorithme de répétition espacée avec 5 niveaux :

| Niveau | Délai avant prochaine révision |
|--------|--------------------------------|
| 1 | 1 jour |
| 2 | 2 jours |
| 3 | 4 jours |
| 4 | 8 jours |
| 5 | 16 jours |

Chaque révision incrémente le niveau de la carte (jusqu'à 5 maximum). La date de prochaine révision est calculée automatiquement.

### Authentification JWT

- **Durée de validité:** 24 heures
- **Vérification:** Le middleware `authenticateToken` vérifie non seulement la validité du JWT, mais aussi l'existence de l'utilisateur en base de données
- **Header requis:** `Authorization: Bearer <token>`
- Si un utilisateur est supprimé, tous ses tokens deviennent automatiquement invalides

### Gestion de la confidentialité

**Collections privées:**
- Seul le propriétaire peut voir et réviser les cartes
- Les admins peuvent voir les collections privées mais **ne peuvent pas réviser** les cartes des autres utilisateurs

**Passage en privé:**
Lorsqu'une collection passe de publique à privée, toutes les révisions des utilisateurs (sauf le propriétaire et les admins) sont automatiquement supprimées. Cela garantit que les données de révision restent confidentielles.

### Données de test (seed)

Le fichier `seed.js` génère des données de test complètes :
- **4 utilisateurs:** Alice (admin), Bruno, Claire, David (sans collection)
- **7 collections:** Mix de publiques et privées
- **24 cartes:** Réparties dans les collections
- **20 révisions:** Avec dates calculées pour tester la disponibilité (11 prêtes, 9 pas encore)
- Révisions multi-utilisateurs sur les mêmes cartes pour tester la concurrence

---

## Codes d'erreur fréquents

| Code | Sens | Causes possibles |
|------|------|------------------|
| `400 Bad Request` | Mauvaise requête | Validation échouée (body/params) |
| `401 Unauthorized` | Non authentifié | Token manquant, invalide ou expiré |
| `403 Forbidden` | Accès refusé | Pas propriétaire, pas admin, ou token manquant |
| `404 Not Found` | Ressource introuvable | ID inexistant ou inaccessible |
| `409 Conflict` | Conflit | Email déjà utilisé |
| `500 Internal Server Error` | Erreur serveur | Erreur non gérée |


## Schéma de la base de donnée

<img width="2620" height="1616" alt="drawSQL-image-export-2025-12-10(1)" src="https://github.com/user-attachments/assets/39ec259b-8005-4e46-b6d6-09010a8f4e3d" />
