import { getDatabase } from '../utils/database';
import { Database } from 'sqlite';
import { AppError } from '../middleware/errorHandler';

export async function clearDatabase() {
  const db = await getDatabase();
  await db.exec(`
    DELETE FROM WORD_REVIEW_ITEMS;
    DELETE FROM STUDY_SESSIONS;
    DELETE FROM WORDS_GROUPS;
    DELETE FROM WORDS;
    DELETE FROM GROUPS;
    DELETE FROM STUDY_ACTIVITIES;
  `);
}

export async function createTestWord(data: {
  japanese: string;
  romaji: string;
  english: string;
  parts?: string;
}): Promise<number> {
  const db = await getDatabase();
  const result = await db.run(
    'INSERT INTO WORDS (japanese, romaji, english, parts) VALUES (?, ?, ?, ?)',
    [data.japanese, data.romaji, data.english, data.parts || null]
  );
  if (!result.lastID) throw new AppError(500, 'Failed to create test word');
  return result.lastID;
}

export async function createTestGroup(name: string): Promise<number> {
  const db = await getDatabase();
  const result = await db.run(
    'INSERT INTO GROUPS (name, words_count) VALUES (?, 0)',
    [name]
  );
  if (!result.lastID) throw new AppError(500, 'Failed to create test group');
  return result.lastID;
}

export async function createTestStudyActivity(data: {
  name: string;
  url: string;
}): Promise<number> {
  const db = await getDatabase();
  const result = await db.run(
    'INSERT INTO STUDY_ACTIVITIES (name, url) VALUES (?, ?)',
    [data.name, data.url]
  );
  if (!result.lastID) throw new AppError(500, 'Failed to create test activity');
  return result.lastID;
}

export async function createTestStudySession(data: {
  group_id: number;
  study_activity_id: number;
}): Promise<number> {
  const db = await getDatabase();
  const result = await db.run(
    'INSERT INTO STUDY_SESSIONS (group_id, study_activity_id, created_at) VALUES (?, ?, datetime("now"))',
    [data.group_id, data.study_activity_id]
  );
  if (!result.lastID) throw new AppError(500, 'Failed to create test session');
  return result.lastID;
}

export async function createTestWordReview(data: {
  word_id: number;
  study_session_id: number;
  correct: boolean;
}): Promise<number> {
  const db = await getDatabase();
  const result = await db.run(
    'INSERT INTO WORD_REVIEW_ITEMS (word_id, study_session_id, correct, created_at) VALUES (?, ?, ?, datetime("now"))',
    [data.word_id, data.study_session_id, data.correct]
  );
  if (!result.lastID) throw new AppError(500, 'Failed to create test review');
  return result.lastID;
} 