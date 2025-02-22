import request from 'supertest';
import app from '../../../app';
import { 
  clearDatabase, 
  createTestGroup, 
  createTestStudyActivity,
  createTestStudySession,
  createTestWord,
  createTestWordReview,
  sqliteBoolean
} from '../../helpers/index';

describe('StudyController', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/study_sessions', () => {
    it('should return paginated study sessions', async () => {
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
        .get('/api/study_sessions')
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].group_name).toBe('Test Group');
    });
  });

  describe('POST /api/study_sessions', () => {
    it('should create a new study session', async () => {
      const groupId = await createTestGroup('Test Group');
      const activityId = await createTestStudyActivity({
        name: 'Test Activity',
        url: '/test'
      });

      const response = await request(app)
        .post('/api/study_sessions')
        .send({
          group_id: groupId,
          study_activity_id: activityId
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/study_sessions')
        .send({
          group_id: 1
          // missing study_activity_id
        })
        .expect(400);
    });
  });

  describe('POST /api/study_sessions/:id/words/:word_id/review', () => {
    it('should record a word review', async () => {
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

      const response = await request(app)
        .post(`/api/study_sessions/${sessionId}/words/${wordId}/review`)
        .send({ correct: true })
        .expect(201);

      expect(response.body.word_id).toBe(wordId);
      expect(sqliteBoolean(response.body.correct)).toBe(true);
    });
  });
}); 