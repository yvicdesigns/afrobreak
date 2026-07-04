-- ================================================================
-- AFROBREAK — Full Database Schema
-- Run this in Supabase → SQL Editor → New Query → Run All
-- ================================================================

-- PROFILES (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  avatar text,
  is_admin boolean default false,
  is_premium boolean default false,
  subscription_end text,
  favorites text[] default '{}',
  watch_later text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- VIDEOS
create table if not exists videos (
  id text primary key,
  title text not null,
  description text,
  instructor text,
  thumbnail text,
  duration text,
  category text,
  level text,
  is_premium boolean default false,
  price numeric,
  views integer default 0,
  likes integer default 0,
  video_url text,
  tags text[] default '{}',
  created_at text
);

-- EVENTS
create table if not exists events (
  id text primary key,
  title text not null,
  description text,
  date text,
  time text,
  location text,
  city text,
  type text,
  price numeric default 0,
  image text,
  instructor text,
  capacity integer,
  registered integer default 0,
  tags text[] default '{}',
  youtube_url text
);

-- BLOG POSTS
create table if not exists blog_posts (
  id text primary key,
  slug text unique,
  title text not null,
  excerpt text,
  content text,
  author text,
  author_avatar text,
  image text,
  category text,
  tags text[] default '{}',
  read_time text,
  published_at text,
  featured boolean default false
);

-- INSTRUCTORS
create table if not exists instructors (
  id text primary key,
  name text not null,
  bio text,
  avatar text,
  specialties text[] default '{}',
  video_count integer default 0,
  followers integer default 0
);

-- TRACKS
create table if not exists tracks (
  id text primary key,
  title text,
  artist text,
  album text,
  duration text,
  audio_url text,
  cover_url text,
  price numeric default 0,
  is_premium boolean default false,
  created_at timestamp with time zone default now()
);

-- ALBUMS
create table if not exists albums (
  id text primary key,
  title text,
  artist text,
  cover_url text,
  year text,
  created_at timestamp with time zone default now()
);

-- PRODUCTS
create table if not exists products (
  id text primary key,
  name text,
  description text,
  price numeric,
  image text,
  category text,
  sizes text[] default '{}',
  colors text[] default '{}',
  badge text,
  in_stock boolean default true,
  created_at timestamp with time zone default now()
);

-- SETTINGS
create table if not exists settings (
  key text primary key,
  value text
);

-- TEAM MEMBERS
create table if not exists team_members (
  id text primary key,
  name text,
  role text,
  bio text,
  avatar text,
  display_order integer default 0
);

-- PRESS COVERAGE
create table if not exists press_coverage (
  id text primary key,
  outlet text,
  title text,
  date text,
  type text,
  logo text,
  url text
);

-- JOBS
create table if not exists jobs (
  id text primary key,
  title text,
  department text,
  location text,
  type text,
  description text,
  requirements text[] default '{}',
  is_active boolean default true
);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================

alter table profiles enable row level security;
alter table videos enable row level security;
alter table events enable row level security;
alter table blog_posts enable row level security;
alter table instructors enable row level security;
alter table tracks enable row level security;
alter table albums enable row level security;
alter table products enable row level security;
alter table settings enable row level security;
alter table team_members enable row level security;
alter table press_coverage enable row level security;
alter table jobs enable row level security;

-- Profiles
create policy "Users view own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins manage profiles" on profiles for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
);

-- Public read for content tables
create policy "Public read videos" on videos for select using (true);
create policy "Admins manage videos" on videos for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read events" on events for select using (true);
create policy "Admins manage events" on events for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read blog_posts" on blog_posts for select using (true);
create policy "Admins manage blog_posts" on blog_posts for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read instructors" on instructors for select using (true);
create policy "Admins manage instructors" on instructors for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read tracks" on tracks for select using (true);
create policy "Admins manage tracks" on tracks for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read albums" on albums for select using (true);
create policy "Admins manage albums" on albums for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read products" on products for select using (true);
create policy "Admins manage products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read team_members" on team_members for select using (true);
create policy "Admins manage team_members" on team_members for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read press_coverage" on press_coverage for select using (true);
create policy "Admins manage press_coverage" on press_coverage for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Public read jobs" on jobs for select using (true);
create policy "Admins manage jobs" on jobs for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

create policy "Admins manage settings" on settings for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
