import React from 'react';
import { Icon } from './ui/Icon';

interface NotificationToastProps {
    icon: string;
    message: React.ReactNode;
    onDismiss: () => void;
    visible: boolean;
}

export function NotificationToast({ icon, message, onDismiss, visible }: NotificationToastProps) {
    return (
        <div
            className={[
                'fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-48px)] max-w-md',
                'transition-all duration-200',
                visible
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-4 opacity-0 pointer-events-none',
            ].join(' ')}
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="bg-surface rounded-xl shadow-xl border-t-4 border-secondary px-4 py-3 flex items-center gap-3">
                {/* Icon container */}
                <div className="bg-secondary/10 rounded-lg p-2 shrink-0">
                    <Icon name={icon} size={24} className="text-secondary" />
                </div>

                {/* Message */}
                <div className="flex-1 text-on-surface font-body-md text-body-md">
                    {message}
                </div>

                {/* Dismiss button */}
                <button
                    onClick={onDismiss}
                    aria-label="Dismiss notification"
                    className="shrink-0 flex items-center justify-center min-h-[48px] min-w-[48px] rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95 duration-150"
                >
                    <Icon name="close" size={20} />
                </button>
            </div>
        </div>
    );
}
