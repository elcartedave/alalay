// types/complement.ts

export interface ComplementEntry {
  id: string;
  user_id: string;
  date: string;
  complements: string[];
  created_at: string;
}

export interface ComplementEntryInput {
  user_id: string;
  date: string;
  complements: string[];
}

export function toComplementEntry(data: any): ComplementEntry {
  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    complements: Array.isArray(data.complements)
      ? data.complements
      : JSON.parse(data.complements || "[]"),
    created_at: data.created_at,
  };
}

export function toComplementEntryList(data: any[]): ComplementEntry[] {
  return data.map(toComplementEntry);
}

export function fromComplementEntry(entry: ComplementEntryInput): any {
  return {
    user_id: entry.user_id,
    date: entry.date,
    complements: JSON.stringify(entry.complements),
  };
}
