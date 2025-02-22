# Language Learning Portal

## Business Goal:

A language learning school wants to build a prototype of learning portal which will act as three things:
_ Inventory of possible vocabulary that can be learned
_ Act as a Learning record store (LRS), providing correct and wrong score on practice vocabulary \* A unified launchpad to launch different learning apps

## Technical Restrictions:

- Use SQLite3 as the database
- You can use any nextjs + typescript + node.js
- Does not require authentication/authorization, assume there is a single user

## Database Schema

1. **WORDS Table**

- Primary Key: `id` (int)
- Fields:
  - `japanese` (string)
  - `romaji` (string)
  - `english` (string)
  - `parts` (json)

2. **GROUPS Table**

- Primary Key: `id` (int)
- Fields:
  - `name` (string)
  - `words_count` (int)

3. **WORDS_GROUPS Table**

- Primary Key: `id` (int)
- Foreign Keys:
  - `word_id` (int) → WORDS.id
  - `group_id` (int) → GROUPS.id

4. **WORD_REVIEW_ITEMS Table**

- Primary Key: `id` (int)
- Foreign Keys:
  - `word_id` (int) → WORDS.id
  - `study_session_id` (int) → STUDY_SESSIONS.id
- Fields:
  - `correct` (boolean)
  - `created_at` (timestamp)

5. **STUDY_SESSIONS Table** : connecting study sessions to groups

- Primary Key: `id` (int)
- Foreign Keys:
  - `group_id` (int) → GROUPS.id
  - `study_activity_id` (int) → STUDY_ACTIVITIES.id
- Fields:
  - `created_at` (timestamp)

6.  **STUDY_ACTIVITIES Table** :

- Primary Key: `id` (int)
- Foreign Keys:
  - `group_id` (int) → GROUPS.id
  - `study_session_id` (int) → STUDY_SESSIONS.id
- Fields:
  - `name` (string)
  - `url` (string)

Direct Foreign Key Relationships:

1. WORDS_GROUPS → WORDS
2. WORDS_GROUPS → GROUPS
3. STUDY_SESSIONS → GROUPS
4. STUDY_SESSIONS → STUDY_ACTIVITIES
5. WORD_REVIEW_ITEMS → WORDS
6. WORD_REVIEW_ITEMS → STUDY_SESSIONS

Each arrow (→) indicates a foreign key relationship where the field references the primary key of another table.

## Project Structure
```
src/
├── api/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── validators/
├── db/
│   ├── migrations/
│   ├── seeds/
│   └── models/
├── services/
│   ├── wordService/
│   ├── groupService/
│   └── studyService/
├── utils/
│   ├── database.ts
│   ├── pagination.ts
│   └── errors.ts
└── tests/
    ├── unit/
    ├── integration/
    └── performance/
```

## API Endpoints

### GET /api/dashboard/last_study_session
Returns information about the most recent study session.

#### JSON Response
```json
{
  "id": 123,
  "group_id": 456,
  "created_at": "2025-02-08T17:20:23-05:00",
  "study_activity_id": 789,
  "group_id": 456,
  "group_name": "Basic Greetings"
}
```

### GET /api/dashboard/study_progress
Returns study progress statistics.
Please note that the frontend will determine progress bar basedon total words studied and total available words.

#### JSON Response

```json
{
  "total_words_studied": 3,
  "total_available_words": 124,
}
```

### GET /api/dashboard/quick-stats

Returns quick overview statistics.

#### JSON Response
```json
{
  "success_rate": 80.0,
  "total_study_sessions": 4,
  "total_active_groups": 3,
  "study_streak_days": 4
}
```

### GET /api/study_activities/:id

#### JSON Response
```json
{
  "id": 1,
  "name": "Vocabulary Quiz",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "description": "Practice your vocabulary with flashcards"
}
```

### GET /api/study_activities/:id/study_sessions

- pagination with 100 items per page

```json
{
  "items": [
    {
      "id": 123,
      "activity_name": "Vocabulary Quiz",
      "group_name": "Basic Greetings",
      "start_time": "2025-02-08T17:20:23-05:00",
      "end_time": "2025-02-08T17:30:23-05:00",
      "review_items_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 100,
    "items_per_page": 20
  }
}
```

### POST /api/study_activities

#### Request Params
- group_id integer
- study_activity_id integer

