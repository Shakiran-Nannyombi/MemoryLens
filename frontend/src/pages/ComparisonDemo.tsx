import { useState } from 'react';
import { TopAppBar } from '../components/TopAppBar';
import BottomNav from '../components/BottomNav';
import { MidnightLoader } from '../components/MidnightLoader';
import { Icon } from '../components/ui/Icon';
import { mockStoreMemory } from '../lib/mockMidnight';

// ── Supabase feature rows ──────────────────────────────────────────────────
const SUPABASE_FEATURES: { label: string; negative: boolean }[] = [
    { label: 'Operator Visibility into Raw Data', negative: true },
    { label: 'Centralized Risk Vector', negative: true },
    { label: 'High Speed Transactional I/O', negative: false },
];

// ── Midnight feature rows ──────────────────────────────────────────────────
const MIDNIGHT_FEATURES: { label: string }[] = [
    { label: 'Zero-Knowledge Data Shielding' },
    { label: 'Decentralized Trust Protocol' },
    { label: 'Complete Privacy Sovereignty' },
];

export default function ComparisonDemo() {
    const [zkStep, setZkStep] = useState<0 | 1 | 2 | 3>(1);
    const [isRunning, setIsRunning] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);

    // Preserve existing demo logic — simulate ZK proof steps then store
    const handleStoreSampleMemory = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setTxHash(null);
        setZkStep(0);

        // Step 0 → 1: encrypting
        await new Promise((r) => setTimeout(r, 800));
        setZkStep(1);

        // Step 1 → 2: generating proof (mockStoreMemory takes ~2.5s)
        const hashPromise = mockStoreMemory({ demo: true, timestamp: Date.now() });
        await new Promise((r) => setTimeout(r, 1200));
        setZkStep(2);

        // Step 2 → 3: submitting
        const hash = await hashPromise;
        await new Promise((r) => setTimeout(r, 600));
        setZkStep(3);

        setTxHash(hash);
        setIsRunning(false);
    };

    return (
        <>
            {/* Sticky top bar */}
            <TopAppBar />

            <main className="max-w-7xl mx-auto px-container-margin pt-10 pb-32">

                {/* ── Page heading ─────────────────────────────────────────── */}
                <section className="mb-12 text-center">
                    <h1 className="font-display-lg text-display-lg text-primary mb-4">
                        Infrastructure Comparison
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto text-center">
                        Evaluating data residency and privacy sovereignty for digital memories.
                        MemoryLens prioritises ZK-proof verification over traditional cloud storage.
                    </p>
                </section>

                {/* ── Comparison grid ──────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-gap mb-12">

                    {/* Supabase card — col-span-5 */}
                    <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(66,67,42,0.05)] border-t-4 border-outline-variant">
                        {/* Card header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center">
                                <Icon name="database" className="text-outline" size={24} />
                            </div>
                            <div>
                                <h2 className="font-headline-md text-headline-md text-on-surface">Supabase</h2>
                                <p className="font-label-lg text-label-lg text-outline">Traditional Cloud Architecture</p>
                            </div>
                        </div>

                        {/* Feature rows */}
                        <div className="space-y-1">
                            {SUPABASE_FEATURES.map((feature) => (
                                <div
                                    key={feature.label}
                                    className="flex items-center gap-4 py-3 border-b border-surface-container last:border-0"
                                >
                                    <Icon
                                        name={feature.negative ? 'close' : 'check'}
                                        className={feature.negative ? 'text-error' : 'text-primary'}
                                        size={24}
                                    />
                                    <span className="font-body-md text-body-md text-on-surface">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VS divider — col-span-2 */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center py-4">
                        <div className="h-full w-px bg-outline-variant hidden lg:block mb-4" />
                        <div className="bg-primary text-on-primary font-headline-md text-headline-md w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
                            VS
                        </div>
                        <div className="h-full w-px bg-outline-variant hidden lg:block mt-4" />
                    </div>

                    {/* Midnight card — col-span-5 */}
                    <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_40px_rgba(131,26,218,0.08)] border-t-4 border-secondary">
                        {/* Card header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-secondary-fixed rounded-lg flex items-center justify-center">
                                <Icon name="security" filled className="text-secondary" size={24} />
                            </div>
                            <div>
                                <h2 className="font-headline-md text-headline-md text-secondary">Midnight</h2>
                                <p className="font-label-lg text-label-lg text-on-secondary-fixed-variant">Privacy-First Blockchain</p>
                            </div>
                        </div>

                        {/* Feature rows */}
                        <div className="space-y-1">
                            {MIDNIGHT_FEATURES.map((feature) => (
                                <div
                                    key={feature.label}
                                    className="flex items-center gap-4 py-3 border-b border-surface-container last:border-0"
                                >
                                    <Icon name="check" className="text-secondary" size={24} />
                                    <span className="font-body-md text-body-md text-on-surface">{feature.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Dark action card ─────────────────────────────────────── */}
                <div className="bg-inverse-surface text-white rounded-xl p-10 overflow-hidden relative">
                    {/* Decorative shield — background */}
                    <div className="absolute top-0 right-0 p-8 pointer-events-none select-none">
                        <Icon
                            name="shield_with_heart"
                            filled
                            size={120}
                            className="text-white opacity-10"
                        />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Left: heading + description + CTA */}
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-white mb-4">
                                Secure Memory Archiving
                            </h2>
                            <p className="font-body-lg text-body-lg text-outline-variant mb-8">
                                Test the Zero-Knowledge proof generation process. Your memory is
                                transformed into a cryptographic proof that confirms its validity
                                without revealing its content.
                            </p>

                            {/* Success state */}
                            {txHash && !isRunning && (
                                <div className="mb-6 flex items-center gap-3 bg-secondary/20 border border-secondary/30 rounded-xl px-5 py-3">
                                    <Icon name="check_circle" filled className="text-secondary" size={20} />
                                    <span className="font-label-lg text-label-lg text-white break-all">
                                        Stored: {txHash.slice(0, 18)}…
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={handleStoreSampleMemory}
                                disabled={isRunning}
                                aria-label="Store Sample Memory via Midnight ZK proof"
                                className="bg-secondary text-on-secondary-container h-[56px] px-8 rounded-xl font-label-lg text-label-lg flex items-center gap-3 active:scale-95 duration-150 transition-all hover:bg-secondary-container disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Icon name="add_photo_alternate" size={20} />
                                {isRunning ? 'Processing…' : 'Store Sample Memory'}
                            </button>
                        </div>

                        {/* Right: MidnightLoader ZK stepper */}
                        <MidnightLoader activeStep={zkStep} />
                    </div>
                </div>
            </main>

            {/* Bottom navigation */}
            <BottomNav currentPath="/compare" />
        </>
    );
}
