import { Router } from 'express';
import { TasksController } from '../controllers/tasks.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { validateBody } from '../../../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../interfaces/tasks.validation';

const router = Router();
const controller = new TasksController();

router.get('/', (req, res, next) => controller.getAll(req, res, next));
router.get('/:id', (req, res, next) => controller.getById(req, res, next));

router.post(
  '/',
  authMiddleware,
  validateBody(createTaskSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.put(
  '/:id',
  authMiddleware,
  validateBody(updateTaskSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  '/:id',
  authMiddleware,
  (req, res, next) => controller.delete(req, res, next)
);

export default router;
