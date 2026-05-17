import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

interface Props {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    className?: string;
}

export function PrivacyToggle({ checked, onChange, label, className }: Props) {
    // Support both controlled (checked/onChange props) and store-driven usage
    const useMidnight = useStore((s) => s.useMidnight);
    const setUseMidnight = useStore((s) => s.setUseMidnight);

    const isOn = checked !== undefined ? checked : useMidnight;

    const handleToggle = () => {
        const next = !isOn;
        if (onChange) {
            onChange(next);
        } else {
            setUseMidnight(next);
        }
    };

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {label && (
                <span className="text-body-md font-label-lg text-on-surface">
                    {label}
                </span>
            )}

            {/* Minimum 48×48px touch target wrapper (REQ-016) */}
            <div className="min-h-[48px] min-w-[48px] flex items-center justify-center">
                {/* Toggle button with role="switch" and aria-checked (REQ-016) */}
                <button
                    type="button"
                    role="switch"
                    aria-checked={isOn}
                    aria-label={label ?? 'Privacy toggle'}
                    onClick={handleToggle}
                    className={cn(
                        // Track: w-14 h-8 rounded-full (REQ-013)
                        'relative w-14 h-8 rounded-full',
                        // Smooth transition (REQ-017)
                        'transition-all duration-200',
                        // Focus ring for accessibility
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2',
                        // ON: bg-secondary, OFF: bg-outline-variant (REQ-013)
                        isOn ? 'bg-secondary' : 'bg-outline-variant'
                    )}
                >
                    {/* Knob: w-6 h-6 rounded-full bg-white shadow (REQ-013) */}
                    <span
                        className={cn(
                            'absolute top-1 w-6 h-6 rounded-full bg-white shadow',
                            // Smooth transition (REQ-017)
                            'transition-all duration-200',
                            // ON: translate-x-6, OFF: translate-x-1 (REQ-013)
                            isOn ? 'translate-x-6' : 'translate-x-1'
                        )}
                    />
                </button>
            </div>
        </div>
    );
}
