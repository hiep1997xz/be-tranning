import { useState, useEffect } from 'react';
import { todoApi } from '../api/todo';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (data: CreateTodoDto) => {
    try {
      const newTodo = await todoApi.create(data);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError('Failed to create todo');
      throw err;
    }
  };

  const updateTodo = async (id: string, data: UpdateTodoDto) => {
    try {
      const updated = await todoApi.update(id, data);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      setError('Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refetch: fetchTodos
  };
}
