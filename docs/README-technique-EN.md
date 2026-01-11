# Technical Documentation — Flashcards API

This document describes all available endpoints of the Flashcards API, with their functionality, required authentication level, and input parameters.

## Table of Contents

- [Authentication](#authentication)
- [Collections](#collections)
- [Flashcards](#flashcards)
- [Users (Admin)](#users-admin)
- [Technical Notes](#technical-notes)
- [Error Codes](#common-error-codes)

---

## Authentication

### `POST /auth/register` — Registration

Creates a new user account.

| Property | Value |
|----------|-------|
| **Authentication** | Public |
| **Role** | Register a new user |

**Body (JSON):**
```json
{
  "email": "claire@example.com",
  "firstName": "Claire",
  "name": "Bernard",
  "password": "MyFlashCards789!"
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `email` | string | Valid email format |
| `firstName` | string | 3-30 characters |
| `name` | string | 3-30 characters |
| `password` | string | 8-255 characters |

**Responses:**
- `201 Created`: Registration successful — returns `{ message, user, token }`
- `409 Conflict`: Email already in use
- `500 Internal Server Error`: Server error

---

### `POST /auth/login` — Login

Authenticates a user and returns a JWT token.

| Property | Value |
|----------|-------|
| **Authentication** | Public |
| **Role** | Login with email and password |

**Body (JSON):**
```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `email` | string | Valid email format |
| `password` | string | 8-255 characters |

**Responses:**
- `200 OK`: Login successful — returns `{ message, userData, token }`
- `401 Unauthorized`: Incorrect password
- `404 Not Found`: Email not found / user does not exist
- `500 Internal Server Error`: Server error

---

### `GET /auth/me` — Current Profile

Retrieves information about the connected user's account.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Get connected account information |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns `{ user }`
- `401 Unauthorized`: Invalid or expired token, or user no longer exists in database
- `403 Forbidden`: Missing token
- `404 Not Found`: User not found

**Security note:** The `authenticateToken` middleware verifies not only the JWT validity, but also that the user still exists in the database. If a user is deleted, their token becomes invalid.

---

## Collections

### `GET /collections/search/:title` — Search Public Collections

Searches for public collections by title.

| Property | Value |
|----------|-------|
| **Authentication** | Public |
| **Role** | Search public collections by title |

**Parameters:**

| Parameter | Type | Constraints | Location |
|-----------|------|-------------|----------|
| `title` | string | 1-300 characters | Route |

**Example:**
```
GET /collections/search/JavaScript
```

**Responses:**
- `200 OK`: Returns a list of matching public collections

---

### `GET /collections/mine` — My Collections

Lists all collections created by the connected user.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | List user's collections |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns the list of user's collections (or message "You have no collection" if empty)

---

### `GET /collections/:id` — Collection Details

Retrieves details of a collection. Accessible if the user is the owner or if the collection is public.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | View a collection by identifier |
| **Restrictions** | Owner OR public collection |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns collection details
- `404 Not Found`: Collection not found or not accessible

---

### `POST /collections` — Create a Collection

Creates a new collection.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Create a collection |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON):**
```json
{
  "title": "Spanish Vocabulary",
  "description": "Essential Spanish words and expressions",
  "isPrivate": false
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | string | 1-300 characters |
| `description` | string | 1-300 characters (optional) |
| `isPrivate` | boolean | `true` or `false` |

**Responses:**
- `201 Created`: Collection created successfully

---

### `PUT /collections/:id` — Update a Collection

Updates an existing collection (title, description, visibility).

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Update a collection |
| **Restrictions** | Owner only |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON, all fields optional):**
```json
{
  "title": "General History",
  "description": "World historical events",
  "isPrivate": false
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | string | 1-300 characters (optional) |
| `description` | string | 1-300 characters (optional) |
| `isPrivate` | boolean | (optional) |

**Responses:**
- `200 OK`: Collection updated successfully
- `403 Forbidden`: Access denied (not owner)
- `404 Not Found`: Collection not found

**Important behavior:** When a collection changes from public to private (`isPrivate: false` → `true`), all user revisions (except owner and admins) are automatically deleted to preserve confidentiality.

---

### `DELETE /collections/:id` — Delete a Collection

Deletes a collection. Cascade: all flashcards in the collection are deleted.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Delete a collection |
| **Restrictions** | Owner only |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK` / `204 No Content`: Deletion completed
- `403 Forbidden`: Access denied (not owner)
- `404 Not Found`: Collection not found

---

## Flashcards

⚠️ **All flashcard routes require JWT Bearer authentication.**

### `POST /cards` — Create a Flashcard

Creates a new flashcard in a collection.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Create a flashcard in an owned collection |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON):**
```json
{
  "frontText": "Array.map()",
  "backText": "Creates a new array by applying a function to each element",
  "frontUrl": null,
  "backUrl": null,
  "idCollection": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `frontText` | string | 1-300 characters |
| `backText` | string | 1-300 characters |
| `frontUrl` | string | Valid URL (optional) |
| `backUrl` | string | Valid URL (optional) |
| `idCollection` | UUID | Collection UUID |

**Responses:**
- `201 Created`: Flashcard created successfully

---

### `GET /cards/collection/:id` — List Collection Flashcards

Retrieves all flashcards from a collection.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | List flashcards from a collection |
| **Restrictions** | Owner OR public collection |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route (collection) |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns the list of flashcards (or message "You have no cards in this collection" if empty)

**Note:** For private collections, only the owner can view and review cards. Admins can view private collections but cannot review other users' cards.

---

### `GET /cards/collection/:id/review` — Cards to Review

Retrieves flashcards to review from a collection according to the review algorithm.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Get cards to review |
| **Restrictions** | Owner only |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route (collection) |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns the list of flashcards to review

---

### `GET /cards/:id` — Flashcard Details

Retrieves details of a flashcard.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | View a flashcard |
| **Restrictions** | Owner OR public collection |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns flashcard details
- `404 Not Found`: Flashcard not found

---

### `PUT /cards/:id` — Update a Flashcard

Updates an existing flashcard (texts, URLs).

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Update a flashcard |
| **Restrictions** | Collection owner only |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON, all fields optional):**
```json
{
  "frontText": "Dog",
  "backText": "Chien (domestic animal)",
  "frontUrl": null,
  "backUrl": null
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `frontText` | string | 1-300 characters (optional) |
| `backText` | string | 1-300 characters (optional) |
| `frontUrl` | string | Valid URL (optional) |
| `backUrl` | string | Valid URL (optional) |

**Responses:**
- `200 OK`: Flashcard updated successfully

---

### `POST /cards/:id/revise` — Record a Revision

Records a flashcard revision (updates level and dates).

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Record a flashcard revision |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Revision recorded successfully — returns a detailed object:
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
- `403 Forbidden`: Access denied (private collection you don't own)
- `404 Not Found`: Card not found

---

### `DELETE /cards/:id` — Delete a Flashcard

Deletes a flashcard.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token required |
| **Role** | Delete a flashcard |
| **Restrictions** | Collection owner only |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route (flashcard) |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK` / `204 No Content`: Deletion completed
- `404 Not Found`: Flashcard not found

---

## Users (Admin)

⚠️ **All user routes require JWT Bearer authentication AND administrator role.**

### `GET /users/` — List All Users

Retrieves the list of all users (sorted by creation date in descending order).

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token + admin role required |
| **Role** | List all users |
| **Restrictions** | Administrator only |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns the list of users

---

### `GET /users/:id` — User Details

Retrieves details of a specific user.

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token + admin role required |
| **Role** | View a user |
| **Restrictions** | Administrator only |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK`: Returns user details
- `404 Not Found`: User not found

---

### `DELETE /users/:id` — Delete a User

Deletes a user and all their associated content.

⚠️ **Warning: This action is irreversible and results in:**
- Deletion of ALL user's collections
- Deletion of ALL flashcards from these collections
- Deletion of ALL associated revisions

| Property | Value |
|----------|-------|
| **Authentication** | ✓ JWT Bearer token + admin role required |
| **Role** | Delete a user |
| **Restrictions** | Administrator only |

**Parameters:**

| Parameter | Type | Location |
|-----------|------|----------|
| `id` | UUID | Route |

**Headers:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200 OK` / `204 No Content`: Deletion completed
- `403 Forbidden`: An administrator cannot delete their own account
- `404 Not Found`: User not found

⚠️ **Protection:** An administrator cannot delete their own account to prevent being locked out of administration.

---

## Technical Notes

### Spaced Repetition System

The application uses a spaced repetition algorithm with 5 levels:

| Level | Delay Before Next Review |
|-------|--------------------------|
| 1 | 1 day |
| 2 | 2 days |
| 3 | 4 days |
| 4 | 8 days |
| 5 | 16 days |

Each revision increments the card's level (up to a maximum of 5). The next review date is calculated automatically.

### JWT Authentication

- **Validity duration:** 24 hours
- **Verification:** The `authenticateToken` middleware verifies not only the JWT validity, but also the user's existence in the database
- **Required header:** `Authorization: Bearer <token>`
- If a user is deleted, all their tokens automatically become invalid

### Privacy Management

**Private collections:**
- Only the owner can view and review cards
- Admins can view private collections but **cannot review** other users' cards

**Making private:**
When a collection changes from public to private, all user revisions (except owner and admins) are automatically deleted. This ensures that revision data remains confidential.

### Test Data (seed)

The `seed.js` file generates complete test data:
- **4 users:** Alice (admin), Bruno, Claire, David (without collection)
- **7 collections:** Mix of public and private
- **24 cards:** Distributed across collections
- **20 revisions:** With calculated dates to test availability (11 ready, 9 not yet)
- Multi-user revisions on the same cards to test concurrency

---

## Common Error Codes

| Code | Meaning | Possible Causes |
|------|---------|-----------------|
| `400 Bad Request` | Bad request | Validation failed (body/params) |
| `401 Unauthorized` | Not authenticated | Token missing, invalid, or expired |
| `403 Forbidden` | Access denied | Not owner, not admin, or token missing |
| `404 Not Found` | Resource not found | Nonexistent or inaccessible ID |
| `409 Conflict` | Conflict | Email already in use |
| `500 Internal Server Error` | Server error | Unhandled error |


## Database Schema

<img width="2620" height="1616" alt="drawSQL-image-export-2025-12-10(1)" src="https://github.com/user-attachments/assets/39ec259b-8005-4e46-b6d6-09010a8f4e3d" />
