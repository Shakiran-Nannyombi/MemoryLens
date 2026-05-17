import { Icon } from './ui/Icon';

interface Props {
    activeStep: 0 | 1 | 2 | 3;
    className?: string;
}

const STEPS = [
    'Encrypting memory data',
    'Generating ZK proof',
    'Submitting to Midnight',
    'Confirmed on-chain',
];

export function MidnightLoader({ activeStep, className }: Props) {
    return (
        <div
            className={`bg-surface/10 backdrop-blur-md rounded-xl p-8 ${className ?? ''}`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Icon
                    name="shield"
                    filled
                    size={28}
                    className="text-secondary animate-pulse"
                />
                <h3 className="text-headline-md font-headline-md text-on-surface">
                    ZK Proof Generation
                </h3>
            </div>

            {/* Steps */}
            <div className="space-y-6">
                {STEPS.map((label, index) => {
                    const isDone = index < activeStep;
                    const isActive = index === activeStep;
                    const isPending = index > activeStep;

                    return (
                        <div
                            key={label}
                            className={`flex items-center gap-4 ${isPending ? 'opacity-50' : ''}`}
                        >
                            {/* Step indicator */}
                            {isDone && (
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                    <Icon name="check" filled size={18} className="text-on-secondary" />
                                </div>
                            )}

                            {isActive && (
                                <div className="w-8 h-8 rounded-full border-2 border-secondary flex items-center justify-center shrink-0">
                                    <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-bounce" />
                                </div>
                            )}

                            {isPending && (
                                <div className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center shrink-0">
                                    <span className="text-xs font-semibold text-on-surface-variant">
                                        {index + 1}
                                    </span>
                                </div>
                            )}

                            {/* Step label */}
                            <span
                                className={`text-body-md font-body-md ${isActive
                                        ? 'font-bold text-on-surface'
                                        : isDone
                                            ? 'text-on-surface'
                                            : 'text-on-surface-variant'
                                    }`}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
