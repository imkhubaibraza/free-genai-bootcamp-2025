import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../../utils/database';

export class DashboardController {
  static async getLastStudySession(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await getDatabase();
      const lastSession = await db.get(`
        SELECT 
          ss.*,
          g.name as group_name
        FROM STUDY_SESSIONS ss
        JOIN GROUPS g ON g.id = ss.group_id
        ORDER BY ss.created_at DESC
        LIMIT 1
      `);

      res.json(lastSession || null);
    } catch (error) {
      next(error);
    }
  }

  static async getStudyProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await getDatabase();
      const [{ total_words_studied }] = await db.all(`
        SELECT COUNT(DISTINCT word_id) as total_words_studied
        FROM WORD_REVIEW_ITEMS
      `);
      
      const [{ total_available_words }] = await db.all(`
        SELECT COUNT(*) as total_available_words
        FROM WORDS
      `);

      res.json({
        total_words_studied,
        total_available_words
      });
    } catch (error) {
      next(error);
    }
  }

  static async getQuickStats(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await getDatabase();
      
      // Calculate success rate
      const [{ success_rate }] = await db.all(`
        SELECT 
          ROUND(AVG(CASE WHEN correct THEN 100 ELSE 0 END), 1) as success_rate
        FROM WORD_REVIEW_ITEMS
      `);

      // Get total study sessions
      const [{ total_study_sessions }] = await db.all(`
        SELECT COUNT(*) as total_study_sessions
        FROM STUDY_SESSIONS
      `);

      // Get total active groups
      const [{ total_active_groups }] = await db.all(`
        SELECT COUNT(DISTINCT group_id) as total_active_groups
        FROM STUDY_SESSIONS
      `);

      res.json({
        success_rate: success_rate || 0,
        total_study_sessions,
        total_active_groups,
        study_streak_days: 0 // TODO: Implement streak calculation
      });
    } catch (error) {
      next(error);
    }
  }
} 