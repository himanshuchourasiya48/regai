'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Tracker() {
  const [tasks, setTasks] = useState({});
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('regai_data');
    const savedTasks = localStorage.getItem('regai_tasks');
    if (!saved) { router.push('/'); return; }
    setData(JSON.parse(saved));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  const allTasks = Object.values(tasks).flat();
  const total = allTasks.length;
  const done = allTasks.filter(t => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (pct / 100) * circumference;

  const statusColor = pct === 100 ? 'text-green-400' : pct >= 60 ? 'text-yellow-400' : 'text-red-400';
  const statusText = pct === 100 ? 'Fully Compliant ✓' : pct >= 60 ? 'In Progress' : 'Needs Attention';
  const ringColor = pct === 100 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#3b82f6';

  const insight = pct === 100
    ? 'All compliance tasks completed. Your organisation is fully compliant. Schedule a quarterly review to maintain adherence.'
    : pct >= 60
    ? `${done} of ${total} MAPs completed. Focus on High-priority tasks first. Review pending items with department heads immediately.`
    : `Compliance is at ${pct}%. Immediate escalation required. Hold a cross-department meeting to accelerate completion before regulatory deadlines.`;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Reg<span className="text-blue-500">AI</span></div>
        <div className="flex gap-2 text-sm font-mono">
          <span className="text-green-400">✓ Ingest</span>
          <span className="text-white mx-2">→</span>
          <span className="text-green-400">✓ MAPs</span>
          <span className="text-white mx-2">→</span>
          <span className="text-green-400">✓ Route</span>
          <span className="text-white mx-2">→</span>
          <span className="text-blue-400">Track</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-blue-500 text-xs font-mono uppercase tracking-widest mb-4">Step 4 of 4</div>
        <h1 className="text-3xl font-light mb-2">Compliance Tracker</h1>
        <p className="text-gray-400 mb-10">Real-time compliance posture across all departments.</p>

        {/* Score Ring */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-40 h-40 mb-4">
            <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
              <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
              <circle cx="80" cy="80" r="60" fill="none" stroke={ringColor} strokeWidth="10"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" style={{transition: 'stroke-dashoffset 0.8s ease'}}/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-light">{pct}%</div>
          </div>
          <div className={`text-lg font-medium ${statusColor}`}>{statusText}</div>
          <div className="text-gray-500 text-sm mt-1">Overall compliance score</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl font-light mb-1">{total}</div>
            <div className="text-xs text-gray-500 font-mono uppercase">Total MAPs</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl font-light text-green-400 mb-1">{done}</div>
            <div className="text-xs text-gray-500 font-mono uppercase">Completed</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl font-light text-yellow-400 mb-1">{total - done}</div>
            <div className="text-xs text-gray-500 font-mono uppercase">Pending</div>
          </div>
        </div>

        {/* Task Log */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
          <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-4">Task Status</div>
          <div className="flex flex-col gap-0">
            {allTasks.map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-800 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.done ? 'bg-green-400' : 'bg-yellow-400'}`}/>
                <div className="flex-1">
                  <div className="text-sm text-white">{t.title}</div>
                  <div className="text-xs text-gray-500 font-mono">{t.department} · {t.deadline_label}</div>
                </div>
                <div className={`text-xs font-mono ${t.done ? 'text-green-400' : 'text-yellow-400'}`}>
                  {t.done ? 'Done' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800 rounded-2xl p-5 mb-8">
          <div className="text-xs text-blue-400 font-mono uppercase tracking-wider mb-3">AI Compliance Insight</div>
          <div className="text-sm text-gray-300 leading-relaxed">{insight}</div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push('/dashboard')}
            className="border border-gray-700 text-gray-400 hover:text-white px-6 py-3 rounded-xl transition-all">
            ← Back to Dashboard
          </button>
          <button onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all">
            New Regulation →
          </button>
        </div>
      </div>
    </main>
  );
}