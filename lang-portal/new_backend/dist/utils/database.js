"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = getDatabase;
exports.initializeDatabase = initializeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
let db = null;
async function getDatabase() {
    if (db)
        return db;
    db = await (0, sqlite_1.open)({
        filename: path_1.default.resolve(__dirname, '../../database.sqlite'),
        driver: sqlite3_1.default.Database
    });
    return db;
}
async function initializeDatabase() {
    const database = await getDatabase();
    await database.exec(`
    CREATE TABLE IF NOT EXISTS WORDS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      japanese TEXT NOT NULL,
      romaji TEXT NOT NULL,
      english TEXT NOT NULL,
      parts TEXT
    );

    CREATE TABLE IF NOT EXISTS GROUPS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      words_count INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS WORDS_GROUPS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      group_id INTEGER NOT NULL,
      FOREIGN KEY (word_id) REFERENCES WORDS (id),
      FOREIGN KEY (group_id) REFERENCES GROUPS (id)
    );

    CREATE TABLE IF NOT EXISTS STUDY_ACTIVITIES (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS STUDY_SESSIONS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      study_activity_id INTEGER NOT NULL,
      created_at DATETIME NOT NULL,
      FOREIGN KEY (group_id) REFERENCES GROUPS (id),
      FOREIGN KEY (study_activity_id) REFERENCES STUDY_ACTIVITIES (id)
    );

    CREATE TABLE IF NOT EXISTS WORD_REVIEW_ITEMS (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      study_session_id INTEGER NOT NULL,
      correct BOOLEAN NOT NULL,
      created_at DATETIME NOT NULL,
      FOREIGN KEY (word_id) REFERENCES WORDS (id),
      FOREIGN KEY (study_session_id) REFERENCES STUDY_SESSIONS (id)
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_words_groups_word_id ON WORDS_GROUPS (word_id);
    CREATE INDEX IF NOT EXISTS idx_words_groups_group_id ON WORDS_GROUPS (group_id);
    CREATE INDEX IF NOT EXISTS idx_word_review_items_word_id ON WORD_REVIEW_ITEMS (word_id);
    CREATE INDEX IF NOT EXISTS idx_word_review_items_session_id ON WORD_REVIEW_ITEMS (study_session_id);
    CREATE INDEX IF NOT EXISTS idx_study_sessions_group_id ON STUDY_SESSIONS (group_id);
    CREATE INDEX IF NOT EXISTS idx_study_sessions_activity_id ON STUDY_SESSIONS (study_activity_id);
  `);
}
