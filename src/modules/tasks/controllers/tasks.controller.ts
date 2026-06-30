import { Request, Response, NextFunction } from 'express';
import { TasksService } from '../services/tasks.service';
import { AppError } from '../../../middleware/error.middleware';
import { TaskPriority, TaskStatus } from '../interfaces/tasks.interfaces';

const tasksService = new TasksService();

export class TasksController {
  public getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const status = req.query.status as TaskStatus | undefined;
      const priority = req.query.priority as TaskPriority | undefined;

      const tasks = tasksService.getAll({ status, priority });
      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  }

  public getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid task ID', 400);
      }

      const task = tasksService.getById(id);
      if (!task) {
        throw new AppError('Task not found', 404);
      }

      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }

  public create(req: Request, res: Response, next: NextFunction): void {
    try {
      const task = tasksService.create(req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  public update(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid task ID', 400);
      }

      const updatedTask = tasksService.update(id, req.body);
      if (!updatedTask) {
        throw new AppError('Task not found', 404);
      }

      res.status(200).json(updatedTask);
    } catch (err) {
      next(err);
    }
  }

  public delete(req: Request, res: Response, next: NextFunction): void {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError('Invalid task ID', 400);
      }

      const deleted = tasksService.delete(id);
      if (!deleted) {
        throw new AppError('Task not found', 404);
      }

      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}
