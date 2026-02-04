import { useTodos } from '../hooks/useTodos';
import { TodoForm } from '../components/TodoForm';
import { TodoItem } from '../components/TodoItem';
import { CreateTodoDto, UpdateTodoDto } from '../types/todo';

export function App() {
  const { todos, loading, error, createTodo, updateTodo, deleteTodo, refetch } = useTodos();

  const handleCreate = async (data: CreateTodoDto) => {
    await createTodo(data);
  };

  const handleUpdate = async (id: string, data: UpdateTodoDto) => {
    await updateTodo(id, data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Todo App</h1>
          <p className="text-gray-600">Quản lý công việc với Docker</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={refetch} className="underline hover:no-underline">Thử lại</button>
          </div>
        )}

        <TodoForm onSubmit={handleCreate} />

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-gray-500">Chưa có công việc nào</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={(id, completed) => handleUpdate(id, { completed })}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {todos.filter(t => t.completed).length} / {todos.length} đã hoàn thành
          </div>
        )}
      </div>
    </div>
  );
}
