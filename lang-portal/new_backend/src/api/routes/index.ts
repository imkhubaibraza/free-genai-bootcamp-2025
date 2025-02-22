import { Express } from 'express';
import wordRoutes from './wordRoutes';
import groupRoutes from './groupRoutes';
import studyRoutes from './studyRoutes';
import dashboardRoutes from './dashboardRoutes';
import studyActivityRoutes from './studyActivityRoutes';

export function setupRoutes(app: Express) {
  app.use('/words', wordRoutes);
  app.use('/groups', groupRoutes);
  app.use('/study_sessions', studyRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.use('/study_activities', studyActivityRoutes);
} 