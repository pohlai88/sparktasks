export interface Query {
  text?: string;
  tags?: string[];
  status?: ('TODAY' | 'LATER' | 'DONE' | 'ARCHIVED')[];
  priority?: ('P0' | 'P1' | 'P2')[];
  dueFrom?: string;
  dueTo?: string;
  snoozeActive?: boolean;
  createdFrom?: string;
  createdTo?: string;
}

export interface Page {
  offset: number;
  limit: number;
}

export interface Result<T> {
  total: number;
  items: T[];
}
