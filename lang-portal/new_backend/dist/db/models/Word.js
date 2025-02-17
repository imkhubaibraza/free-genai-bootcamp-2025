"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordModel = void 0;
const database_1 = require("../../utils/database");
const errorHandler_1 = require("../../middleware/errorHandler");
class WordModel {
    static async findById(id) {
        const db = await (0, database_1.getDatabase)();
        const word = await db.get('SELECT * FROM WORDS WHERE id = ?', id);
        return word || null;
    }
    static async findAll(page = 1, limit = 100) {
        const db = await (0, database_1.getDatabase)();
        const offset = (page - 1) * limit;
        const [items, [{ total }]] = await Promise.all([
            db.all('SELECT * FROM WORDS LIMIT ? OFFSET ?', [limit, offset]),
            db.all('SELECT COUNT(*) as total FROM WORDS')
        ]);
        return { items, total };
    }
    static async create(word) {
        const db = await (0, database_1.getDatabase)();
        const result = await db.run('INSERT INTO WORDS (japanese, romaji, english, parts) VALUES (?, ?, ?, ?)', [word.japanese, word.romaji, word.english, word.parts]);
        if (!result.lastID)
            throw new errorHandler_1.AppError(500, 'Failed to create word');
        return {
            id: result.lastID,
            ...word
        };
    }
}
exports.WordModel = WordModel;
