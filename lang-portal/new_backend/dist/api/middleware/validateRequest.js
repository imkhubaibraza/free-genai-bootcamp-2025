"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const errorHandler_1 = require("../../middleware/errorHandler");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(new errorHandler_1.AppError(400, error.errors.map(e => e.message).join(', ')));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
