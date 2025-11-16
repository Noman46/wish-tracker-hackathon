import db from '../db';

export type WishStatus = 'wish' | 'in_progress' | 'achieved';

export interface WishItem {
  id: number;
  title: string;
  description: string | null;
  status: WishStatus;
  category_id: number | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateWishItemInput {
  title: string;
  description?: string;
  status?: WishStatus;
  category_id?: number | null;
  remarks?: string;
}

export interface UpdateWishItemInput {
  title?: string;
  description?: string;
  status?: WishStatus;
  category_id?: number | null;
  remarks?: string;
}

export const wishItemModel = {
  getAll(): WishItem[] {
    return db.prepare('SELECT * FROM wish_items ORDER BY created_at DESC').all() as WishItem[];
  },

  getById(id: number): WishItem | null {
    return db.prepare('SELECT * FROM wish_items WHERE id = ?').get(id) as WishItem | null;
  },

  getByStatus(status: WishStatus): WishItem[] {
    return db.prepare('SELECT * FROM wish_items WHERE status = ? ORDER BY created_at DESC').all(status) as WishItem[];
  },

  getByCategory(categoryId: number): WishItem[] {
    return db.prepare('SELECT * FROM wish_items WHERE category_id = ? ORDER BY created_at DESC').all(categoryId) as WishItem[];
  },

  create(input: CreateWishItemInput): WishItem {
    const status = input.status || 'wish';
    const result = db
      .prepare('INSERT INTO wish_items (title, description, status, category_id, remarks) VALUES (?, ?, ?, ?, ?)')
      .run(
        input.title,
        input.description || null,
        status,
        input.category_id || null,
        input.remarks || null
      );
    
    return this.getById(result.lastInsertRowid as number)!;
  },

  update(id: number, input: UpdateWishItemInput): WishItem | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const title = input.title ?? existing.title;
    const description = input.description !== undefined ? input.description : existing.description;
    const status = input.status ?? existing.status;
    const category_id = input.category_id !== undefined ? input.category_id : existing.category_id;
    const remarks = input.remarks !== undefined ? input.remarks : existing.remarks;

    db.prepare(`
      UPDATE wish_items 
      SET title = ?, description = ?, status = ?, category_id = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(title, description, status, category_id, remarks, id);

    return this.getById(id);
  },

  delete(id: number): boolean {
    const result = db.prepare('DELETE FROM wish_items WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

