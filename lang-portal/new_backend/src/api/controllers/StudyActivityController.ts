import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../../utils/database';
import { AppError } from '../../middleware/errorHandler';

export class StudyActivityController {
  static async getActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = (page - 1) * limit;

      const db = await getDatabase();
      
      const [items, [{ total }]] = await Promise.all([
        db.all(`
          SELECT * FROM STUDY_ACTIVITIES
          LIMIT ? OFFSET ?
        `, [limit, offset]),
        db.all('SELECT COUNT(*) as total FROM STUDY_ACTIVITIES')
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

  static async getActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const db = await getDatabase();
      const activity = await db.get('SELECT * FROM STUDY_ACTIVITIES WHERE id = ?', req.params.id);

      if (!activity) {
        throw new AppError(404, 'Study activity not found');
      }

      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  static async getActivitySessions(req: Request, res: Response, next: NextFunction) {
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
          WHERE sa.id = ?
          GROUP BY ss.id
          ORDER BY ss.created_at DESC
          LIMIT ? OFFSET ?
        `, [req.params.id, limit, offset]),
        db.all('SELECT COUNT(*) as total FROM STUDY_SESSIONS WHERE study_activity_id = ?', [req.params.id])
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
} 