import { Card } from "~/components/ui/Card";
import { Cpu, Rocket, Building2, ShieldCheck, ChevronUp } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  badgeText,
  badgeColor = "green"
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  badgeText?: string;
  badgeColor?: "green" | "blue" | "gray";
}) {
  return (
    <Card className="p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-xl text-indigo-600">
          <Icon size={24} />
        </div>
        {badgeText && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${badgeColor === 'green' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-slate-800 dark:text-white">{value}</p>
      </div>
    </Card>
  );
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">Dashboard</h1>
          {/* Search bar intentionally omitted as per specific instruction */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Automazioni Totali"
            value="42"
            icon={Cpu}
            badgeText="+3 questo mese"
            badgeColor="green"
          />
          <StatCard
            title="Iniziative Attive"
            value="12"
            icon={Rocket}
            badgeText="Stabile"
            badgeColor="green"
          />
          <StatCard
            title="Uffici Coinvolti"
            value="8"
            icon={Building2}
          />
          <StatCard
            title="In Running"
            value="28"
            icon={ShieldCheck}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          {/* Trend Chart (Span 2) */}
          <Card className="lg:col-span-2 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Trend Automazioni in Produzione</h3>
                <p className="text-sm text-slate-500">Andamento storico per anno solare</p>
              </div>
              <ChevronUp className="text-indigo-500" />
            </div>

            <div className="flex-1 flex items-end gap-4 px-4 pb-4 border-b border-slate-100 dark:border-slate-800 relative">
              {/* Mock Bars/Trend Line Visualization */}
              {/* Using simple bars for now to represent the trend */}
              <div className="w-full h-full flex items-end justify-between gap-2">
                {['2020', '2021', '2022', '2023', '2024', '2025'].map((year, i) => (
                  <div key={year} className="flex flex-col items-center gap-2 flex-1 group">
                    <div
                      className="w-full bg-indigo-600 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all"
                      style={{ height: `${10 + (i * 15)}%` }} // Mock trend growing
                    ></div>
                    <span className="text-xs text-slate-400 font-medium">{year}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Mix Tech Chart (Span 1) */}
          <Card className="p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <div className="w-5 h-5 border-2 border-indigo-600 rounded-full border-t-transparent animate-spin-slow" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Mix Tecnologico</h3>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* CSS Donut Chart */}
              <div className="relative w-48 h-48 rounded-full"
                style={{
                  background: `conic-gradient(
                        #6366f1 0% 45%, 
                        #10b981 45% 70%, 
                        #f59e0b 70% 85%, 
                        #3b82f6 85% 100%
                      )`
                }}>
                <div className="absolute inset-4 bg-white dark:bg-slate-900 rounded-full flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800 dark:text-white">42</span>
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Totali</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-500">UiPath (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-500">Python (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-slate-500">AI/ML (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-xs font-bold text-slate-500">Power Auto (15%)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
