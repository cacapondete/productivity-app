export * from '@/services/tasksService';

// Updated fetchTasks to disable auto-cancel
export async function fetchTasks() {
  try {
    const records = await client.collection('tasks').getFullList({ requestKey: null });
    return records;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}