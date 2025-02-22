import { getDatabase } from '../../utils/database';
import { Word } from './types';
import { AppError } from '../../middleware/errorHandler';

export class WordModel {
  static async findById(id: number): Promise<Word | null> {
    const db = await getDatabase();
    const word = await db.get<Word>('SELECT * FROM WORDS WHERE id = ?', id);
    return word || null;
  }

  static async findAll(page: number = 1, limit: number = 100): Promise<{ items: Word[], total: number }> {
    const db = await getDatabase();
    const offset = (page - 1) * limit;

    const [items, [{ total }]] = await Promise.all([
      db.all<Word[]>('SELECT * FROM WORDS LIMIT ? OFFSET ?', [limit, offset]),
      db.all<[{ total: number }]>('SELECT COUNT(*) as total FROM WORDS')
    ]);

    return { items, total };
  }

  static async create(word: Omit<Word, 'id'>): Promise<Word> {
    const db = await getDatabase();
    const result = await db.run(
      'INSERT INTO WORDS (japanese, romaji, english, parts) VALUES (?, ?, ?, ?)',
      [word.japanese, word.romaji, word.english, word.parts]
    );

    if (!result.lastID) throw new AppError(500, 'Failed to create word');

    return {
      id: result.lastID,
      ...word
    };
  }
} 