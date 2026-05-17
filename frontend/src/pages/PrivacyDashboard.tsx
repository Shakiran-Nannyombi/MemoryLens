import { useEffect, useState } from 'react';
import { WalletConnect } from '../components/WalletConnect';
import { PrivacyToggle } from '../components/PrivacyToggle';
import { TopAppBar } from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import { Icon } from '../components/ui/Icon';
import { useStore } from '../store/useStore';
import { mockGetAuditTrail, mockGetStats } from '../lib/mockMidnight';
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
    { key: 'faces', icon: 'face', label: 'Face Recognition Data', description: 'Biometric face descriptors' },
    { key: 'voice', icon: 'settings_voice', label: 'Voice Transcripts', description: 'Conversation recordings' },
    { key: 'objects', icon: 'category', label: 'Object Locations', description: 'Where items were last seen' },
    { key: 'location', icon: 'location_on', label: 'GPS Coordinates', description: 'Location history' },
    { key: 'medications', icon: 'health_and_safety', label: 'Medication Reminders', description: 'Medical schedule data' },
];

const MOCK_CAREGIVERS = [
    { id: '1', name: 'Dr. Smith', role: 'Medical Professional' },
    { id: '2', name: 'Nurse Joy', role: 'Primary Caregiver' },
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

    const togglePermission = (key: string, value: boolean) =>
        setPermissions((prev) => ({ ...prev, [key]: value }));

    // ── Disconnected state ──────────────────────────────────────────────────
    if (!walletConnected) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <TopAppBar />
                <main className="flex-1 flex items-center justify-center px-container-margin py-stack-gap">
                    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-soft border border-surface-variant/30 max-w-sm w-full text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                            <Icon name="shield" size={32} className="text-secondary" filled />
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">
                            Connect Your Wallet
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Connect your 1AM wallet to manage privacy settings and view your audit trail.
                        </p>
                        <WalletConnect className="mx-auto" />
                    </div>
                </main>
                <BottomNav currentPath="/privacy" />
            </div>
        );
    }

    // ── Connected state ─────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background">
            <TopAppBar />

            <main className="max-w-7xl mx-auto px-container-margin pt-stack-gap space-y-stack-gap pb-32">

                {/* ── Header section: gradient-midnight ── */}
                <section className="gradient-midnight rounded-xl p-8 shadow-soft">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        {/* Left: title */}
                        <div className="space-y-unit">
                            <div className="flex items-center gap-3">
                                <Icon name="shield" size={40} className="text-white" filled />
                                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white">
                                    Privacy Dashboard
                                </h2>
                            </div>
                            <p className="font-body-md text-body-md text-white/80">
                                Manage your digital sanctuary and encrypted memory access.
                            </p>
                        </div>

                        {/* Right: WalletConnect card (glassmorphism) */}
                        <WalletConnect />
                    </div>
                </section>

                {/* ── Two-column grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-gap">

                    {/* ── Left column (7) ── */}
                    <div className="lg:col-span-7 space-y-stack-gap">

                        {/* Selective Disclosure Card */}
                        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-variant/30">
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
                                Selective Disclosure
                            </h3>
                            <div className="space-y-4">
                                {ACCESS_TYPES.map(({ key, icon, label, description }) => (
                                    <div
                                        key={key}
                                        className="bg-surface-container-low rounded-lg p-4 flex items-center justify-between"
                                    >
                                        {/* Left: icon + label + description */}
                                        <div className="flex items-center gap-4">
                                            <Icon name={icon} size={24} className="text-secondary" />
                                            <div>
                                                <p className="font-label-lg text-label-lg text-on-surface">
                                                    {label}
                                                </p>
                                                <p className="font-body-md text-sm text-on-surface-variant">
                                                    {description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: PrivacyToggle */}
                                        <PrivacyToggle
                                            checked={permissions[key]}
                                            onChange={(v) => togglePermission(key, v)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Audit Trail Card */}
                        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-variant/30">
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
                                Audit Trail
                            </h3>

                            {loadingAudit ? (
                                <p className="font-body-md text-body-md text-on-surface-variant text-center py-4">
                                    Loading audit trail…
                                </p>
                            ) : auditLog.length === 0 ? (
                                <p className="font-body-md text-body-md text-on-surface-variant text-center py-4">
                                    No access events yet.
                                </p>
                            ) : (
                                <div className="relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-outline-variant">
                                    {auditLog.map((entry, i) => (
                                        <div key={i} className="relative mb-6">
                                            {/* Timeline node */}
                                            <div
                                                className={[
                                                    'absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center',
                                                    i === 0
                                                        ? 'bg-secondary ring-4 ring-background'
                                                        : 'bg-surface-container-highest',
                                                ].join(' ')}
                                            >
                                                <Icon
                                                    name={i === 0 ? 'lock' : 'history'}
                                                    size={12}
                                                    className={i === 0 ? 'text-white' : 'text-on-surface-variant'}
                                                    filled={i === 0}
                                                />
                                            </div>

                                            {/* Entry content */}
                                            <div>
                                                <p className="font-body-md text-body-md text-on-surface">
                                                    {entry.caregiverId}
                                                </p>
                                                <p className="font-body-md text-sm text-on-surface-variant capitalize">
                                                    {entry.action.replace(/_/g, ' ')}
                                                </p>
                                                <p className="text-xs text-outline mt-1">
                                                    {formatDistanceToNow(entry.accessedAt, { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right column (5) ── */}
                    <div className="lg:col-span-5 space-y-stack-gap">

                        {/* Authorized Caregivers Card */}
                        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-soft border border-surface-variant/30">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-headline-md text-headline-md text-on-surface">
                                    Authorized Caregivers
                                </h3>
                                <button
                                    aria-label="Add caregiver"
                                    className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95 duration-150"
                                >
                                    <Icon name="person_add" size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {MOCK_CAREGIVERS.map((caregiver) => (
                                    <div
                                        key={caregiver.id}
                                        className="bg-surface rounded-xl border border-outline-variant/20 p-4 flex items-center gap-4"
                                    >
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                                            <Icon name="person" size={24} className="text-on-surface-variant" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-label-lg text-label-lg text-on-surface truncate">
                                                {caregiver.name}
                                            </p>
                                            <p className="font-body-md text-sm text-on-surface-variant truncate">
                                                {caregiver.role}
                                            </p>
                                        </div>

                                        {/* Revoke button */}
                                        <button
                                            aria-label={`Revoke access for ${caregiver.name}`}
                                            className="text-error hover:bg-error/10 rounded-lg h-[48px] px-3 transition-colors active:scale-95 duration-150 font-label-lg text-sm shrink-0"
                                        >
                                            Revoke
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Info note */}
                            <div className="mt-6 bg-secondary/5 border border-secondary/20 border-dashed rounded-xl p-4">
                                <div className="flex gap-3">
                                    <Icon name="info" size={20} className="text-secondary shrink-0 mt-0.5" />
                                    <p className="font-body-md text-sm text-on-surface-variant italic">
                                        Revoking a caregiver immediately terminates their access to all future
                                        memories and deletes their current session keys.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Tips Card */}
                        <div className="bg-primary p-6 rounded-xl text-white shadow-soft">
                            <h4 className="font-headline-md text-headline-md text-white mb-2">
                                Pro Tip: Biometric Lock
                            </h4>
                            <p className="font-body-md text-sm text-white/80 mb-4">
                                Enable 2FA for all memory deletions to ensure your history remains under
                                your absolute control.
                            </p>
                            <button className="bg-white text-primary rounded-lg px-4 py-2 font-label-lg text-label-lg active:scale-95 duration-150 transition-colors hover:bg-primary-fixed w-full">
                                Setup Security Key
                            </button>
                        </div>

                    </div>
                </div>
            </main>

            <BottomNav currentPath="/privacy" />
        </div>
    );
}
