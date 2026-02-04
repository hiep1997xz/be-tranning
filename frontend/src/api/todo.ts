import axios from 'axios';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  },

  async getById(id: string): Promise<Todo> {
    const response = await axios.get(`${API_URL}/todos/${id}`);
    return response.data;
  },

  async create(data: CreateTodoDto): Promise<Todo> {
    const response = await axios.post(`${API_URL}/todos`, data);
    return response.data;
  },

  async update(id: string, data: UpdateTodoDto): Promise<Todo> {
    const response = await axios.put(`${API_URL}/todos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/todos/${id}`);
  }
};
