"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.paginationSchema = exports.wordReviewSchema = exports.studySessionSchema = exports.wordSchema = void 0;
const zod_1 = require("zod");
exports.wordSchema = zod_1.z.object({
    body: zod_1.z.object({
        japanese: zod_1.z.string().min(1, 'Japanese text is required'),
        romaji: zod_1.z.string().min(1, 'Romaji is required'),
        english: zod_1.z.string().min(1, 'English translation is required'),
        parts: zod_1.z.string().optional()
    })
});
exports.studySessionSchema = zod_1.z.object({
    body: zod_1.z.object({
        group_id: zod_1.z.number().int().positive('Group ID must be a positive integer'),
        study_activity_id: zod_1.z.number().int().positive('Study Activity ID must be a positive integer')
    })
});
exports.wordReviewSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Invalid study session ID'),
        word_id: zod_1.z.string().regex(/^\d+$/, 'Invalid word ID')
    }),
    body: zod_1.z.object({
        correct: zod_1.z.boolean({
            required_error: 'Correct field is required',
            invalid_type_error: 'Correct must be a boolean'
        })
    })
});
exports.paginationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/, 'Page must be a number').optional(),
        limit: zod_1.z.string().regex(/^\d+$/, 'Limit must be a number').optional()
    })
});
exports.idParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Invalid ID parameter')
    })
});
