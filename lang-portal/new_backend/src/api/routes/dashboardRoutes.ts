import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';

const router = Router();

router.get('/last_study_session', DashboardController.getLastStudySession);
router.get('/study_progress', DashboardController.getStudyProgress);
router.get('/quick-stats', DashboardController.getQuickStats);

export default router; 