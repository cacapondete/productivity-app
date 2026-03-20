import DashboardLayout from '@/features/layout/DashboardLayout';

export default function Page() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-16 grayscale">
        {/* Date/Status Line */}
        <div className="mb-2 text-xs font-sans font-light uppercase tracking-widest text-gray-600">
          {today} • Editorial Workspace
        </div>

        {/* Title */}
        <div className="mb-20">
          <h1 className="text-6xl lg:text-7xl font-serif font-bold mb-8 tracking-tight leading-tight">
            Dashboard
          </h1>
          <div className="h-px bg-black w-20"></div>
        </div>

        {/* Main Grid: 2/3 Left + 1/3 Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: 2/3 - Recent Activity Section */}
          <div className="lg:col-span-2 space-y-12">
            {/* Recent Tasks */}
            <div className="border-b border-black pb-12">
              <h2 className="text-2xl font-serif font-bold mb-8 tracking-tight">Recent Tasks</h2>
              <p className="text-sm font-sans text-gray-600 leading-relaxed mb-8 max-w-lg">
                Monitor your active tasks and workflow progress. Stay organized across all your editorial projects and deadlines.
              </p>
              <a 
                href="/tasks" 
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-black group hover:text-gray-700 transition-colors"
              >
                <span>View All Tasks</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>

            {/* Google Drive Integration */}
            <div className="border-b border-black pb-12">
              <h2 className="text-2xl font-serif font-bold mb-8 tracking-tight">Google Drive</h2>
              <p className="text-sm font-sans text-gray-600 leading-relaxed mb-8 max-w-lg">
                Access your entire document library and media assets. Seamlessly manage files from your Google Drive workspace.
              </p>
              <a 
                href="/google-drive" 
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-black group hover:text-gray-700 transition-colors"
              >
                <span>Browse Drive</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>

            {/* Workspace Stats */}
            <div className="border-b border-black pb-12">
              <h2 className="text-2xl font-serif font-bold mb-8 tracking-tight">Quick Actions</h2>
              <p className="text-sm font-sans text-gray-600 leading-relaxed mb-8 max-w-lg">
                Fast access to your most-used workflows and settings. Personalize your workspace for maximum efficiency.
              </p>
              <a 
                href="/settings" 
                className="inline-flex items-center gap-2 font-sans text-sm font-medium text-black group hover:text-gray-700 transition-colors"
              >
                <span>Configure Settings</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Right: 1/3 - Quick Stats */}
          <div className="space-y-16">
            {/* Quick Stat Card 1 */}
            <div className="border-l-2 border-black pl-8">
              <div className="text-xs font-sans font-light uppercase tracking-widest text-gray-600 mb-3">
                Tasks Active
              </div>
              <div className="text-5xl font-serif font-light tracking-tight">0</div>
              <p className="text-xs font-sans text-gray-600 mt-4">Today&apos;s priorities</p>
            </div>

            {/* Quick Stat Card 2 */}
            <div className="border-l-2 border-black pl-8">
              <div className="text-xs font-sans font-light uppercase tracking-widest text-gray-600 mb-3">
                Drive Files
              </div>
              <div className="text-5xl font-serif font-light tracking-tight">—</div>
              <p className="text-xs font-sans text-gray-600 mt-4">Last synced now</p>
            </div>

            {/* CTA Section */}
            <div className="border-t border-black pt-12 mt-12">
              <h3 className="text-sm font-sans font-medium uppercase tracking-widest mb-6">
                Need Help?
              </h3>
              <p className="text-xs font-sans text-gray-600 leading-relaxed mb-6">
                Explore our documentation and guides for seamless productivity workspace management.
              </p>
              <button className="text-xs font-sans font-medium uppercase tracking-widest text-black hover:text-gray-700 transition-colors">
                Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