#### JSON Response
{
  "id": 124,
  "group_id": 123
}

### GET /api/words

- pagination with 100 items per page

#### JSON Response
```json
{
  "items": [
    {
      "japanese": "こんにちは",
      "romaji": "konnichiwa",
      "english": "hello",
      "correct_count": 5,
      "wrong_count": 2
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 500,
    "items_per_page": 100
  }
}
```

### GET /api/words/:id
#### JSON Response
```json
{
  "japanese": "こんにちは",
  "romaji": "konnichiwa",
  "english": "hello",
  "stats": {
    "correct_count": 5,
    "wrong_count": 2
  },
  "groups": [
    {
      "id": 1,
      "name": "Basic Greetings"
    }
  ]
}
```

### GET /api/groups
- pagination with 100 items per page
#### JSON Response
```json
{
  "items": [
    {
      "id": 1,
      "name": "Basic Greetings",
      "word_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 10,
    "items_per_page": 100
  }
}
```

### GET /api/groups/:id
#### JSON Response
```json
{
  "id": 1,
  "name": "Basic Greetings",
  "stats": {
    "total_word_count": 20
  }
}
```

### GET /api/groups/:id/words
#### JSON Response
```json
{
  "items": [
    {
      "japanese": "こんにちは",
      "romaji": "konnichiwa",
      "english": "hello",
      "correct_count": 5,
      "wrong_count": 2
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 20,
    "items_per_page": 100
  }
}
```

### GET /api/groups/:id/study_sessions
#### JSON Response
```json
{
  "items": [
    {
      "id": 123,
      "activity_name": "Vocabulary Quiz",
      "group_name": "Basic Greetings",
      "start_time": "2025-02-08T17:20:23-05:00",
      "end_time": "2025-02-08T17:30:23-05:00",
      "review_items_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 5,
    "items_per_page": 100
  }
}
```

### GET /api/study_sessions
- pagination with 100 items per page
#### JSON Response
```json
{
  "items": [
    {
      "id": 123,
      "activity_name": "Vocabulary Quiz",
      "group_name": "Basic Greetings",
      "start_time": "2025-02-08T17:20:23-05:00",
      "end_time": "2025-02-08T17:30:23-05:00",
      "review_items_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 100,
    "items_per_page": 100
  }
}
```

### GET /api/study_sessions/:id
#### JSON Response
```json
{
  "id": 123,
  "activity_name": "Vocabulary Quiz",
  "group_name": "Basic Greetings",
  "start_time": "2025-02-08T17:20:23-05:00",
  "end_time": "2025-02-08T17:30:23-05:00",
  "review_items_count": 20
}
```

### GET /api/study_sessions/:id/words
- pagination with 100 items per page
#### JSON Response
```json
{
  "items": [
    {
      "japanese": "こんにちは",
      "romaji": "konnichiwa",
      "english": "hello",
      "correct_count": 5,
      "wrong_count": 2
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 20,
    "items_per_page": 100
  }
}
```

### POST /api/reset_history
#### JSON Response
```json
{
  "success": true,
  "message": "Study history has been reset"
}
```

### POST /api/full_reset
#### JSON Response
```json
{
  "success": true,
  "message": "System has been fully reset"
}
```

### POST /api/study_sessions/:id/words/:word_id/review
#### Request Params
- id (study_session_id) integer
- word_id integer
- correct boolean

#### Request Payload
```json
{
  "correct": true
}
```

#### JSON Response
```json
{
  "success": true,
  "word_id": 1,
  "study_session_id": 123,
  "correct": true,
  "created_at": "2025-02-08T17:33:07-05:00"
}
```

## Error Codes

| Status Code | Description           | Example Scenario            |
| ----------- | --------------------- | --------------------------- |
| 400         | Bad Request           | Missing required fields     |
| 404         | Not Found             | Resource doesn't exist      |
| 500         | Internal Server Error | Database connection failure |

## Common Response Headers

```
Content-Type: application/json
Cache-Control: no-cache
```

## Rate Limiting

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1644915200
```

## Pagination Details

- Default page size: 20 items
- Maximum page size: 100 items
- Page numbers start at 1
- Total count included in all paginated responses

## Date Format

All dates are returned in ISO 8601 format:

```
YYYY-MM-DDTHH:mm:ssZ
```

## Response Envelope

All responses follow this general structure:

```