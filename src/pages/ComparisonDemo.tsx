import { useState } from 'react';
import { Shield, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { MidnightLoader } from '../components/MidnightLoader';
import { TxSuccess } from '../components/TxSuccess';
import { mockStoreMemory } from '../lib/mockMidnight';
import { cn } from '../lib/utils';

type StorageMode = 'supabase' | 'midnight';

interface CompareRow {
    label: string;
    supabase: { value: string; good: boolean | null };
    midnight: { value: string; good: boolean | null };
}

const rows: CompareRow[] = [
    {
        label: 'Storage Speed',
        supabase: { value: '< 100ms', good: true },
        midnight: { value: '2–5 seconds (ZK proof)', good: null },
    },
    {
        label: 'Data Encryption',
        supabase: { value: 'In transit only', good: false },
        midnight: { value: 'End-to-end encrypted', good: true },
    },
    {
        label: 'Who can see data',
        supabase: { value: 'Supabase admins + you', good: false },
        midnight: { value: 'Only you + authorized caregivers', good: true },
    },
    {
        label: 'Selective Disclosure',
        supabase: { value: 'Not supported', good: false },
        midnight: { value: 'Per-caregiver, per-data-type', good: true },
    },
    {
        label: 'Audit Trail',
        supabase: { value: 'Server logs (mutable)', good: false },
        midnight: { value: 'Immutable on-chain', good: true },
    },
    {
        label: 'HIPAA Compliance',
        supabase: { value: 'Requires extra config', good: null },
        midnight: { value: 'Privacy-by-design', good: true },
    },
    {
        label: 'Data Ownership',
        supabase: { value: 'Centralized server', good: false },
        midnight: { value: 'Patient-controlled', good: true },
    },
];

function StatusIcon({ good }: { good: boolean | null }) {
    if (good === true) return <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />;
    if (good === false) return <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
    return <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />;
}

export default function ComparisonDemo() {
    const [mode, setMode] = useState<StorageMode>('supabase');
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [supabaseDone, setSupabaseDone] = useState(false);

    const handleStore = async () => {
        setTxHash(null);
        setSupabaseDone(false);
        setLoading(true);

        if (mode === 'supabase') {
            await new Promise((r) => setTimeout(r, 80));
            setSupabaseDone(true);
        } else {
            const hash = await mockStoreMemory({ demo: true, timestamp: Date.now() });
            setTxHash(hash);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4 pb-24">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Storage Comparison</h1>
                <p className="text-sm text-gray-500 mt-1">
                    See the difference between Supabase and Midnight blockchain storage.
                </p>
            </div>

            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-3">
                {(['supabase', 'midnight'] as StorageMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => { setMode(m); setTxHash(null); setSupabaseDone(false); }}
                        className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                            mode === m
                                ? m === 'midnight'
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        )}
                    >
                        {m === 'supabase'
                            ? <Zap className={cn('w-6 h-6', mode === m ? 'text-blue-600' : 'text-gray-400')} />
                            : <Shield className={cn('w-6 h-6', mode === m ? 'text-purple-600' : 'text-gray-400')} />
                        }
                        <span className={cn(
                            'text-sm font-semibold',
                            mode === m
                                ? m === 'midnight' ? 'text-purple-700' : 'text-blue-700'
                                : 'text-gray-500'
                        )}>
                            {m === 'supabase' ? '⚡ Supabase' : '🌙 Midnight'}
                        </span>
                        <span className="text-xs text-gray-400">
                            {m === 'supabase' ? 'Fast, centralized' : 'Private, on-chain'}
                        </span>
                    </button>
                ))}
            </div>

            {/* Live demo */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <h2 className="text-sm font-semibold text-gray-700">Live Demo</h2>

                {loading && mode === 'midnight' && <MidnightLoader />}

                {!loading && txHash && (
                    <TxSuccess txHash={txHash} onClose={() => setTxHash(null)} />
                )}

                {!loading && supabaseDone && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-blue-800 font-medium">Stored in Supabase in &lt;100ms ⚡</p>
                    </div>
                )}

                {!loading && (
                    <Button
                        onClick={handleStore}
                        className={cn(
                            'w-full gap-2',
                            mode === 'midnight'
                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        )}
                    >
                        {mode === 'midnight' ? <Shield className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        Store Sample Memory via {mode === 'midnight' ? 'Midnight' : 'Supabase'}
                    </Button>
                )}
            </div>

            {/* Comparison table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <div className="p-3">Feature</div>
                    <div className="p-3 text-blue-600">⚡ Supabase</div>
                    <div className="p-3 text-purple-600">🌙 Midnight</div>
                </div>
                {rows.map((row, i) => (
                    <div
                        key={row.label}
                        className={cn('grid grid-cols-3 border-b border-gray-100 last:border-0', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}
                    >
                        <div className="p-3 text-xs font-medium text-gray-700">{row.label}</div>
                        <div className="p-3 flex items-start gap-1.5">
                            <StatusIcon good={row.supabase.good} />
                            <span className="text-xs text-gray-600">{row.supabase.value}</span>
                        </div>
                        <div className="p-3 flex items-start gap-1.5">
                            <StatusIcon good={row.midnight.good} />
                            <span className="text-xs text-gray-600">{row.midnight.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
