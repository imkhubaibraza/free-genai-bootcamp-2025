import { Request, Response, NextFunction } from 'express';
import { WordModel } from '../../db/models/Word';
import { AppError } from '../../middleware/errorHandler';

export class WordController {
  static async getWords(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;

      const { items, total } = await WordModel.findAll(page, limit);

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

  static async getWord(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await WordModel.findById(parseInt(req.params.id));
      
      if (!word) {
        throw new AppError(404, 'Word not found');
      }

      res.json(word);
    } catch (error) {
      next(error);
    }
  }

  static async createWord(req: Request, res: Response, next: NextFunction) {
    try {
      const word = await WordModel.create(req.body);
      res.status(201).json(word);
    } catch (error) {
      next(error);
    }
  }
} 