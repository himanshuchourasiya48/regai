'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const priorityClass = {
  High: 'bg-red-950 text-red-300 border border-red-800',
  Medium: 'bg-yellow-950 text-yellow-300 border border-yellow-800',
  Low: 'bg-green-950 text-green-300 border border-green-800'
};

export default function Maps() {
  const [data, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
  const saved = localStorage.getItem('regai_data');
if (!saved) { router.push('/'); return; }
const parsed = JSON.parse(saved);
if (!parsed.maps) { router.push('/'); return; }
setData(parsed);
  }, []);

  if (!data) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Reg<span className="text-blue-500">AI</span></div>
        <div className="flex gap-2 text-sm font-mono">
          <span className="text-green-400">✓ Ingest</span>
          <span className="text-white mx-2">→</span>
          <span className="text-blue-400">MAPs</span>
          <span className="text-gray-600 mx-2">→</span>
          <span className="text-gray-600">Route</span>
          <span className="text-gray-600 mx-2">→</span>
          <span className="text-gray-600">Track</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-blue-500 text-xs font-mono uppercase tracking-widest mb-4">Step 2 of 4</div>
        <h1 className="text-3xl font-light mb-2">Measurable Action Points</h1>
        <p className="text-gray-400 mb-6">AI has parsed the regulation and generated these action points.</p>

        <div className="bg-gray-900 border-l-4 border-blue-500 border border-gray-800 rounded-xl p-4 mb-8">
          <div className="font-medium text-white">{data.regulation_name}</div>
          <div className="text-sm text-gray-400 mt-1">Effective: {data.effective_date}</div>
          <div className="text-sm text-gray-300 mt-2 leading-relaxed">{data.summary}</div>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {data.maps.map((m, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-medium text-white">{i + 1}. {m.title}</div>
                <div className="flex gap-2 flex-shrink-0">
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-mono">{m.department}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-mono ${priorityClass[m.priority]}`}>{m.priority}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400 leading-relaxed mb-3">{m.description}</div>
              <div className="text-xs text-gray-600 font-mono">⏱ {m.deadline_label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all">
            Route to Departments →
          </button>
          <button onClick={() => router.push('/')}
            className="border border-gray-700 text-gray-400 hover:text-white px-6 py-3 rounded-xl transition-all">
            ← Start Over
          </button>
        </div>
      </div>
    </main>
  );
}