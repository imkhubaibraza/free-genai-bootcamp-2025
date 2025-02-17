import { z } from 'zod';

export const wordSchema = z.object({
  body: z.object({
    japanese: z.string().min(1, 'Japanese text is required'),
    romaji: z.string().min(1, 'Romaji is required'),
    english: z.string().min(1, 'English translation is required'),
    parts: z.string().optional()
  })
});

export const studySessionSchema = z.object({
  body: z.object({
    group_id: z.number().int().positive('Group ID must be a positive integer'),
    study_activity_id: z.number().int().positive('Study Activity ID must be a positive integer')
  })
});

export const wordReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid study session ID'),
    word_id: z.string().regex(/^\d+$/, 'Invalid word ID')
  }),
  body: z.object({
    correct: z.boolean({
      required_error: 'Correct field is required',
      invalid_type_error: 'Correct must be a boolean'
    })
  })
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional()
  })
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID parameter')
  })
}); 