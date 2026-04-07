"use client";

import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/services/tasksService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Plus, CheckCircle, Circle } from 'lucide-react';
import { formatDateTime, formatRemainingTime } from '@/utils/format';

interface Task {
  id: string;
  title: string;
  description: string;
  due_date?: string | null;
  status?: 'todo' | 'doing' | 'done';
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
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toLocalDatetimeValue = (value: string) => {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localTime = new Date(date.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  };

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
    if (!newTask.title.trim() || !newTask.due_date) return;
    try {
      const task = await createTask({
        ...newTask,
        due_date: new Date(newTask.due_date).toISOString(),
      });
      setTasks((prev) => [(task as unknown as Task), ...prev]);
      setNewTask({ title: '', description: '', due_date: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      console.error('Error creating task:', err);
    }
  };

  const handleToggle = async (id: string, status?: Task['status']) => {
    try {
      const nextStatus: Task['status'] = status === 'done' ? 'todo' : 'done';
      await updateTask(id, { status: nextStatus });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status: nextStatus } : task))
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
    <div className="mx-auto w-full">
      {/* Header */}
      <div className="mb-16 lg:mb-24">
        <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">MANAGE</div>
        <h1 className="mb-8 text-5xl lg:text-6xl font-serif font-light tracking-[0.05em] text-white uppercase" style={{ fontFamily: 'var(--font-display), serif' }}>Tasks</h1>
        <div className="h-px w-24 bg-white/20"></div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 border-l-2 border-l-white/30 bg-[#121212] pl-6 py-4 text-[12px] text-gray-300 font-sans">
          {error}
        </div>

      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-8 flex h-32 w-full items-center justify-center bg-[#121212] border border-white/5">
          <p className="text-[11px] font-serif font-semibold uppercase tracking-widest text-gray-400">
            Loading...
          </p>
        </div>
      )}

      {/* Create Task Form */}
      <div className="mb-16 w-full bg-[#121212] p-8 lg:p-10 border border-white/5">
        <h3 className="mb-8 text-[12px] font-sans font-semibold uppercase tracking-widest text-white">Create New Task</h3>
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <div>
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 mb-3">Title</label>
            <Input
              type="text"
              placeholder="Enter task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div>
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 mb-3">Deadline Time</label>
            <Input
              type="datetime-local"
              value={newTask.due_date}
              onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              min={toLocalDatetimeValue(new Date().toISOString())}
            />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 mb-3">Description</label>
            <textarea
              placeholder="Enter task description..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="bg-[#1A1A1A] border-b border-white/10 w-full px-0 py-2 outline-none focus:border-b focus:border-white/60 transition text-[12px] font-sans leading-relaxed h-20 resize-none text-white placeholder:text-gray-600"
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="w-full lg:w-auto" disabled={!newTask.title.trim() || !newTask.due_date}>
          <Plus size={14} className="inline mr-2" />
          Create Task
        </Button>
      </div>

      {/* Tasks List */}
      {!loading && (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="w-full bg-[#121212] p-12 text-center font-sans border border-white/5">
              <p className="text-[12px] text-gray-500 leading-relaxed">No tasks yet. Start by creating one above.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex w-full items-start gap-4 bg-[#121212] p-6 lg:p-8 transition-colors hover:bg-[#1A1A1A] border border-white/5"
              >
                <button
                  onClick={() => handleToggle(task.id, task.status)}
                  className="mt-0.5 shrink-0 transition-opacity hover:opacity-70"
                >
                  {task.status === 'done' ? (
                    <CheckCircle size={18} className="text-white/60" />
                  ) : (
                    <Circle size={18} className="text-gray-600" />
                  )}
                </button>

                <div className="min-w-0 flex-1 font-sans">
                  <h3
                    className={`text-[13px] font-medium ${ task.status === 'done' ? 'line-through text-gray-600' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-gray-500">
                    <span>Deadline</span>
                    <span className="text-white/80">{formatDateTime(task.due_date ?? undefined)}</span>
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                    {formatRemainingTime(task.due_date ?? undefined)}
                  </div>
                  {task.description && (
                    <p
                      className={`mt-3 text-[12px] leading-relaxed ${
                        task.status === 'done' ? 'line-through text-gray-700' : 'text-gray-400'
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
                  <Trash2 size={16} className="text-gray-600" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
