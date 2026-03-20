import client from '@/lib/pocketbase';

export async function fetchTasks() {
  try {
    const records = await client.collection('tasks').getFullList();
    return records;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(data: { title: string; description: string }) {
  try {
    const record = await client.collection('tasks').create(data);
    return record;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(id: string, data: { title?: string; description?: string }) {
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
    await client.collection('tasks').delete(id);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}