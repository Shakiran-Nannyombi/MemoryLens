import { Icon } from './ui/Icon';

interface PersonCardProps {
    name: string;
    relationship: string;
    imageUrl?: string;
    lastSeen?: string;
    isPrimary?: boolean;    // drives text-secondary vs text-on-surface-variant
    isEncrypted?: boolean;  // drives midnight-glow + encrypted badge
    size?: 'sm' | 'lg';    // sm = Lens View card, lg = Dashboard card
}

export function PersonCard({
    name,
    relationship,
    imageUrl,
    lastSeen,
    isPrimary = false,
    isEncrypted = false,
    size = 'lg',
}: PersonCardProps) {
    const avatarSize = size === 'sm' ? 'w-16 h-16' : 'w-24 h-24';
    const initial = name.charAt(0).toUpperCase();

    return (
        <div
            className={[
                'relative bg-surface-container-lowest rounded-xl p-6 flex flex-col items-center gap-3',
                isEncrypted ? 'midnight-glow border border-secondary/10' : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {/* Encrypted badge */}
            {isEncrypted && (
                <div
                    className="absolute top-2 right-2 bg-secondary/10 text-secondary p-2 rounded-full"
                    aria-label="Encrypted"
                >
                    <Icon name="encrypted" size={18} />
                </div>
            )}

            {/* Avatar */}
            <div
                className={`${avatarSize} rounded-full border-4 border-surface overflow-hidden flex items-center justify-center bg-surface-container-high flex-shrink-0`}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`Photo of ${name}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="font-headline-md text-headline-md text-on-surface-variant select-none">
                        {initial}
                    </span>
                )}
            </div>

            {/* Name */}
            <p className="font-headline-md text-headline-md text-on-surface text-center">
                {name}
            </p>

            {/* Relationship */}
            <p
                className={`font-label-lg text-label-lg text-center ${isPrimary ? 'text-secondary' : 'text-on-surface-variant'
                    }`}
            >
                {relationship}
            </p>

            {/* Last seen */}
            {lastSeen && (
                <div className="flex items-center gap-1 text-on-surface-variant font-body-md text-body-md">
                    <Icon name="history" size={18} className="flex-shrink-0" />
                    <span>{lastSeen}</span>
                </div>
            )}
        </div>
    );
}
