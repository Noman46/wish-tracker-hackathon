import db from '../db';

export interface Remark {
  id: number;
  wish_item_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRemarkInput {
  wish_item_id: number;
  content: string;
}

export interface UpdateRemarkInput {
  content: string;
}

export const remarkModel = {
  getByWishItemId(wishItemId: number): Remark[] {
    return db
      .prepare('SELECT * FROM remarks WHERE wish_item_id = ? ORDER BY created_at DESC')
      .all(wishItemId) as Remark[];
  },

  getById(id: number): Remark | null {
    return db.prepare('SELECT * FROM remarks WHERE id = ?').get(id) as Remark | null;
  },

  create(input: CreateRemarkInput): Remark {
    const result = db
      .prepare('INSERT INTO remarks (wish_item_id, content) VALUES (?, ?)')
      .run(input.wish_item_id, input.content);
    
    return this.getById(result.lastInsertRowid as number)!;
  },

  update(id: number, input: UpdateRemarkInput): Remark | null {
    const existing = this.getById(id);
    if (!existing) return null;

    db.prepare('UPDATE remarks SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(input.content, id);

    return this.getById(id);
  },

  delete(id: number): boolean {
    const result = db.prepare('DELETE FROM remarks WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

