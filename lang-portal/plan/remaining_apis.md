# Remaining API Endpoints Plan

## Overview
This document outlines the remaining API endpoints that need to be implemented in the Flask application.

## TODO Endpoints

### 1. GET /groups/:id/words/raw
- **Purpose**: Get raw word data for a specific group
- **Parameters**: 
  - `id`: Group ID (path parameter)
- **Response**:
  ```json
  {
    "words": [
      {
        "id": 1,
        "kanji": "日本語",
        "romaji": "nihongo",
        "english": "Japanese language",
        "parts": {...}
      }
    ]
  }
  ```

### 2. POST /study_sessions (✓ Completed)
- Already implemented in routes/study_sessions.py

### 3. POST /study_sessions/:id/review (✓ Completed)
- Already implemented in routes/study_sessions.py

### 4. GET /dashboard/recent-session
- **Purpose**: Get the most recent study session data
- **Response**:
  ```json
  {
    "session": {
      "id": 1,
      "group_name": "Core Verbs",
      "activity_name": "Flashcards",
      "start_time": "2024-03-21T10:00:00",
      "review_items_count": 10
    }
  }
  ```

## Implementation Priority
1. GET /groups/:id/words/raw
   - Essential for getting raw word data for study activities
   - Required for word list display

2. GET /dashboard/recent-session
   - Enhances user experience with session history
   - Provides quick access to last study activity

## Technical Considerations
- Follow existing patterns for error handling
- Maintain consistent response formats
- Use proper SQL joins for efficient data retrieval
- Keep endpoints RESTful and stateless

## Testing Plan
- Create curl commands for each endpoint
- Test with valid and invalid inputs
- Verify response formats and status codes 