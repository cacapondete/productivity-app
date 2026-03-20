import DashboardLayout from '@/features/layout/DashboardLayout';
import TasksPage from '@/features/tasks/TasksPage';

export default function Page() {
  return (
    <DashboardLayout>
      <TasksPage />
    </DashboardLayout>
  );
}