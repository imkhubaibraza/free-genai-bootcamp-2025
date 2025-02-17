import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../../utils/database';
import { AppError } from '../../middleware/errorHandler';

export class StudyController {
  static async getStudySessions(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = (page - 1) * limit;

      const db = await getDatabase();
      
      const [items, [{ total }]] = await Promise.all([
        db.all(`
          SELECT 
            ss.id,
            sa.name as activity_name,
            g.name as group_name,
            ss.created_at as start_time,
            ss.created_at as end_time,
            COUNT(wri.id) as review_items_count
          FROM STUDY_SESSIONS ss
          JOIN STUDY_ACTIVITIES sa ON sa.id = ss.study_activity_id
          JOIN GROUPS g ON g.id = ss.group_id
          LEFT JOIN WORD_REVIEW_ITEMS wri ON wri.study_session_id = ss.id
          GROUP BY ss.id
          ORDER BY ss.created_at DESC
          LIMIT ? OFFSET ?
        `, [limit, offset]),
        db.all('SELECT COUNT(*) as total FROM STUDY_SESSIONS')
      ]);

      res.json({
        items,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudySession(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await getDatabase();
      const session = await db.get(`
        SELECT 
          ss.id,
          sa.name as activity_name,
          g.name as group_name,
          ss.created_at as start_time,
          ss.created_at as end_time,
          COUNT(wri.id) as review_items_count
        FROM STUDY_SESSIONS ss
        JOIN STUDY_ACTIVITIES sa ON sa.id = ss.study_activity_id
        JOIN GROUPS g ON g.id = ss.group_id
        LEFT JOIN WORD_REVIEW_ITEMS wri ON wri.study_session_id = ss.id
        WHERE ss.id = ?
        GROUP BY ss.id
      `, req.params.id);

      if (!session) {
        throw new AppError(404, 'Study session not found');
      }

      res.json(session);
    } catch (error) {
      next(error);
    }
  }

  static async getStudySessionWords(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = (page - 1) * limit;

      const db = await getDatabase();
      
      const [items, [{ total }]] = await Promise.all([
        db.all(`
          SELECT 
            w.*,
            COUNT(CASE WHEN wri.correct = 1 THEN 1 END) as correct_count,
            COUNT(CASE WHEN wri.correct = 0 THEN 1 END) as wrong_count
          FROM WORDS w
          JOIN WORD_REVIEW_ITEMS wri ON wri.word_id = w.id
          WHERE wri.study_session_id = ?
          GROUP BY w.id
          LIMIT ? OFFSET ?
        `, [req.params.id, limit, offset]),
        db.all(`
          SELECT COUNT(DISTINCT word_id) as total 
          FROM WORD_REVIEW_ITEMS 
          WHERE study_session_id = ?
        `, [req.params.id])
      ]);

      res.json({
        items,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async createStudySession(req: Request, res: Response, next: NextFunction) {
    try {
      const { group_id, study_activity_id } = req.body;
      
      const db = await getDatabase();
      const result = await db.run(`
        INSERT INTO STUDY_SESSIONS (group_id, study_activity_id, created_at)
        VALUES (?, ?, datetime('now'))
      `, [group_id, study_activity_id]);

      if (!result.lastID) {
        throw new AppError(500, 'Failed to create study session');
      }

      res.status(201).json({
        id: result.lastID,
        group_id
      });
    } catch (error) {
      next(error);
    }
  }

  static async reviewWord(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: study_session_id, word_id } = req.params;
      const { correct } = req.body;

      const db = await getDatabase();
      const result = await db.run(`
        INSERT INTO WORD_REVIEW_ITEMS (word_id, study_session_id, correct, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `, [word_id, study_session_id, correct]);

      if (!result.lastID) {
        throw new AppError(500, 'Failed to record word review');
      }

      const review = await db.get(`
        SELECT 
          id,
          word_id,
          study_session_id,
          CASE WHEN correct = 1 THEN true ELSE false END as correct,
          created_at 
        FROM WORD_REVIEW_ITEMS 
        WHERE id = ?
      `, result.lastID);

      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  }

  static async resetHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await getDatabase();
      await db.run('DELETE FROM WORD_REVIEW_ITEMS');
      await db.run('DELETE FROM STUDY_SESSIONS');

      res.json({
        success: true,
        message: 'Study history has been reset'
      });
    } catch (error) {
      next(error);
    }
  }

  static async fullReset(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await getDatabase();
      await db.run('DELETE FROM WORD_REVIEW_ITEMS');
      await db.run('DELETE FROM STUDY_SESSIONS');
      await db.run('DELETE FROM WORDS_GROUPS');
      await db.run('DELETE FROM WORDS');
      await db.run('DELETE FROM GROUPS');

      res.json({
        success: true,
        message: 'System has been fully reset'
      });
    } catch (error) {
      next(error);
    }
  }
} 