import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TodoService {
  async findAll() {
    return prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string) {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new AppError(404, 'Todo not found');
    }
    return todo;
  }

  async create(data: CreateTodoDto) {
    return prisma.todo.create({
      data: {
        title: data.title,
        description: data.description
      }
    });
  }

  async update(id: string, data: UpdateTodoDto) {
    await this.findById(id);
    return prisma.todo.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.todo.delete({ where: { id } });
  }
}

export const todoService = new TodoService();
