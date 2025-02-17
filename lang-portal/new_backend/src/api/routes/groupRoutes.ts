import { Router } from 'express';
import { GroupController } from '../controllers/GroupController';
import { validateRequest } from '../middleware/validateRequest';
import { paginationSchema, idParamSchema } from '../validators/schemas';

const router = Router();

router.get('/', validateRequest(paginationSchema), GroupController.getGroups);
router.get('/:id', validateRequest(idParamSchema), GroupController.getGroup);
router.get('/:id/words', validateRequest(paginationSchema), GroupController.getGroupWords);
router.get('/:id/study_sessions', validateRequest(paginationSchema), GroupController.getGroupStudySessions);

export default router; 