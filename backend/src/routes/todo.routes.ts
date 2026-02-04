import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';

export const todoRouter = Router();
const controller = new TodoController();

todoRouter.get('/', controller.findAll);
todoRouter.get('/:id', controller.findById);
todoRouter.post('/', controller.create);
todoRouter.put('/:id', controller.update);
todoRouter.delete('/:id', controller.delete);
