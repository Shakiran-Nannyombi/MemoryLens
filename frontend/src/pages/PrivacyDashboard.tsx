import { useEffect, useState } from 'react';
import { Shield, Users, Clock, Trash2, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { WalletConnect } from '../components/WalletConnect';
import { useStore } from '../store/useStore';
import { mockGetAuditTrail, mockGetStats } from '../lib/mockMidnight';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AuditEntry {
    caregiverId: string;
    action: string;
    accessedAt: number;
}

interface Stats {
    totalEvents: number;
    totalCaregivers: number;
    lastUpdated: Date;
}

const ACCESS_TYPES = [
    { key: 'faces', label: 'Face Recognition Data', description: 'Biometric face descriptors' },
    { key: 'voice', label: 'Voice Transcripts', description: 'Conversation recordings' },
    { key: 'objects', label: 'Object Locations', description: 'Where items were last seen' },
    { key: 'location', label: 'GPS Coordinates', description: 'Location history' },
    { key: 'medications', label: 'Medication Reminders', description: 'Medical schedule data' },
];

export default function PrivacyDashboard() {
    const walletConnected = useStore((s) => s.walletConnected);

    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [permissions, setPermissions] = useState<Record<string, boolean>>({
        faces: true, voice: true, objects: true, location: false, medications: true,
    });
    const [loadingAudit, setLoadingAudit] = useState(false);

    useEffect(() => {
        if (!walletConnected) return;
        setLoadingAudit(true);
        Promise.all([mockGetAuditTrail(), mockGetStats()])
            .then(([log, s]) => {
                setAuditLog(log);
                setStats(s);
            })
            .finally(() => setLoadingAudit(false));
    }, [walletConnected]);

    const togglePermission = (key: string) =>
        setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));

    if (!walletConnected) {
        return (
            <div className="max-w-md mx-auto mt-12 space-y-4 text-center px-4">
                <Shield className="w-12 h-12 text-purple-400 mx-auto" />
                <h2 className="text-xl font-bold text-gray-900">Connect Your Wallet</h2>
                <p className="text-sm text-gray-500">
                    Connect your 1AM wallet to manage privacy settings and view your audit trail.
                </p>
                <WalletConnect />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4 pb-24">
            <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">Privacy Settings</h1>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                        <p className="text-2xl font-bold text-purple-700">{stats.totalEvents}</p>
                        <p className="text-xs text-purple-500 mt-0.5">Encrypted memories</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                        <p className="text-2xl font-bold text-purple-700">{stats.totalCaregivers}</p>
                        <p className="text-xs text-purple-500 mt-0.5">Authorized caregivers</p>
                    </div>
                </div>
            )}

            {/* Wallet */}
            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Wallet</h2>
                <WalletConnect />
            </section>

            {/* Selective Disclosure */}
            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Data Access Control
                    </h2>
                </div>
                <p className="text-xs text-gray-500">
                    Choose which types of data caregivers can access.
                </p>
                <div className="space-y-3">
                    {ACCESS_TYPES.map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-gray-800">{label}</p>
                                <p className="text-xs text-gray-400">{description}</p>
                            </div>
                            <button
                                role="switch"
                                aria-checked={permissions[key]}
                                onClick={() => togglePermission(key)}
                                className={cn(
                                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
                                    'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
                                    permissions[key] ? 'bg-purple-600' : 'bg-gray-300'
                                )}
                            >
                                <span className={cn(
                                    'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200',
                                    permissions[key] ? 'translate-x-4' : 'translate-x-0'
                                )} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Authorized Caregivers */}
            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" />
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Authorized Caregivers
                        </h2>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white gap-1 h-8 text-xs">
                        <Plus className="w-3 h-3" /> Add
                    </Button>
                </div>

                {/* Mock caregivers */}
                {[
                    { name: 'Dr. Smith', role: 'Medical', access: 'Medications only' },
                    { name: 'Nurse Joy', role: 'Emergency', access: 'Full access' },
                ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-800">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.role} · {c.access}</p>
                        </div>
                        <button className="text-red-400 hover:text-red-600 transition-colors" aria-label="Revoke access">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </section>

            {/* Audit Trail */}
            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Access History
                    </h2>
                </div>

                {loadingAudit ? (
                    <p className="text-sm text-gray-400 text-center py-4">Loading audit trail...</p>
                ) : auditLog.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No access events yet.</p>
                ) : (
                    <div className="space-y-2">
                        {auditLog.map((entry, i) => (
                            <div key={i} className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{entry.caregiverId}</p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {entry.action.replace(/_/g, ' ')}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">
                                    {formatDistanceToNow(entry.accessedAt, { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
