import { Database } from 'sqlite';

export async function seedWords(db: Database) {
  const words = [
    {
      japanese: 'こんにちは',
      romaji: 'konnichiwa',
      english: 'hello',
      parts: JSON.stringify({ type: 'greeting', formality: 'neutral' })
    },
    {
      japanese: 'さようなら',
      romaji: 'sayounara',
      english: 'goodbye',
      parts: JSON.stringify({ type: 'greeting', formality: 'formal' })
    },
    {
      japanese: 'ありがとう',
      romaji: 'arigatou',
      english: 'thank you',
      parts: JSON.stringify({ type: 'gratitude', formality: 'neutral' })
    }
  ];

  for (const word of words) {
    await db.run(
      'INSERT INTO WORDS (japanese, romaji, english, parts) VALUES (?, ?, ?, ?)',
      [word.japanese, word.romaji, word.english, word.parts]
    );
  }
}

export async function createWordGroupAssociations(db: Database) {
  // Associate words with groups
  const associations = [
    { word_index: 1, group_name: 'Basic Greetings' },
    { word_index: 2, group_name: 'Basic Greetings' },
    { word_index: 3, group_name: 'Basic Greetings' }
  ];

  for (const assoc of associations) {
    const word = await db.get(
      'SELECT id FROM WORDS LIMIT 1 OFFSET ?', 
      [assoc.word_index - 1]
    );
    const group = await db.get(
      'SELECT id FROM GROUPS WHERE name = ?', 
      [assoc.group_name]
    );

    if (word && group) {
      await db.run(
        'INSERT INTO WORDS_GROUPS (word_id, group_id) VALUES (?, ?)',
        [word.id, group.id]
      );

      // Update group word count
      await db.run(
        'UPDATE GROUPS SET words_count = words_count + 1 WHERE id = ?',
        [group.id]
      );
    }
  }
} 