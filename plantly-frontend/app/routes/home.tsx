import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";
import { CARE_LOG_TYPE_LABELS, ACTIVITY_TYPE_LABELS, formatEnum } from "../utils/enum-mappings";

const API_URL = "http://localhost:8081";

interface DashboardData {
  counts: {
    total: number;
    pendingTasks: number;
  };
  recentLogs: Array<{
    id: string;
    plantId: string;
    plantNickname: string;
    activityType: string;
    careType?: string;
    date: string;
    note?: string;
  }>;
  needsCheck: Array<{
    id: string;
    nickname: string;
    lastCheckDate?: string;
  }>;
}

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(`${API_URL}/dashboard`);
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return await response.json();
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | Plantly" },
    { name: "description", content: "Overview of your plant collection activity." },
  ];
}

export default function Home() {
  const data = useLoaderData() as DashboardData;

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h2>
        <p className="mt-2 text-sm text-neutral-500">Welcome back! Here's what's happening with your plants.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Total Plants</p>
          <p className="mt-2 text-3xl font-bold text-neutral-900">{data.counts.total}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Pending Tasks</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{data.counts.pendingTasks}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Needs Check Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-neutral-900">Needs Check-up</h3>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              {data.needsCheck.length} plants
            </span>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            {data.needsCheck.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-neutral-500">All active plants have been checked recently. Great job!</p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {data.needsCheck.map((plant) => (
                  <li key={plant.id} className="p-4 hover:bg-neutral-50 transition-colors">
                    <Link to={`/plants/${plant.id}`} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-neutral-900">{plant.nickname}</p>
                        <p className="text-xs text-neutral-500">
                          {plant.lastCheckDate 
                            ? `Last checked: ${new Date(plant.lastCheckDate).toLocaleDateString()}`
                            : "Never checked"}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-green-600 hover:text-green-700">View →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-neutral-900">Recent Activity</h3>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            {data.recentLogs.length === 0 ? (
              <div className="p-8 text-center text-sm text-neutral-500">
                No recent care activity logged yet.
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100">
                {data.recentLogs.map((log) => (
                  <li key={log.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link to={`/plants/${log.plantId}`} className="font-bold text-neutral-900 hover:underline truncate">
                            {log.plantNickname}
                          </Link>
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                            log.activityType === 'CARE_LOG' 
                              ? 'bg-blue-100 text-blue-700' 
                              : log.activityType === 'PLANT_ADDED' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {log.activityType === 'CARE_LOG' && log.careType
                              ? formatEnum(log.careType, CARE_LOG_TYPE_LABELS)
                              : formatEnum(log.activityType, ACTIVITY_TYPE_LABELS)}
                          </span>
                        </div>
                        {log.note && <p className="mt-1 text-sm text-neutral-600 line-clamp-1">{log.note}</p>}
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                          {new Date(log.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
