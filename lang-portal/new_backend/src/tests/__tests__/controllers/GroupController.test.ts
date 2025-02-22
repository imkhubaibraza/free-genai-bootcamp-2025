import request from 'supertest';
import app from '../../../app';
import { clearDatabase, createTestGroup, createTestWord } from '../../helpers';
import { getDatabase } from '../../../utils/database';

describe('GroupController', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/groups', () => {
    it('should return paginated groups', async () => {
      await createTestGroup('Test Group');

      const response = await request(app)
        .get('/api/groups')
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.items[0].name).toBe('Test Group');
    });

    it('should handle pagination', async () => {
      for (let i = 0; i < 15; i++) {
        await createTestGroup(`Test Group ${i}`);
      }

      const response = await request(app)
        .get('/api/groups?page=2&limit=10')
        .expect(200);

      expect(response.body.items).toHaveLength(5);
      expect(response.body.pagination.current_page).toBe(2);
    });
  });

  describe('GET /api/groups/:id', () => {
    it('should return a single group', async () => {
      const groupId = await createTestGroup('Test Group');

      const response = await request(app)
        .get(`/api/groups/${groupId}`)
        .expect(200);

      expect(response.body.name).toBe('Test Group');
    });

    it('should return 404 for non-existent group', async () => {
      await request(app)
        .get('/api/groups/999')
        .expect(404);
    });
  });

  describe('GET /api/groups/:id/words', () => {
    it('should return words in the group', async () => {
      const groupId = await createTestGroup('Test Group');
      const wordId = await createTestWord({
        japanese: 'テスト',
        romaji: 'tesuto',
        english: 'test',
      });

      const db = await getDatabase();
      await db.run(
        'INSERT INTO WORDS_GROUPS (word_id, group_id) VALUES (?, ?)',
        [wordId, groupId]
      );

      const response = await request(app)
        .get(`/api/groups/${groupId}/words`)
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].japanese).toBe('テスト');
    });
  });
}); 