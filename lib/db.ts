import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'wish-tracker.db');
const db = new Database(dbPath);

// Initialize database schema
export function initDatabase() {
  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#3B82F6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Wish items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wish_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'wish' CHECK(status IN ('wish', 'in_progress', 'achieved')),
      category_id INTEGER,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);

  // Remarks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS remarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wish_item_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wish_item_id) REFERENCES wish_items(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_wish_items_status ON wish_items(status);
    CREATE INDEX IF NOT EXISTS idx_wish_items_category ON wish_items(category_id);
    CREATE INDEX IF NOT EXISTS idx_remarks_wish_item ON remarks(wish_item_id);
  `);
}

// Initialize on import
initDatabase();

export default db;

