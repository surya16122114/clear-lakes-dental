// TypeScript types for database table
export interface DatabaseEntry {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface DatabaseTable {
  entries: DatabaseEntry[];
}

