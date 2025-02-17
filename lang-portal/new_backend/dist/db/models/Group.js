"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupModel = void 0;
const database_1 = require("../../utils/database");
class GroupModel {
    static async findById(id) {
        const db = await (0, database_1.getDatabase)();
        const group = await db.get('SELECT * FROM GROUPS WHERE id = ?', id);
        return group || null;
    }
    static async findAll(page = 1, limit = 100) {
        const db = await (0, database_1.getDatabase)();
        const offset = (page - 1) * limit;
        const [items, [{ total }]] = await Promise.all([
            db.all('SELECT * FROM GROUPS LIMIT ? OFFSET ?', [limit, offset]),
            db.all('SELECT COUNT(*) as total FROM GROUPS')
        ]);
        return { items, total };
    }
    static async getGroupWords(groupId, page = 1, limit = 100) {
        const db = await (0, database_1.getDatabase)();
        const offset = (page - 1) * limit;
        const [items, [{ total }]] = await Promise.all([
            db.all(`
        SELECT w.* FROM WORDS w
        JOIN WORDS_GROUPS wg ON w.id = wg.word_id
        WHERE wg.group_id = ?
        LIMIT ? OFFSET ?
      `, [groupId, limit, offset]),
            db.all(`
        SELECT COUNT(*) as total FROM WORDS_GROUPS 
        WHERE group_id = ?
      `, [groupId])
        ]);
        return { items, total };
    }
}
exports.GroupModel = GroupModel;
