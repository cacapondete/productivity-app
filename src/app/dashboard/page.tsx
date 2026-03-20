import DashboardLayout from '@/features/layout/DashboardLayout';

export default function Page() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 tracking-tight">Dashboard</h1>
          <div className="h-1 w-12 bg-black"></div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border border-black p-6 md:p-8 bg-white hover:border-gray-400 transition-colors">
            <h3 className="text-lg font-serif font-semibold mb-3">Recent Tasks</h3>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">Manage your workflow efficiently</p>
            <a href="/tasks" className="text-black text-sm font-sans font-medium hover:underline">
              View All →
            </a>
          </div>

          {/* Card 2 */}
          <div className="border border-black p-6 md:p-8 bg-white hover:border-gray-400 transition-colors">
            <h3 className="text-lg font-serif font-semibold mb-3">Google Drive</h3>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">Access your files and folders</p>
            <a href="/google-drive" className="text-black text-sm font-sans font-medium hover:underline">
              Open →
            </a>
          </div>

          {/* Card 3 */}
          <div className="border border-black p-6 md:p-8 bg-white hover:border-gray-400 transition-colors">
            <h3 className="text-lg font-serif font-semibold mb-3">Settings</h3>
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">Configure your preferences</p>
            <a href="/settings" className="text-black text-sm font-sans font-medium hover:underline">
              Configure →
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
