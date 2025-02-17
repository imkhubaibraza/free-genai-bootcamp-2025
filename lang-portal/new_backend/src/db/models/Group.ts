import { getDatabase } from '../../utils/database';
import { Group } from './types';
import { AppError } from '../../middleware/errorHandler';

export class GroupModel {
  static async findById(id: number): Promise<Group | null> {
    const db = await getDatabase();
    const group = await db.get<Group>('SELECT * FROM GROUPS WHERE id = ?', id);
    return group || null;
  }

  static async findAll(page: number = 1, limit: number = 100): Promise<{ items: Group[], total: number }> {
    const db = await getDatabase();
    const offset = (page - 1) * limit;

    const [items, [{ total }]] = await Promise.all([
      db.all<Group[]>('SELECT * FROM GROUPS LIMIT ? OFFSET ?', [limit, offset]),
      db.all<[{ total: number }]>('SELECT COUNT(*) as total FROM GROUPS')
    ]);

    return { items, total };
  }

  static async getGroupWords(groupId: number, page: number = 1, limit: number = 100) {
    const db = await getDatabase();
    const offset = (page - 1) * limit;

    const [items, [{ total }]] = await Promise.all([
      db.all(`
        SELECT w.* FROM WORDS w
        JOIN WORDS_GROUPS wg ON w.id = wg.word_id
        WHERE wg.group_id = ?
        LIMIT ? OFFSET ?
      `, [groupId, limit, offset]),
      db.all<[{ total: number }]>(`
        SELECT COUNT(*) as total FROM WORDS_GROUPS 
        WHERE group_id = ?
      `, [groupId])
    ]);

    return { items, total };
  }
} 