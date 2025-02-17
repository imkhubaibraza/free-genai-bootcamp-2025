import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';

const isTest = process.env.NODE_ENV === 'test';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) return db;
  
  db = await open({
    filename: isTest ? ':memory:' : path.resolve(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await db.run('PRAGMA foreign_keys = ON');
  
  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();
  
  await database.exec(`
    CREATE TABLE IF NOT EXISTS WORDS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      japanese TEXT NOT NULL,
      romaji TEXT NOT NULL,
      english TEXT NOT NULL,
      parts TEXT
    );

    CREATE TABLE IF NOT EXISTS GROUPS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      words_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS WORDS_GROUPS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      group_id INTEGER NOT NULL,
      FOREIGN KEY (word_id) REFERENCES WORDS (id) ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES GROUPS (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS STUDY_ACTIVITIES (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS STUDY_SESSIONS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      study_activity_id INTEGER NOT NULL,
      created_at DATETIME NOT NULL,
      FOREIGN KEY (group_id) REFERENCES GROUPS (id) ON DELETE CASCADE,
      FOREIGN KEY (study_activity_id) REFERENCES STUDY_ACTIVITIES (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS WORD_REVIEW_ITEMS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      study_session_id INTEGER NOT NULL,
      correct BOOLEAN NOT NULL,
      created_at DATETIME NOT NULL,
      FOREIGN KEY (word_id) REFERENCES WORDS (id) ON DELETE CASCADE,
      FOREIGN KEY (study_session_id) REFERENCES STUDY_SESSIONS (id) ON DELETE CASCADE
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_words_groups_word_id ON WORDS_GROUPS (word_id);
    CREATE INDEX IF NOT EXISTS idx_words_groups_group_id ON WORDS_GROUPS (group_id);
    CREATE INDEX IF NOT EXISTS idx_word_review_items_word_id ON WORD_REVIEW_ITEMS (word_id);
    CREATE INDEX IF NOT EXISTS idx_word_review_items_session_id ON WORD_REVIEW_ITEMS (study_session_id);
    CREATE INDEX IF NOT EXISTS idx_study_sessions_group_id ON STUDY_SESSIONS (group_id);
    CREATE INDEX IF NOT EXISTS idx_study_sessions_activity_id ON STUDY_SESSIONS (study_activity_id);
  `);
} 