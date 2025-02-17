export interface BaseModel {
  id: number;
}

export interface Word extends BaseModel {
  japanese: string;
  romaji: string;
  english: string;
  parts: string;
}

export interface Group extends BaseModel {
  name: string;
  words_count: number;
}

export interface StudySession extends BaseModel {
  group_id: number;
  study_activity_id: number;
  created_at: string;
}

export interface WordReviewItem extends BaseModel {
  word_id: number;
  study_session_id: number;
  correct: boolean;
  created_at: string;
}

export interface StudyActivity extends BaseModel {
  name: string;
  url: string;
} 