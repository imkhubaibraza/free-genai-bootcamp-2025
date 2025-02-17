import request from 'supertest';
import app from '../../../app';
import { clearDatabase } from '../../helpers';
import { createTestWord } from '../../helpers';

describe('WordController', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/words', () => {
    it('should return paginated words', async () => {
      // Create test words
      await createTestWord({
        japanese: 'テスト',
        romaji: 'tesuto',
        english: 'test',
      });

      const response = await request(app)
        .get('/api/words')
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.items[0].japanese).toBe('テスト');
    });

    it('should handle pagination parameters', async () => {
      // Create multiple test words
      for (let i = 0; i < 15; i++) {
        await createTestWord({
          japanese: `テスト${i}`,
          romaji: `tesuto${i}`,
          english: `test${i}`,
        });
      }

      const response = await request(app)
        .get('/api/words?page=2&limit=10')
        .expect(200);

      expect(response.body.items).toHaveLength(5);
      expect(response.body.pagination.current_page).toBe(2);
    });
  });

  describe('GET /api/words/:id', () => {
    it('should return a single word', async () => {
      const wordId = await createTestWord({
        japanese: 'テスト',
        romaji: 'tesuto',
        english: 'test',
      });

      const response = await request(app)
        .get(`/api/words/${wordId}`)
        .expect(200);

      expect(response.body.japanese).toBe('テスト');
      expect(response.body.romaji).toBe('tesuto');
      expect(response.body.english).toBe('test');
    });

    it('should return 404 for non-existent word', async () => {
      await request(app)
        .get('/api/words/999')
        .expect(404);
    });
  });

  describe('POST /api/words', () => {
    it('should create a new word', async () => {
      const response = await request(app)
        .post('/api/words')
        .send({
          japanese: 'テスト',
          romaji: 'tesuto',
          english: 'test',
        })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.japanese).toBe('テスト');
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/words')
        .send({
          japanese: 'テスト',
          // missing romaji and english
        })
        .expect(400);
    });
  });
}); 