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
  "email": "user@example.com",
  "firstName": "Jean",
  "name": "Dupont",
  "password": "SecurePassword123"
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
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

| Champ | Type | Contraintes |
|-------|------|-------------|
| `email` | string | Format email valide |
| `password` | string | 8-255 caractères |

**Réponses:**
- `200 OK`: Connexion réussie — retourne `{ message, userData, token }`
- `401 Unauthorized`: Identifiants invalides
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
- `401 Unauthorized`: Token invalide ou expiré
- `403 Forbidden`: Token manquant
- `404 Not Found`: Utilisateur introuvable

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
GET /collections/search/Python
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
- `200 OK`: Retourne la liste des collections de l'utilisateur

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
  "title": "JavaScript Avancé",
  "description": "Concepts avancés de JavaScript",
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

### `PATCH /collections/:id` — Modifier une collection

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
  "title": "JavaScript Avancé (v2)",
  "description": "Mise à jour des concepts avancés",
  "isPrivate": true
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

⚠️ **Toutes les routes de flashcards nécessitent une authentification JWT Bearer.**

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
  "frontText": "Qu'est-ce que le hoisting en JS ?",
  "backText": "Le hoisting est le comportement de déplacement des déclarations...",
  "frontUrl": "https://example.com/front.jpg",
  "backUrl": "https://example.com/back.jpg",
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
- `200 OK`: Retourne la liste des flashcards

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

### `PATCH /cards/:id` — Modifier une flashcard

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
  "frontText": "Qu'est-ce que le hoisting ?",
  "backText": "Comportement de déplacement des déclarations...",
  "frontUrl": "https://example.com/front-updated.jpg",
  "backUrl": "https://example.com/back-updated.jpg"
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
- `200 OK`: Révision enregistrée avec succès

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

⚠️ **Toutes les routes utilisateurs nécessitent une authentification JWT Bearer ET le rôle administrateur.**

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

Supprime un utilisateur. Les collections et flashcards associées sont supprimées en cascade.

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
- `404 Not Found`: Utilisateur introuvable

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
