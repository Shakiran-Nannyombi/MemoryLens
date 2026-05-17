import { PersonMemory } from '../types';
import { Icon } from './ui/Icon';

interface FaceRecognitionCardProps {
    person: PersonMemory;
    lastConversation: string;
    onCall: () => void;
    onPhotos: () => void;
    visible?: boolean;
}

export function FaceRecognitionCard({
    person,
    lastConversation,
    onCall,
    onPhotos,
    visible = false,
}: FaceRecognitionCardProps) {
    return (
        <div
            className={`
        bg-surface/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl
        transition-all duration-300
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
            role="region"
            aria-label={`Recognized person: ${person.name}`}
        >
            {/* Avatar + Name / Relationship */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative shrink-0">
                    {person.image_url ? (
                        <img
                            src={person.image_url}
                            alt={`Photo of ${person.name}`}
                            className="w-16 h-16 rounded-full border-2 border-primary object-cover"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-primary bg-surface-container-high flex items-center justify-center">
                            <Icon name="person" size={32} className="text-on-surface-variant" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="font-headline-md text-headline-md text-on-surface leading-tight">
                        {person.name}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant italic">
                        {person.relationship}
                    </span>
                </div>
            </div>

            {/* Last Conversation */}
            <div className="bg-surface-container rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Icon name="history" size={16} className="text-on-surface-variant" />
                    <span className="font-label-lg text-label-lg text-on-surface-variant text-sm">
                        Last conversation
                    </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">
                    {lastConversation}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-[var(--spacing-stack-gap,24px)]">
                {/* Call button — primary filled */}
                <button
                    onClick={onCall}
                    className="
            flex-1 flex items-center justify-center gap-2
            bg-primary text-on-primary rounded-xl h-[48px]
            font-label-lg text-label-lg
            active:scale-95 duration-150 transition-all
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
          "
                    aria-label={`Call ${person.name}`}
                >
                    <Icon name="call" size={20} filled />
                    <span>Call {person.name}</span>
                </button>

                {/* See Photos button — outline */}
                <button
                    onClick={onPhotos}
                    className="
            flex-1 flex items-center justify-center gap-2
            border-2 border-primary text-primary rounded-xl h-[48px]
            font-label-lg text-label-lg bg-transparent
            active:scale-95 duration-150 transition-all
            hover:bg-primary/5
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
          "
                    aria-label={`See photos of ${person.name}`}
                >
                    <Icon name="photo_library" size={20} />
                    <span>See Photos</span>
                </button>
            </div>
        </div>
    );
}
