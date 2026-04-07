import client from '@/lib/pocketbase';

export type TaskStatus = 'todo' | 'doing' | 'done';

export type TaskPayload = {
  title: string;
  description: string;
  due_date: string;
  status?: TaskStatus;
};

export async function fetchTasks() {
  return await client.collection('tasks').getFullList({ requestKey: null });
}

export async function createTask(data: TaskPayload) {
  try {
    const record = await client.collection('tasks').create({
      ...data,
      status: data.status ?? 'todo',
    });
    return record;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(id: string, data: Partial<TaskPayload>) {
  try {
    const record = await client.collection('tasks').update(id, data);
    return record;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(id: string) {
  try {
    return await client.collection('tasks').delete(id);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}
