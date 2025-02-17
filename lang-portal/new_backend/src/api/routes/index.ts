import { Express } from 'express';
import wordRoutes from './wordRoutes';
import groupRoutes from './groupRoutes';
import studyRoutes from './studyRoutes';
import dashboardRoutes from './dashboardRoutes';
import studyActivityRoutes from './studyActivityRoutes';

export function setupRoutes(app: Express) {
  app.use('/api/words', wordRoutes);
  app.use('/api/groups', groupRoutes);
  app.use('/api/study_sessions', studyRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/study_activities', studyActivityRoutes);
} 