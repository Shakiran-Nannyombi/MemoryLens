import { Shield, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface Props {
    className?: string;
}

export function PrivacyToggle({ className }: Props) {
    const useMidnight = useStore((s) => s.useMidnight);
    const setUseMidnight = useStore((s) => s.setUseMidnight);

    return (
        <div className={cn('flex items-center gap-3 p-3 rounded-xl border bg-white', className)}>
            {/* Label left */}
            <div className={cn('flex items-center gap-1.5 text-sm font-medium transition-colors',
                !useMidnight ? 'text-blue-600' : 'text-gray-400')}>
                <Zap className="w-4 h-4" />
                <span>Fast</span>
            </div>

            {/* Toggle pill */}
            <button
                role="switch"
                aria-checked={useMidnight}
                onClick={() => setUseMidnight(!useMidnight)}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
                    'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-purple-500 focus-visible:ring-offset-2',
                    useMidnight ? 'bg-purple-600' : 'bg-gray-300'
                )}
            >
                <span
                    className={cn(
                        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg',
                        'transform transition-transform duration-200',
                        useMidnight ? 'translate-x-5' : 'translate-x-0'
                    )}
                />
            </button>

            {/* Label right */}
            <div className={cn('flex items-center gap-1.5 text-sm font-medium transition-colors',
                useMidnight ? 'text-purple-600' : 'text-gray-400')}>
                <Shield className="w-4 h-4" />
                <span>Private</span>
            </div>

            {/* Badge */}
            {useMidnight && (
                <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    Midnight 🌙
                </span>
            )}
        </div>
    );
}
