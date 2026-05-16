-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: people
create table public.people (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  relationship text,
  note text,
  image_url text,
  face_descriptor float8[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: objects
create table public.objects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  coco_class text not null,
  custom_label text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: places
create table public.places (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  radius_meters int default 100 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: speech_events
create table public.speech_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  transcript text not null,
  extracted_names text[],
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security)
alter table public.people enable row level security;
alter table public.objects enable row level security;
alter table public.places enable row level security;
alter table public.speech_events enable row level security;

-- Policies (Users can only see/edit their own records)
create policy "Users can manage their own people" 
  on public.people for all using (auth.uid() = user_id);

create policy "Users can manage their own objects" 
  on public.objects for all using (auth.uid() = user_id);

create policy "Users can manage their own places" 
  on public.places for all using (auth.uid() = user_id);

create policy "Users can manage their own events" 
  on public.speech_events for all using (auth.uid() = user_id);
