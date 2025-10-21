// types/journal.ts

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  content: string;
  created_at: string;
}

export interface JournalEntryInput {
  user_id: string;
  date: string;
  content: string;
}

export function toJournalEntry(data: any): JournalEntry {
  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    content: data.content,
    created_at: data.created_at,
  };
}

export function toJournalEntryList(data: any[]): JournalEntry[] {
  return data.map(toJournalEntry);
}

export function fromJournalEntry(entry: JournalEntryInput): any {
  return {
    user_id: entry.user_id,
    date: entry.date,
    content: entry.content,
  };
}
