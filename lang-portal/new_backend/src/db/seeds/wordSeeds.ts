import { Database } from 'sqlite';
import { getDatabase } from '../../utils/database';
import adjectivesData from '../../../seed/data_adjectives.json';
import verbsData from '../../../seed/data_verbs.json';

interface WordInput {
  kanji: string;
  romaji: string;
  english: string;
}

interface WordOutput {
  japanese: string;
  romaji: string;
  english: string;
}

function convertKanjiToJapanese(input: WordInput): WordOutput {
  return {
    japanese: input.kanji,
    romaji: input.romaji,
    english: input.english
  };
}

export async function seedWords(db: Database) {
  try {
    // Create groups first
    await db.run(`
      INSERT INTO GROUPS (name) 
      VALUES 
        ('Adjectives'),
        ('Verbs')
    `);

    // Convert and insert adjectives
    for (const word of adjectivesData) {
      const japaneseWord = convertKanjiToJapanese(word as WordInput);
      await insertWord(db, japaneseWord);
    }

    // Convert and insert verbs
    for (const word of verbsData) {
      const japaneseWord = convertKanjiToJapanese(word as WordInput);
      await insertWord(db, japaneseWord);
    }

    console.log('Words seeded successfully');
  } catch (error) {
    console.error('Error seeding words:', error);
    throw error;
  }
}

async function insertWord(db: Database, word: WordOutput) {
  await db.run(`
    INSERT INTO WORDS (japanese, romaji, english)
    VALUES (?, ?, ?)
  `, [word.japanese, word.romaji, word.english]);
}

export async function createWordGroupAssociations(db: Database) {
  try {
    // Get group IDs - using proper error handling
    const adjectivesGroup = await db.get(`SELECT id FROM GROUPS WHERE name = 'Adjectives'`);
    const verbsGroup = await db.get(`SELECT id FROM GROUPS WHERE name = 'Verbs'`);

    if (!adjectivesGroup || !verbsGroup) {
      throw new Error('Required groups not found');
    }

    // Associate adjectives
    for (const word of adjectivesData) {
      const wordRecord = await db.get(`SELECT id FROM WORDS WHERE japanese = ?`, [word.kanji]);
      if (wordRecord) {
        await db.run(`
          INSERT INTO WORDS_GROUPS (word_id, group_id)
          VALUES (?, ?)
        `, [wordRecord.id, adjectivesGroup.id]);
      }
    }

    // Associate verbs
    for (const word of verbsData) {
      const wordRecord = await db.get(`SELECT id FROM WORDS WHERE japanese = ?`, [word.kanji]);
      if (wordRecord) {
        await db.run(`
          INSERT INTO WORDS_GROUPS (word_id, group_id)
          VALUES (?, ?)
        `, [wordRecord.id, verbsGroup.id]);
      }
    }

    console.log('Word-group associations created successfully');
  } catch (error) {
    console.error('Error creating word-group associations:', error);
    throw error;
  }
} 