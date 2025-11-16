import db from '../db';

export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
}

export const categoryModel = {
  getAll(): Category[] {
    return db.prepare('SELECT * FROM categories ORDER BY name ASC').all() as Category[];
  },

  getById(id: number): Category | null {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | null;
  },

  create(input: CreateCategoryInput): Category {
    const color = input.color || '#3B82F6';
    const result = db
      .prepare('INSERT INTO categories (name, color) VALUES (?, ?)')
      .run(input.name, color);
    
    return this.getById(result.lastInsertRowid as number)!;
  },

  update(id: number, input: UpdateCategoryInput): Category | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const name = input.name ?? existing.name;
    const color = input.color ?? existing.color;

    db.prepare('UPDATE categories SET name = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(name, color, id);

    return this.getById(id);
  },

  delete(id: number): boolean {
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

