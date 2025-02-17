import { Database } from 'sqlite';

export async function seedGroups(db: Database) {
  const groups = [
    {
      name: 'Basic Greetings',
      words_count: 0
    },
    {
      name: 'Numbers 1-10',
      words_count: 0
    },
    {
      name: 'Common Verbs',
      words_count: 0
    }
  ];

  for (const group of groups) {
    await db.run(
      'INSERT INTO GROUPS (name, words_count) VALUES (?, ?)',
      [group.name, group.words_count]
    );
  }
} 