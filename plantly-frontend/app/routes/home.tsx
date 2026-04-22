import type { Route } from "./+types/home";
import { Link, useLoaderData } from "react-router";
import { CARE_LOG_TYPE_LABELS, ACTIVITY_TYPE_LABELS, formatEnum } from "../utils/enum-mappings";
import { API_BASE_URL } from "../config";

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
  weather?: {
    current: {
      temp: number;
      windSpeed: number;
      precipitation: number;
      weatherCode: number;
    };
    forecast: Array<{
      date: string;
      minTemp: number;
      maxTemp: number;
      precipitation: number;
      weatherCode: number;
    }>;
    messages: Array<{
      severity: 'red' | 'yellow' | 'info';
      message: string;
    }>;
  };
}

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  if (!response.ok) {
    throw new Error("Could not fetch dashboard data");
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

      {/* Weather Section */}
      {data.weather && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-neutral-900">Weather</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Current Weather & Messages */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500">Current Weather</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-neutral-900">{Math.round(data.weather.current.temp)}°C</span>
                    <span className="text-sm text-neutral-500">Bern</span>
                  </div>
                  <div className="mt-1 flex gap-4 text-xs text-neutral-500">
                    <span>Wind: {data.weather.current.windSpeed} km/h</span>
                    <span>Precipitation: {data.weather.current.precipitation} mm</span>
                  </div>
                </div>
                
                {data.weather.messages.length > 0 && (
                  <div className="flex-1 space-y-2">
                    {data.weather.messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          msg.severity === 'red' 
                            ? 'bg-red-50 text-red-700 border-red-100' 
                            : msg.severity === 'yellow'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                        }`}
                      >
                        {msg.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3-Day Forecast */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-neutral-500 mb-4">3-Day Forecast</p>
              <div className="space-y-4">
                {data.weather.forecast.map((day) => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-700">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-900 font-bold">{Math.round(day.maxTemp)}°</span>
                      <span className="text-neutral-400">{Math.round(day.minTemp)}°</span>
                      <span className="text-blue-500 w-12 text-right">{day.precipitation > 0 ? `${day.precipitation.toFixed(1)}mm` : '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
