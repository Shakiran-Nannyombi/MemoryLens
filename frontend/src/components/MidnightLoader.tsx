import { Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
    message?: string;
    className?: string;
}

const steps = [
    'Encrypting data...',
    'Generating ZK proof...',
    'Submitting to Midnight...',
    'Waiting for confirmation...',
];

export function MidnightLoader({ message, className }: Props) {
    return (
        <div className={cn('flex flex-col items-center gap-4 py-8 px-6', className)}>
            {/* Animated icon */}
            <div className="relative">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-purple-600" />
                </div>
                <Loader2 className="w-14 h-14 text-purple-400 animate-spin absolute inset-0" />
            </div>

            <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-purple-800">
                    {message ?? 'Storing on Midnight blockchain'}
                </p>
                <p className="text-xs text-gray-500">This takes 2–5 seconds</p>
            </div>

            {/* Step indicators */}
            <div className="w-full max-w-xs space-y-2">
                {steps.map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                        <div className={cn(
                            'w-1.5 h-1.5 rounded-full shrink-0',
                            i === 1 ? 'bg-purple-600 animate-pulse' : i < 1 ? 'bg-purple-300' : 'bg-gray-200'
                        )} />
                        <span className={cn(
                            'text-xs',
                            i === 1 ? 'text-purple-700 font-medium' : i < 1 ? 'text-purple-400' : 'text-gray-300'
                        )}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
