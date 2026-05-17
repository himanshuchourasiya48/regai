'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const samples = {
  rbi: `Reserve Bank of India - Circular RBI/2024-25/89
Effective Date: March 1, 2025
1. All banks must re-verify KYC documents for High Risk customers within 90 days.
2. Banks must integrate centralised KYC utility within 120 days.
3. Staff must complete AML refresher training of 4 hours within 60 days.
4. Beneficial ownership records must be updated in CBS for all corporate accounts within 45 days.
5. Monthly compliance report must be submitted to CCO within 30 days.
6. IT systems must flag transactions above INR 10 lakhs in real-time within 90 days.
7. Legal teams must update Terms and Conditions to reflect new KYC norms within 30 days.`,
  sebi: `SEBI Circular - Insider Trading Prevention
Effective Date: February 15, 2025
1. All listed entities must appoint a Compliance Officer within 30 days.
2. Trading window closure procedures must be digitally logged from April 1, 2025.
3. HR must conduct mandatory SEBI PIT Regulations training for all employees within 45 days.
4. Legal must revise Code of Conduct to include updated UPSI definitions within 21 days.
5. IT must implement digital pre-clearance workflows within 60 days.`,
  aml: `AML/CFT Guidelines Update - FIU Notification
Effective: Immediately
1. Banks must file STRs within 7 days of detection.
2. Transaction monitoring models must be updated every quarter, first model within 60 days.
3. Operations must implement EDD for PEPs within 45 days.
4. All wire transfers above USD 1000 must carry complete originator information immediately.
5. Annual AML training certification mandatory for all staff within 90 days.`
};

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadSample = (key) => {
    setText(samples[key]);
  };

  const analyze = async () => {
    if (!text || text.length < 50) {
      setError('Please load a sample or paste regulation text first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      localStorage.setItem('regai_data', JSON.stringify(data));
      router.push('/maps');
    } catch (e) {
      setError('Error: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">Reg<span className="text-blue-500">AI</span></div>
        <div className="text-sm text-gray-500 font-mono">Agentic Regulatory Intelligence</div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-blue-500 text-xs font-mono uppercase tracking-widest mb-4">Step 1 of 4</div>
        <h1 className="text-4xl font-light mb-4 leading-tight">
          Turn regulations into <span className="text-blue-400 italic">action</span> automatically
        </h1>
        <p className="text-gray-400 mb-10 text-base leading-relaxed">
          Paste any RBI, SEBI, or IRDAI circular. Our AI reads it, breaks it into measurable action points, and routes them to the right departments.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
          <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">Load a sample</div>
          <div className="flex gap-2 flex-wrap mb-5">
            <button
              onClick={() => loadSample('rbi')}
              className="text-xs px-4 py-2 rounded-full border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all font-mono">
              RBI KYC Circular
            </button>
            <button
              onClick={() => loadSample('sebi')}
              className="text-xs px-4 py-2 rounded-full border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all font-mono">
              SEBI Insider Trading
            </button>
            <button
              onClick={() => loadSample('aml')}
              className="text-xs px-4 py-2 rounded-full border border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all font-mono">
              AML Guidelines
            </button>
          </div>
          <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">Or paste regulation text</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste full regulation text here..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 outline-none resize-y min-h-52 focus:border-blue-500 transition-colors"
          />
        </div>

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-3 text-red-300 text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all">
          {loading ? 'Analysing... please wait' : 'Analyse Regulation →'}
        </button>
      </div>
    </main>
  );
}