import DashboardLayout from '@/features/layout/DashboardLayout';
import GoogleDrivePage from '@/features/google-drive/GoogleDrivePage';

export default function Page() {
  return (
    <DashboardLayout>
      <GoogleDrivePage />
    </DashboardLayout>
  );
}