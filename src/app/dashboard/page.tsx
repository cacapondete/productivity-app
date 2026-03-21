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
        <div className="mb-6 text-[11px] font-sans font-light uppercase tracking-widest text-gray-500">
          {today} • Design Studio
        </div>

        {/* Title */}
        <div className="mb-16 lg:mb-24">
          <h1 className="mb-8 text-5xl lg:text-6xl font-serif font-light leading-tight tracking-[0.05em] text-white uppercase">
            Dashboard
          </h1>
          <div className="h-px bg-white/20 w-24"></div>
        </div>

        {/* Main Grid: 2/3 Left + 1/3 Right */}
        <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-20">
          {/* Left: 2/3 - Recent Activity Section */}
          <div className="space-y-16 lg:col-span-2 lg:space-y-20">
            {/* Recent Tasks */}
            <div className="w-full border-b border-white/5 pb-12 lg:pb-16">
              <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
                RECENT
              </div>
              <h2 className="mb-6 text-2xl lg:text-3xl font-serif font-light tracking-[0.05em] text-white uppercase">Tasks</h2>
              <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-gray-400">
                Monitor your active tasks and workflow progress. Stay organized across all your editorial projects and deadlines.
              </p>
              <a 
                href="/tasks" 
                className="group inline-flex items-center gap-3 text-[12px] font-sans font-semibold uppercase tracking-widest text-white transition-colors hover:text-gray-300"
              >
                <span>View All Tasks</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Google Drive Integration */}
            <div className="w-full border-b border-white/5 pb-12 lg:pb-16">
              <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
                LIBRARY
              </div>
              <h2 className="mb-6 text-2xl lg:text-3xl font-serif font-light tracking-[0.05em] text-white uppercase">Google Drive</h2>
              <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-gray-400">
                Access your entire document library and media assets. Seamlessly manage files from your Google Drive workspace.
              </p>
              <a 
                href="/google-drive" 
                className="group inline-flex items-center gap-3 text-[12px] font-sans font-semibold uppercase tracking-widest text-white transition-colors hover:text-gray-300"
              >
                <span>Browse Drive</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Workspace Stats */}
            <div className="w-full border-b border-white/5 pb-12 lg:pb-16">
              <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
                SETTINGS
              </div>
              <h2 className="mb-6 text-2xl lg:text-3xl font-serif font-light tracking-[0.05em] text-white uppercase">Quick Actions</h2>
              <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-gray-400">
                Fast access to your most-used workflows and settings. Personalize your workspace for maximum efficiency.
              </p>
              <a 
                href="/settings" 
                className="group inline-flex items-center gap-3 text-[12px] font-sans font-semibold uppercase tracking-widest text-white transition-colors hover:text-gray-300"
              >
                <span>Configure Settings</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Right: 1/3 - Quick Stats */}
          <div className="w-full space-y-16 lg:space-y-20">
            {/* Quick Stat Card 1 */}
            <div className="w-full">
              <div className="mb-6 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-gray-500">
                Tasks Active
              </div>
              <div className="text-6xl lg:text-7xl font-serif font-light tracking-tight text-white">0</div>
              <p className="text-xs font-sans text-gray-500 mt-4">Today&apos;s priorities</p>
            </div>

            {/* Quick Stat Card 2 */}
            <div className="w-full border-t border-white/5 pt-12 lg:pt-16">
              <div className="mb-6 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-gray-500">
                Drive Files
              </div>
              <div className="text-6xl lg:text-7xl font-serif font-light tracking-tight text-white">—</div>
              <p className="text-xs font-sans text-gray-500 mt-4">Last synced now</p>
            </div>

            {/* CTA Section */}
            <div className="mt-12 w-full border-t border-white/5 pt-12 lg:mt-16 lg:pt-16">
              <h3 className="mb-6 text-[12px] font-sans font-semibold uppercase tracking-widest text-white">
                Need Help?
              </h3>
              <p className="mb-8 text-[12px] font-sans leading-relaxed text-gray-500">
                Explore our documentation and guides for seamless productivity workspace management.
              </p>
              <button className="text-[11px] font-sans font-semibold uppercase tracking-widest text-gray-400 transition-colors hover:text-white">
                Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
