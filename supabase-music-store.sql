-- TRACKS
create table if not exists public.tracks (
  id text primary key,
  title text not null,
  artist text not null,
  genre text,
  duration text,
  price numeric(10,2) default 1.99,
  cover text,
  preview_url text,
  download_url text,
  album text,
  badge text,
  in_stock boolean default true,
  created_at timestamptz default now()
);
alter table public.tracks enable row level security;
create policy "Anyone can read tracks" on public.tracks for select using (true);
create policy "Admin can manage tracks" on public.tracks for all using (auth.role() = 'authenticated');

-- ALBUMS
create table if not exists public.albums (
  id text primary key,
  title text not null,
  artist text not null,
  genre text,
  price numeric(10,2) default 9.99,
  cover text,
  track_count integer default 0,
  created_at timestamptz default now()
);
alter table public.albums enable row level security;
create policy "Anyone can read albums" on public.albums for select using (true);
create policy "Admin can manage albums" on public.albums for all using (auth.role() = 'authenticated');

-- PRODUCTS
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image text,
  category text,
  sizes text[] default '{}',
  colors text[] default '{}',
  badge text,
  in_stock boolean default true,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "Anyone can read products" on public.products for select using (true);
create policy "Admin can manage products" on public.products for all using (auth.role() = 'authenticated');
