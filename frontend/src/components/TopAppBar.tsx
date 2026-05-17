import { Icon } from './ui/Icon';

interface TopAppBarProps {
    transparent?: boolean;
    className?: string;
}

export function TopAppBar({ transparent = false, className = '' }: TopAppBarProps) {
    const baseClasses = transparent
        ? 'bg-surface/80 backdrop-blur-md fixed top-0 z-50 w-full'
        : 'bg-surface shadow-sm sticky top-0 z-50 w-full';

    return (
        <header className={`${baseClasses} ${className}`}>
            <div className="max-w-7xl mx-auto px-container-margin h-touch-target-min flex items-center justify-between">
                {/* Left slot: visibility icon + brand name */}
                <div className="flex items-center gap-2">
                    <Icon name="visibility" size={24} className="text-primary" />
                    <span className="text-primary font-headline-md text-headline-md">
                        MemoryLens
                    </span>
                </div>

                {/* Right slot: privacy settings button */}
                <button
                    aria-label="Privacy settings"
                    className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-full text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95 duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <Icon name="shield" size={24} />
                </button>
            </div>
        </header>
    );
}
