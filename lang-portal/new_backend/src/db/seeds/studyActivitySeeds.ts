import { Database } from 'sqlite';

export async function seedStudyActivities(db: Database) {
  const activities = [
    {
      name: 'Vocabulary Quiz',
      url: '/activities/vocabulary-quiz'
    },
    {
      name: 'Flashcards',
      url: '/activities/flashcards'
    },
    {
      name: 'Writing Practice',
      url: '/activities/writing'
    }
  ];

  for (const activity of activities) {
    await db.run(
      'INSERT INTO STUDY_ACTIVITIES (name, url) VALUES (?, ?)',
      [activity.name, activity.url]
    );
  }
} 