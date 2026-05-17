import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/TopAppBar';
import { StorageToggle } from '../components/StorageToggle';
import { PersonCard } from '../components/PersonCard';
import BottomNav from '../components/BottomNav';
import { Icon } from '../components/ui/Icon';
import { supabase } from '../lib/supabase';

type ActiveSection = 'people' | 'objects' | 'places' | 'events' | 'privacy';

const SIDEBAR_ITEMS: {
  id: ActiveSection;
  icon: string;
  label: string;
}[] = [
    { id: 'people', icon: 'group', label: 'People' },
    { id: 'objects', icon: 'category', label: 'Objects' },
    { id: 'places', icon: 'location_on', label: 'Places' },
    { id: 'events', icon: 'event', label: 'Events' },
  ];

export default function CaregiverDashboard() {
  const user = useStore((state) => state.user);
  const people = useStore((state) => state.people);
  const objects = useStore((state) => state.objects);
  const places = useStore((state) => state.places);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<ActiveSection>('people');

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Top App Bar */}
      <TopAppBar />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-container-margin py-stack-gap pb-32">
        {/* Storage Toggle — full width at top */}
        <StorageToggle className="mb-stack-gap" />

        {/* Two-column layout: sidebar (desktop) + content */}
        <div className="flex flex-col lg:flex-row gap-stack-gap">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col gap-2 w-80 sticky top-24 h-fit">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={[
                    'flex items-center gap-4 p-4 rounded-lg text-left transition-colors duration-150 active:scale-95',
                    isActive
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-low',
                  ].join(' ')}
                >
                  <Icon name={item.icon} size={24} />
                  <span className="font-body-lg text-body-lg">{item.label}</span>
                </button>
              );
            })}

            {/* Privacy item separated by border */}
            <button
              type="button"
              onClick={() => setActiveSection('privacy')}
              className={[
                'flex items-center gap-4 p-4 rounded-lg text-left transition-colors duration-150 active:scale-95',
                'border-t border-outline-variant pt-unit mt-1',
                activeSection === 'privacy'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-low',
              ].join(' ')}
            >
              <Icon name="lock" size={24} filled />
              <span className="font-body-lg text-body-lg">Privacy</span>
            </button>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 rounded-lg text-left text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150 active:scale-95 mt-2"
            >
              <Icon name="logout" size={24} />
              <span className="font-body-lg text-body-lg">Sign Out</span>
            </button>
          </aside>

          {/* Main dashboard content */}
          <div className="flex-1 flex flex-col gap-stack-gap">
            {/* People Section */}
            <PeopleSection people={people} />

            {/* Objects + Places grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-gap">
              <ObjectsSection objects={objects} />
              <PlacesSection places={places} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <button
        type="button"
        aria-label="Add new item"
        className="fixed bottom-24 right-container-margin bg-primary text-on-primary rounded-full w-14 h-14 flex items-center justify-center shadow-xl md:hidden active:scale-95 duration-150 z-50"
      >
        <Icon name="add" size={28} />
      </button>

      {/* Bottom Nav — hidden on desktop */}
      <div className="md:hidden">
        <BottomNav currentPath="/dashboard" />
      </div>
    </div>
  );
}

/* ─── People Section ─────────────────────────────────────────────────────── */

function PeopleSection({ people }: { people: ReturnType<typeof useStore>['people'] }) {
  return (
    <section>
      {/* Section heading */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
            Trusted People
          </h2>
          <Icon
            name="security"
            size={24}
            filled
            className="text-secondary animate-pulse"
          />
        </div>
        {/* Count badge */}
        <span className="font-label-lg text-label-lg text-on-surface-variant bg-surface-container rounded-full px-4 py-1">
          {people.length} Known
        </span>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {people.map((person, idx) => (
          <PersonCard
            key={person.id}
            name={person.name}
            relationship={person.relationship}
            imageUrl={person.image_url}
            isPrimary={idx === 0}
            isEncrypted={idx === 0}
            size="lg"
          />
        ))}

        {/* Add New Trusted Person card */}
        <button
          type="button"
          aria-label="Add new trusted person"
          className="border-2 border-dashed border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-4 text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer min-h-[220px] active:scale-95 duration-150"
        >
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
            <Icon name="person_add" size={32} />
          </div>
          <span className="font-label-lg text-label-lg">Add New Trusted Person</span>
        </button>
      </div>
    </section>
  );
}

/* ─── Objects Section ────────────────────────────────────────────────────── */

function ObjectsSection({ objects }: { objects: ReturnType<typeof useStore>['objects'] }) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-secondary/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface">Known Objects</h3>
        <button
          type="button"
          className="text-secondary font-label-lg text-label-lg flex items-center gap-1 hover:opacity-80 transition-opacity active:scale-95 duration-150"
          aria-label="View all objects"
        >
          View all <Icon name="arrow_forward" size={18} />
        </button>
      </div>

      {objects.length === 0 ? (
        <p className="text-on-surface-variant font-body-md text-body-md text-center py-8">
          No objects registered yet.
        </p>
      ) : (
        <div className="space-y-4">
          {objects.slice(0, 4).map((obj) => (
            <div
              key={obj.id}
              className="flex items-center gap-4 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            >
              {/* Thumbnail placeholder */}
              <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Icon name="category" size={28} className="text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-label-lg text-label-lg text-on-surface truncate">
                  {obj.custom_label || obj.coco_class}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant truncate">
                  {obj.coco_class}
                </p>
              </div>
              <Icon name="chevron_right" size={24} className="text-outline-variant flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ─── Places Section ─────────────────────────────────────────────────────── */

function PlacesSection({ places }: { places: ReturnType<typeof useStore>['places'] }) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-secondary/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface">Safe Places</h3>
        <button
          type="button"
          className="text-secondary font-label-lg text-label-lg flex items-center gap-1 hover:opacity-80 transition-opacity active:scale-95 duration-150"
          aria-label="View all places"
        >
          View all <Icon name="arrow_forward" size={18} />
        </button>
      </div>

      {places.length === 0 ? (
        <p className="text-on-surface-variant font-body-md text-body-md text-center py-8">
          No safe places registered yet.
        </p>
      ) : (
        <div className="space-y-4">
          {places.slice(0, 3).map((place, idx) => {
            const isActive = idx === 0; // first place treated as current location
            return (
              <div
                key={place.id}
                className={[
                  'relative rounded-lg overflow-hidden h-32 cursor-pointer',
                  !isActive ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all' : '',
                ].join(' ')}
              >
                {/* Placeholder background for place image */}
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                  <Icon name="location_on" size={40} className="text-on-surface-variant" />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <p className="font-label-lg text-label-lg text-white">{place.name}</p>
                  {isActive && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-400" aria-hidden="true" />
                      <p className="text-xs text-white/90">Patient is currently here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
