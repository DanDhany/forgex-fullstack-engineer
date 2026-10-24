import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

export class TaskRepository {
  constructor(dbPath = "data/tasks.db") {
    this.dbPath = dbPath;

    if (dbPath !== ":memory:") {
      const dir = path.dirname(path.resolve(dbPath));
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    this.db = new DatabaseSync(dbPath);
    this._initSchema();
  }

  _initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
        status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'completed')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }

  createTask({ title, description = "", priority, status = "todo" }) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO tasks (title, description, priority, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(title, description || "", priority, status, now, now);
    const id = Number(result.lastInsertRowid);

    return this.getTaskById(id);
  }

  getTaskById(id) {
    const stmt = this.db.prepare(`
      SELECT id, title, description, priority, status, created_at, updated_at
      FROM tasks
      WHERE id = ?
    `);
    const row = stmt.get(id);
    return row || null;
  }

  listTasks() {
    const stmt = this.db.prepare(`
      SELECT id, title, description, priority, status, created_at, updated_at
      FROM tasks
      ORDER BY id DESC
    `);
    return stmt.all();
  }

  close() {
    try {
      this.db.close();
    } catch {
      // Ignore if already closed
    }
  }
}
