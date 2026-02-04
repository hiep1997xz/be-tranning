import { Request, Response, NextFunction } from 'express';
import { todoService } from '../services/todo.service';

export class TodoController {
  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const todos = await todoService.findAll();
      res.json(todos);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const todo = await todoService.findById(id);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const todo = await todoService.create({ title, description });
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const { title, description, completed } = req.body;
      const todo = await todoService.update(id, {
        title,
        description,
        completed
      });
      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await todoService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
