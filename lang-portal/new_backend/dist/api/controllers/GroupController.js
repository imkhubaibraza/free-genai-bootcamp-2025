"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const Group_1 = require("../../db/models/Group");
const errorHandler_1 = require("../../middleware/errorHandler");
class GroupController {
    static async getGroups(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const { items, total } = await Group_1.GroupModel.findAll(page, limit);
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
    static async getGroup(req, res, next) {
        try {
            const group = await Group_1.GroupModel.findById(parseInt(req.params.id));
            if (!group) {
                throw new errorHandler_1.AppError(404, 'Group not found');
            }
            res.json(group);
        }
        catch (error) {
            next(error);
        }
    }
    static async getGroupWords(req, res, next) {
        try {
            const groupId = parseInt(req.params.id);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
            const { items, total } = await Group_1.GroupModel.getGroupWords(groupId, page, limit);
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
    static async getGroupStudySessions(req, res, next) {
        try {
            const groupId = parseInt(req.params.id);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100;
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GroupController = GroupController;
