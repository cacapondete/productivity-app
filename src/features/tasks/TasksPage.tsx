"use client";

import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/tasksService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus, CheckCircle, Circle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTasks();
        if (isMounted) {
          setTasks((data as unknown as Task[]) || []);
        }
      } catch (err) {
        if (isMounted) {
          // Check if it's an abort/cancellation error (expected on unmount)
          if (err instanceof Error && (err.message.includes('abort') || err.message.includes('AutoCancel'))) {
            return; // Silently ignore auto-cancellation errors
          }
          const message = err instanceof Error ? err.message : 'Failed to load tasks';
          setError(message);
          console.error('Error loading tasks:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreate = async () => {
    if (!newTask.title.trim()) return;
    try {
      const task = await createTask(newTask);
      setTasks((prev) => [(task as unknown as Task), ...prev]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      console.error('Error creating task:', err);
    }
  };

  const handleToggle = async (id: string, completed?: boolean) => {
    try {
      await updateTask(id, { title: '', description: '' });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, completed: !completed } : task))
      );
    } catch (err) {
      console.error('Failed to toggle task', err);
      // Rollback optimistic update on error
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight">Tasks</h1>
        <div className="h-1 w-12 bg-black"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-white border-l-4 border-l-red-600 text-red-600 text-sm font-sans">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-400 border-t-black"></div>
        </div>
      )}

      {/* Create Task Form */}
      <div className="mb-8 border border-black p-6 md:p-8 bg-white">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <Input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            className="text-sm font-sans"
          />
          <textarea
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="border border-gray-400 p-3 text-sm font-sans focus:border-black outline-none h-16 resize-none"
          />
        </div>
        <Button onClick={handleCreate} className="w-full flex items-center justify-center gap-2">
          <Plus size={16} />
          Add Task
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="py-12 text-center border border-gray-200 p-8 bg-gray-50 font-sans">
            <p className="text-gray-600 text-sm">No tasks yet. Create one to get started.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-4 p-5 md:p-6 border border-gray-200 hover:border-black transition-colors bg-white"
            >
              <button
                onClick={() => handleToggle(task.id, task.completed)}
                className="mt-0.5 hover:opacity-70 transition-opacity shrink-0"
              >
                {task.completed ? (
                  <CheckCircle size={20} className="text-black" />
                ) : (
                  <Circle size={20} className="text-gray-400" />
                )}
              </button>

              <div className="flex-1 min-w-0 font-sans">
                <h3
                  className={`text-sm font-medium ${
                    task.completed ? 'line-through text-gray-500' : 'text-black'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="p-2 hover:bg-gray-100 transition-colors shrink-0 -mr-2"
              >
                <Trash2 size={16} className="text-gray-600 hover:text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
