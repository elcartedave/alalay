export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  mood_score: number;
  notes?: string;
  created_at: string;
}

export interface MoodEntryInput {
  user_id: string;
  date: string;
  mood_score: number;
  notes?: string;
}

export function toMoodEntry(data: any): MoodEntry {
  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    mood_score: data.mood_score,
    notes: data.notes,
    created_at: data.created_at,
  };
}

export function toMoodEntryList(data: any[]): MoodEntry[] {
  return data.map(toMoodEntry);
}

export function fromMoodEntry(entry: MoodEntryInput): any {
  return {
    user_id: entry.user_id,
    date: entry.date,
    mood_score: entry.mood_score,
    notes: entry.notes,
  };
}
