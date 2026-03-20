"use client";

import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './tasksService';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    async function loadTasks() {
      const data = await fetchTasks();
      setTasks(data);
    }

    loadTasks();
  }, []);

  const handleCreate = async () => {
    const task = await createTask(newTask);
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: '', description: '' });
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 flex justify-between">
            <span>{task.title}</span>
            <button onClick={() => handleDelete(task.id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}