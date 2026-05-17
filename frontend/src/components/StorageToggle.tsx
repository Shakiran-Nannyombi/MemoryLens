import { useStore } from '../store/useStore';
import { Icon } from './ui/Icon';

interface StorageToggleProps {
    className?: string;
}

export function StorageToggle({ className }: StorageToggleProps) {
    const useMidnight = useStore((state) => state.useMidnight);
    const walletConnected = useStore((state) => state.walletConnected);
    const toggleStorage = useStore((state) => state.toggleStorage);

    const handleToggle = (value: boolean) => {
        // Don't allow switching to Midnight if wallet not connected
        if (value && !walletConnected) {
            console.warn('Cannot switch to Midnight: wallet not connected');
            return;
        }
        useStore.setState({ useMidnight: value });
    };

    return (
        <div
            className={`bg-surface-container-low rounded-xl p-4 flex items-center justify-between ${className ?? ''}`}
        >
            {/* Left: icon + label */}
            <div className="flex items-center gap-3">
                <Icon name="database" className="text-on-surface-variant" />
                <span className="font-label-lg text-label-lg text-on-surface">
                    Storage Mode
                </span>
            </div>

            {/* Pill toggle */}
            <div className="bg-surface-container-high rounded-full p-1 flex">
                {/* Supabase option */}
                <button
                    type="button"
                    onClick={() => handleToggle(false)}
                    className={`
            flex items-center gap-2 px-4 rounded-full transition-colors duration-150
            min-h-[48px] active:scale-95
            ${!useMidnight
                            ? 'bg-surface-container-highest text-on-surface'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }
          `}
                    aria-label="Switch to Supabase storage"
                    title="Fast cloud storage with Supabase"
                >
                    <span>⚡</span>
                    <span className="font-label-lg text-label-lg whitespace-nowrap">Fast (Supabase)</span>
                </button>

                {/* Midnight option */}
                <button
                    type="button"
                    role="switch"
                    aria-checked={useMidnight}
                    onClick={() => handleToggle(true)}
                    disabled={!walletConnected}
                    className={`
            flex items-center gap-2 px-4 rounded-full transition-colors duration-150
            min-h-[48px] active:scale-95
            ${useMidnight
                            ? 'bg-secondary text-on-secondary midnight-glow'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }
            ${!walletConnected ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                    aria-label="Switch to Midnight private storage"
                    title={walletConnected ? "Private blockchain storage with Midnight" : "Connect wallet to use Midnight storage"}
                >
                    <Icon name="lock" size={18} />
                    <span>🌙</span>
                    <span className="font-label-lg text-label-lg whitespace-nowrap">Private (Midnight)</span>
                </button>
            </div>
        </div>
    );
}
