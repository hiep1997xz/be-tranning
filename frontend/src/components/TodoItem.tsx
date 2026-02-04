import { useState } from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa todo này?')) return;
    setDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${todo.completed ? 'border-green-500' : 'border-primary-500'}`}>
      <div className="flex items-start gap-3">
        <div>aaaa</div>
        <div>aaaa</div>
        <div>aaaa</div>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-primary-500'
          }`}
        >
          {todo.completed && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {todo.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            {new Date(todo.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
