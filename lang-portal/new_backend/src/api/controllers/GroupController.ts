import { Request, Response, NextFunction } from 'express';
import { GroupModel } from '../../db/models/Group';
import { AppError } from '../../middleware/errorHandler';

export class GroupController {
  static async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;

      const { items, total } = await GroupModel.findAll(page, limit);

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

  static async getGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const group = await GroupModel.findById(parseInt(req.params.id));
      
      if (!group) {
        throw new AppError(404, 'Group not found');
      }

      res.json(group);
    } catch (error) {
      next(error);
    }
  }

  static async getGroupWords(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseInt(req.params.id);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;

      const { items, total } = await GroupModel.getGroupWords(groupId, page, limit);

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

  static async getGroupStudySessions(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = parseInt(req.params.id);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;

      // TODO: Implement study sessions retrieval
      res.json({
        items: [],
        pagination: {
          current_page: page,
          total_pages: 0,
          total_items: 0,
          items_per_page: limit
        }
      });
    } catch (error) {
      next(error);
    }
  }
} 