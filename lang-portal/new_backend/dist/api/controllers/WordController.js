"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordController = void 0;
const Word_1 = require("../../db/models/Word");
const errorHandler_1 = require("../../middleware/errorHandler");
class WordController {
    static async getWords(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const { items, total } = await Word_1.WordModel.findAll(page, limit);
            res.json({
                items,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(total / limit),
                    total_items: total,
                    items_per_page: limit
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getWord(req, res, next) {
        try {
            const word = await Word_1.WordModel.findById(parseInt(req.params.id));
            if (!word) {
                throw new errorHandler_1.AppError(404, 'Word not found');
            }
            res.json(word);
        }
        catch (error) {
            next(error);
        }
    }
    static async createWord(req, res, next) {
        try {
            const word = await Word_1.WordModel.create(req.body);
            res.status(201).json(word);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WordController = WordController;
