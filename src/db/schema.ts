import { Database } from 'better-sqlite3';

export function initSchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
      assignee TEXT,
      dueDate TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')),
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_tasks_updated_at
    AFTER UPDATE ON tasks
    BEGIN
      UPDATE tasks SET updatedAt = datetime('now') WHERE id = NEW.id;
    END;
  `);
}
