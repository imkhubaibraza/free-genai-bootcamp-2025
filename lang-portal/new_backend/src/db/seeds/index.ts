import { Database } from 'sqlite';
import { getDatabase } from '../../utils/database';
import { seedWords, createWordGroupAssociations } from './wordSeeds';
import { seedGroups } from './groupSeeds';
import { seedStudyActivities } from './studyActivitySeeds';

export async function seedDatabase() {
  const db = await getDatabase();
  
  try {
    // Start transaction
    await db.run('BEGIN TRANSACTION');

    // Run seeds in order due to foreign key constraints
    await seedStudyActivities(db);
    await seedGroups(db);
    await seedWords(db);
    await createWordGroupAssociations(db);

    // Commit transaction
    await db.run('COMMIT');
    console.log('Database seeded successfully');
  } catch (error) {
    // Rollback on error
    await db.run('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  }
} 