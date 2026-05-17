import { useStore } from '../store/useStore';
import { Icon } from './ui/Icon';

interface StorageToggleProps {
    className?: string;
}

export function StorageToggle({ className }: StorageToggleProps) {
    const useMidnight = useStore((state) => state.useMidnight);
    const setUseMidnight = useStore((state) => state.setUseMidnight);

    return (
        <div
            className={`bg-surface-container-low rounded-xl p-4 flex items-center justify-between ${className ?? ''}`}
        >
            {/* Left: icon + label */}
            <div className="flex items-center gap-3">
                <Icon name="database" className="text-on-surface-variant" />
                <span className="font-label-lg text-label-lg text-on-surface">
                    Cloud Memory Status
                </span>
            </div>

            {/* Pill toggle */}
            <div className="bg-surface-container-high rounded-full p-1 flex">
                {/* Supabase option */}
                <button
                    type="button"
                    onClick={() => setUseMidnight(false)}
                    className={`
            flex items-center gap-2 px-4 rounded-full transition-colors duration-150
            min-h-[48px] active:scale-95
            ${!useMidnight
                            ? 'bg-surface-container-highest text-on-surface'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }
          `}
                    aria-label="Switch to Supabase storage"
                >
                    <span>⚡</span>
                    <span className="font-label-lg text-label-lg whitespace-nowrap">Fast (Supabase)</span>
                </button>

                {/* Midnight option */}
                <button
                    type="button"
                    role="switch"
                    aria-checked={useMidnight}
                    onClick={() => setUseMidnight(true)}
                    className={`
            flex items-center gap-2 px-4 rounded-full transition-colors duration-150
            min-h-[48px] active:scale-95
            ${useMidnight
                            ? 'bg-secondary text-on-secondary midnight-glow'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }
          `}
                    aria-label="Switch to Midnight private storage"
                >
                    <Icon name="lock" size={18} />
                    <span>🌙</span>
                    <span className="font-label-lg text-label-lg whitespace-nowrap">Private (Midnight)</span>
                </button>
            </div>
        </div>
    );
}
