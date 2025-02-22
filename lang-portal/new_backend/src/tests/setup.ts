import { getDatabase, initializeDatabase } from '../utils/database';
import { seedDatabase } from '../db/seeds';
import { clearDatabase } from './helpers';

beforeAll(async () => {
  try {
    // Initialize test database
    await initializeDatabase();
    await seedDatabase();
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    const db = await getDatabase();
    await db.close();
  } catch (error) {
    console.error('Failed to close test database:', error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    await clearDatabase();
  } catch (error) {
    console.error('Failed to clear test database:', error);
    throw error;
  }
}); 