import request from 'supertest';
import app from '../../../app';
import { 
  clearDatabase, 
  createTestGroup, 
  createTestStudyActivity,
  createTestStudySession,
  createTestWord,
  createTestWordReview
} from '../../helpers';

describe('DashboardController', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/dashboard/last_study_session', () => {
    it('should return the most recent study session', async () => {
      const groupId = await createTestGroup('Test Group');
      const activityId = await createTestStudyActivity({
        name: 'Test Activity',
        url: '/test'
      });
      await createTestStudySession({
        group_id: groupId,
        study_activity_id: activityId
      });

      const response = await request(app)
        .get('/api/dashboard/last_study_session')
        .expect(200);

      expect(response.body.group_name).toBe('Test Group');
    });
  });

  describe('GET /api/dashboard/study_progress', () => {
    it('should return study progress statistics', async () => {
      const groupId = await createTestGroup('Test Group');
      const activityId = await createTestStudyActivity({
        name: 'Test Activity',
        url: '/test'
      });
      const sessionId = await createTestStudySession({
        group_id: groupId,
        study_activity_id: activityId
      });
      const wordId = await createTestWord({
        japanese: 'テスト',
        romaji: 'tesuto',
        english: 'test',
      });
      await createTestWordReview({
        word_id: wordId,
        study_session_id: sessionId,
        correct: true
      });

      const response = await request(app)
        .get('/api/dashboard/study_progress')
        .expect(200);

      expect(response.body.total_words_studied).toBe(1);
      expect(response.body.total_available_words).toBe(1);
    });
  });

  describe('GET /api/dashboard/quick-stats', () => {
    it('should return quick statistics', async () => {
      const groupId = await createTestGroup('Test Group');
      const activityId = await createTestStudyActivity({
        name: 'Test Activity',
        url: '/test'
      });
      const sessionId = await createTestStudySession({
        group_id: groupId,
        study_activity_id: activityId
      });
      const wordId = await createTestWord({
        japanese: 'テスト',
        romaji: 'tesuto',
        english: 'test',
      });
      await createTestWordReview({
        word_id: wordId,
        study_session_id: sessionId,
        correct: true
      });

      const response = await request(app)
        .get('/api/dashboard/quick-stats')
        .expect(200);

      expect(response.body.success_rate).toBe(100);
      expect(response.body.total_study_sessions).toBe(1);
      expect(response.body.total_active_groups).toBe(1);
    });
  });
}); 