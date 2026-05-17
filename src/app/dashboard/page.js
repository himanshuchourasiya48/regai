'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const deptIcons = {
  'Legal': '⚖️', 'IT': '💻', 'Operations': '⚙️',
  'HR': '👥', 'Risk & Compliance': '🛡️', 'Finance': '📊'
};

export default function Dashboard() {
  const [tasks, setTasks] = useState({});
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('regai_data');
    if (!saved) { router.push('/'); return; }
    const data = JSON.parse(saved);
    const grouped = {};
    data.maps.forEach((m, i) => {
      if (!grouped[m.department]) grouped[m.department] = [];
      grouped[m.department].push({ ...m, done: false, idx: i });
    });
    setTasks(grouped);
  }, []);

  const toggle = (dept, i) => {
    setTasks(prev => {
      const updated = { ...prev };
      updated[dept] = updated[dept].map((t, ti) =>
        ti === i ? { ...t, done: !t.done } : t
      );
      localStorage.setItem('regai_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Reg<span className="text-blue-500">AI</span></div>
        <div className="flex gap-2 text-sm font-mono">
          <span className="text-green-400">✓ Ingest</span>
          <span className="text-white mx-2">→</span>
          <span className="text-green-400">✓ MAPs</span>
          <span className="text-white mx-2">→</span>
          <span className="text-blue-400">Route</span>
          <span className="text-gray-600 mx-2">→</span>
          <span className="text-gray-600">Track</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-blue-500 text-xs font-mono uppercase tracking-widest mb-4">Step 3 of 4</div>
        <h1 className="text-3xl font-light mb-2">Department Routing</h1>
        <p className="text-gray-400 mb-8">Each action point has been routed to the correct department. Mark tasks as complete.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.entries(tasks).map(([dept, dTasks]) => {
            const done = dTasks.filter(t => t.done).length;
            const pct = Math.round((done / dTasks.length) * 100);
            return (
              <div key={dept} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-lg">
                    {deptIcons[dept] || '📋'}
                  </div>
                  <div>
                    <div className="font-medium text-white">{dept}</div>
                    <div className="text-xs text-gray-500 font-mono">{done}/{dTasks.length} completed</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  {dTasks.map((t, i) => (
                    <div key={i} onClick={() => toggle(dept, i)}
                      className="bg-gray-800 rounded-xl p-3 flex items-start gap-3 cursor-pointer hover:bg-gray-750 transition-all">
                      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center text-xs mt-0.5 transition-all
                        ${t.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-600'}`}>
                        {t.done ? '✓' : ''}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm ${t.done ? 'line-through text-gray-500' : 'text-gray-300'}`}>{t.title}</div>
                        <div className="text-xs text-gray-600 font-mono mt-1">{t.deadline_label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: pct + '%' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push('/tracker')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all">
            View Compliance Tracker →
          </button>
          <button onClick={() => router.push('/maps')}
            className="border border-gray-700 text-gray-400 hover:text-white px-6 py-3 rounded-xl transition-all">
            ← Back to MAPs
          </button>
        </div>
      </div>
    </main>
  );
}