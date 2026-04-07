import { unstable_noStore as noStore } from 'next/cache';
import DashboardLayout from '@/features/layout/DashboardLayout';
import { fetchTasks } from '@/services/tasksService';
import { formatDateTime, formatRemainingTime } from '@/utils/format';
import { useGoogleDriveFiles, GoogleDriveDashboardView, GoogleDriveDashboardContainer, GoogleDriveFilterPanel, GoogleDriveDashboardProviderWrapper } from '@/components/dashboard/GoogleDriveDashboardSection';
import { FileTypeFilter } from '@/components/ui/FileTypeFilter';

type DashboardTask = {
  id: string;
  title: string;
  description?: string;
  due_date?: string | null;
  status?: 'todo' | 'doing' | 'done';
};

function sortTasksByDeadline(tasks: DashboardTask[]) {
  return [...tasks]
    .filter((task) => Boolean(task.due_date))
    .sort((left, right) => {
      const leftTime = new Date(left.due_date as string).getTime();
      const rightTime = new Date(right.due_date as string).getTime();
      return leftTime - rightTime;
    })
    .slice(0, 5);
}

function getActiveTaskCount(tasks: DashboardTask[]) {
  return tasks.filter((task) => task.status !== 'done').length;
}

export default async function Page() {
  noStore();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let recentTasks: DashboardTask[] = [];
  let activeTaskCount = 0;

  try {
    const allTasks = (await fetchTasks()) as unknown as DashboardTask[];
    recentTasks = sortTasksByDeadline(allTasks);
    activeTaskCount = getActiveTaskCount(allTasks);
  } catch (error) {
    console.error('Failed to load dashboard tasks:', error);
  }

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
        <GoogleDriveDashboardProviderWrapper>
          <div className="grid w-full grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-20">
          {/* Left: 2/3 - Recent Activity Section */}
          <div className="space-y-16 lg:col-span-2 lg:space-y-20">
            {/* Recent Tasks */}
            <div className="w-full border-b border-white/5 pb-12 lg:pb-16">
              <div className="mb-4 text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
                RECENT DEADLINES
              </div>
              <h2 className="mb-6 text-2xl lg:text-3xl font-serif font-light tracking-[0.05em] text-white uppercase">Top 5 Tasks</h2>
              <p className="mb-8 max-w-lg text-[13px] leading-relaxed text-gray-400">
                The five nearest deadlines surface here so the dashboard stays focused on what needs attention first.
              </p>

              {recentTasks.length > 0 ? (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="border border-white/5 bg-[#121212] p-5 transition-colors hover:bg-[#1A1A1A]">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                        <div className="min-w-0">
                          <div className="text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
                            {task.status ?? 'todo'}
                          </div>
                          <h3 className="mt-2 text-[13px] font-medium tracking-wide text-white">{task.title}</h3>
                          {task.description && (
                            <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-gray-400">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 text-left lg:text-right">
                          <div className="text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500">
                            Deadline
                          </div>
                          <div className="mt-2 text-[13px] font-medium tracking-wide text-white">
                            {formatDateTime(task.due_date ?? undefined)}
                          </div>
                          <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                            {formatRemainingTime(task.due_date ?? undefined)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-white/5 bg-[#121212] p-6 text-[13px] leading-relaxed text-gray-400">
                  No tasks with deadlines yet. Add one in the Tasks area and it will appear here.
                </div>
              )}

              <a
                href="/tasks"
                className="group mt-8 inline-flex items-center gap-3 text-[12px] font-sans font-semibold uppercase tracking-widest text-white transition-colors hover:text-gray-300"
              >
                <span>View All Tasks</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Google Drive Integration */}
            <GoogleDriveDashboardContainer />

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
              <div className="text-6xl lg:text-7xl font-serif font-light tracking-tight text-white">{activeTaskCount}</div>
              <p className="text-xs font-sans text-gray-500 mt-4">Today&apos;s priorities</p>
            </div>

            {/* Quick Stat Card 2 - Google Drive Filter */}
            <GoogleDriveFilterPanel />

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
        </GoogleDriveDashboardProviderWrapper>
      </div>
    </DashboardLayout>
  );
}
