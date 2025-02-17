import { Router } from 'express';
import { StudyController } from '../controllers/StudyController';
import { validateRequest } from '../middleware/validateRequest';
import { 
  studySessionSchema, 
  wordReviewSchema, 
  paginationSchema, 
  idParamSchema 
} from '../validators/schemas';

const router = Router();

router.get('/', validateRequest(paginationSchema), StudyController.getStudySessions);
router.get('/:id', validateRequest(idParamSchema), StudyController.getStudySession);
router.get('/:id/words', validateRequest(paginationSchema), StudyController.getStudySessionWords);
router.post('/', validateRequest(studySessionSchema), StudyController.createStudySession);
router.post('/:id/words/:word_id/review', validateRequest(wordReviewSchema), StudyController.reviewWord);
router.post('/reset_history', StudyController.resetHistory);
router.post('/full_reset', StudyController.fullReset);

export default router; 