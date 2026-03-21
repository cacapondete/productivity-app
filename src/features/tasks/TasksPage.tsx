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

type PocketBaseAbortError = Error & {
  isAbort?: boolean;
};

function isPocketBaseAbortError(error: unknown): error is PocketBaseAbortError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAbort' in error &&
    Boolean((error as PocketBaseAbortError).isAbort)
  );
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
        setError(null);
        const data = await fetchTasks();
        if (isMounted) {
          setTasks((data as unknown as Task[]) || []);
        }
      } catch (err) {
        if (isMounted) {
          if (isPocketBaseAbortError(err)) {
            return; // Ignore intentional cancellation errors
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
    <div className="mx-auto w-full max-w-6xl px-4 md:px-8 lg:px-20 py-6 md:py-10 lg:py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-serif font-bold tracking-tight lg:text-5xl" style={{ fontFamily: 'var(--font-display), serif' }}>Tasks</h1>
        <div className="h-px w-16 bg-black"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 border-l-2 border-l-black bg-white pl-4 py-3 text-[11px] text-gray-700 font-sans\">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-6 flex h-32 w-full items-center justify-center border border-black/8 bg-white">
          <p className="text-[11px] font-serif font-semibold uppercase tracking-[0.22em] text-black">
            Loading...
          </p>
        </div>
      )}

      {/* Create Task Form */}
      <div className="mb-12 w-full border border-black/8 bg-white p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black mb-2">Title</label>
            <Input
              type="text"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div>
            <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black mb-2">Description</label>
            <textarea
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="border border-black w-full px-3 py-2 outline-none focus:border-black focus:ring-0 transition text-[11px] font-sans leading-relaxed h-24 resize-none"
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="w-full flex items-center justify-center gap-2">
          <Plus size={14} />
          Create Task
        </Button>
      </div>

      {/* Tasks List */}
      {!loading && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="w-full border border-black/8 bg-white p-12 text-center font-sans">
              <p className="text-[11px] text-gray-600 leading-relaxed">No tasks yet. Create one to get started.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex w-full items-start gap-4 border border-black/8 bg-white p-5 lg:p-6 transition-colors hover:bg-gray-50/50"
              >
                <button
                  onClick={() => handleToggle(task.id, task.completed)}
                  className="mt-0.5 shrink-0 transition-opacity hover:opacity-70"
                >
                  {task.completed ? (
                    <CheckCircle size={18} className="text-black" />
                  ) : (
                    <Circle size={18} className="text-gray-400" />
                  )}
                </button>

                <div className="min-w-0 flex-1 font-sans">
                  <h3
                    className={`text-[13px] font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-black'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p
                      className={`mt-3 text-xs leading-relaxed ${
                        task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="shrink-0 p-1 transition-opacity hover:opacity-50"
                  title="Delete task"
                >
                  <Trash2 size={15} className="text-gray-700" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
