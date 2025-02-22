import { Router } from 'express';
import { WordController } from '../controllers/WordController';
import { validateRequest } from '../middleware/validateRequest';
import { wordSchema, paginationSchema, idParamSchema } from '../validators/schemas';

const router = Router();

router.get('/', validateRequest(paginationSchema), WordController.getWords);
router.get('/:id', validateRequest(idParamSchema), WordController.getWord);
router.post('/', validateRequest(wordSchema), WordController.createWord);

export default router; 