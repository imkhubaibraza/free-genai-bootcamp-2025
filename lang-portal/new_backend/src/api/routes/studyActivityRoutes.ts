import { Router } from 'express';
import { StudyActivityController } from '../controllers/StudyActivityController';
import { validateRequest } from '../middleware/validateRequest';
import { paginationSchema, idParamSchema } from '../validators/schemas';

const router = Router();

router.get('/', validateRequest(paginationSchema), StudyActivityController.getActivities);
router.get('/:id', validateRequest(idParamSchema), StudyActivityController.getActivity);
router.get('/:id/study_sessions', validateRequest(paginationSchema), StudyActivityController.getActivitySessions);

export default router; 