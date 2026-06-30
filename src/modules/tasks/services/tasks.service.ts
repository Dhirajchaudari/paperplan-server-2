import db from '../../../db/connection';
import { Task, CreateTaskDto, UpdateTaskDto, TaskQueryFilters } from '../interfaces/tasks.interfaces';

export class TasksService {
  public getAll(filters: TaskQueryFilters): Task[] {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params: any[] = [];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }

    query += ' ORDER BY id DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params) as Task[];
  }

  public getById(id: number): Task | undefined {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id) as Task | undefined;
  }

  public create(dto: CreateTaskDto): Task {
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, priority, assignee, dueDate, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const info = stmt.run(
      dto.title,
      dto.description !== undefined ? dto.description : '',
      dto.priority,
      dto.assignee !== undefined ? dto.assignee : null,
      dto.dueDate,
      dto.status
    );

    const task = this.getById(info.lastInsertRowid as number);
    if (!task) {
      throw new Error('Failed to retrieve newly created task');
    }
    return task;
  }

  public update(id: number, dto: UpdateTaskDto): Task | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const updates: string[] = [];
    const params: any[] = [];

    const allowedKeys: (keyof UpdateTaskDto)[] = [
      'title',
      'description',
      'priority',
      'assignee',
      'dueDate',
      'status'
    ];

    for (const key of allowedKeys) {
      if (dto[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(dto[key]);
      }
    }

    if (updates.length === 0) {
      return existing;
    }

    params.push(id);
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...params);

    return this.getById(id);
  }

  public delete(id: number): boolean {
    const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
