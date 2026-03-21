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
      <div className="w-full">
        {/* Date/Status Line */}
        <div className="mb-3 text-[10px] font-sans font-light uppercase tracking-[0.18em] text-gray-600 sm:text-xs">
          {today} • Editorial Workspace
        </div>

        {/* Title */}
        <div className="mb-12 lg:mb-20">
          <h1 className="mb-6 text-3xl font-serif font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Dashboard
          </h1>
          <div className="h-px bg-black w-20"></div>
        </div>

        {/* Main Grid: 2/3 Left + 1/3 Right */}
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-16">
          {/* Left: 2/3 - Recent Activity Section */}
          <div className="space-y-10 lg:col-span-2 lg:space-y-12">
            {/* Recent Tasks */}
            <div className="w-full border-b border-black/10 pb-10 lg:pb-12">
              <h2 className="mb-6 text-xl font-serif font-bold tracking-tight lg:text-2xl">Recent Tasks</h2>
              <p className="mb-6 max-w-lg text-sm leading-relaxed text-gray-600">
                Monitor your active tasks and workflow progress. Stay organized across all your editorial projects and deadlines.
              </p>
              <a 
                href="/tasks" 
                className="group inline-flex items-center gap-2 text-sm font-medium text-black transition-colors hover:text-gray-700"
              >
                <span>View All Tasks</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>

            {/* Google Drive Integration */}
            <div className="w-full border-b border-black/10 pb-10 lg:pb-12">
              <h2 className="mb-6 text-xl font-serif font-bold tracking-tight lg:text-2xl">Google Drive</h2>
              <p className="mb-6 max-w-lg text-sm leading-relaxed text-gray-600">
                Access your entire document library and media assets. Seamlessly manage files from your Google Drive workspace.
              </p>
              <a 
                href="/google-drive" 
                className="group inline-flex items-center gap-2 text-sm font-medium text-black transition-colors hover:text-gray-700"
              >
                <span>Browse Drive</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>

            {/* Workspace Stats */}
            <div className="w-full border-b border-black/10 pb-10 lg:pb-12">
              <h2 className="mb-6 text-xl font-serif font-bold tracking-tight lg:text-2xl">Quick Actions</h2>
              <p className="mb-6 max-w-lg text-sm leading-relaxed text-gray-600">
                Fast access to your most-used workflows and settings. Personalize your workspace for maximum efficiency.
              </p>
              <a 
                href="/settings" 
                className="group inline-flex items-center gap-2 text-sm font-medium text-black transition-colors hover:text-gray-700"
              >
                <span>Configure Settings</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Right: 1/3 - Quick Stats */}
          <div className="w-full space-y-10 lg:space-y-16">
            {/* Quick Stat Card 1 */}
            <div className="w-full border-l-2 border-black pl-6 lg:pl-8">
              <div className="mb-3 text-xs font-sans font-light uppercase tracking-widest text-gray-600">
                Tasks Active
              </div>
              <div className="text-5xl font-serif font-light tracking-tight">0</div>
              <p className="text-xs font-sans text-gray-600 mt-4">Today&apos;s priorities</p>
            </div>

            {/* Quick Stat Card 2 */}
            <div className="w-full border-l-2 border-black pl-6 lg:pl-8">
              <div className="mb-3 text-xs font-sans font-light uppercase tracking-widest text-gray-600">
                Drive Files
              </div>
              <div className="text-5xl font-serif font-light tracking-tight">—</div>
              <p className="text-xs font-sans text-gray-600 mt-4">Last synced now</p>
            </div>

            {/* CTA Section */}
            <div className="mt-10 w-full border-t border-black/10 pt-10 lg:mt-12 lg:pt-12">
              <h3 className="mb-6 text-sm font-sans font-medium uppercase tracking-widest">
                Need Help?
              </h3>
              <p className="mb-6 text-xs font-sans leading-relaxed text-gray-600">
                Explore our documentation and guides for seamless productivity workspace management.
              </p>
              <button className="text-xs font-sans font-medium uppercase tracking-widest text-black transition-colors hover:text-gray-700">
                Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
