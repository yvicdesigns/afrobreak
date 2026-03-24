-- =============================================
-- AFROBREAK DATABASE SETUP
-- Run this in Supabase SQL Editor
-- =============================================

-- PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar text,
  is_premium boolean default false,
  subscription_end timestamptz,
  favorites text[] default '{}',
  watch_later text[] default '{}',
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INSTRUCTORS
create table if not exists public.instructors (
  id text primary key,
  name text not null,
  bio text,
  avatar text,
  specialties text[] default '{}',
  video_count integer default 0,
  followers integer default 0
);
alter table public.instructors enable row level security;
create policy "Anyone can read instructors" on public.instructors for select using (true);
create policy "Admin can manage instructors" on public.instructors for all using (auth.role() = 'authenticated');

-- VIDEOS
create table if not exists public.videos (
  id text primary key,
  title text not null,
  description text,
  instructor text not null,
  thumbnail text,
  duration text,
  category text,
  level text,
  is_premium boolean default false,
  price numeric(10,2),
  views integer default 0,
  likes integer default 0,
  video_url text,
  tags text[] default '{}',
  created_at date default current_date
);
alter table public.videos enable row level security;
create policy "Anyone can read videos" on public.videos for select using (true);
create policy "Admin can manage videos" on public.videos for all using (auth.role() = 'authenticated');

-- EVENTS
create table if not exists public.events (
  id text primary key,
  title text not null,
  description text,
  date date,
  time text,
  location text,
  city text,
  type text,
  price numeric(10,2),
  image text,
  instructor text,
  capacity integer,
  registered integer default 0,
  tags text[] default '{}'
);
alter table public.events enable row level security;
create policy "Anyone can read events" on public.events for select using (true);
create policy "Admin can manage events" on public.events for all using (auth.role() = 'authenticated');

-- BLOG POSTS
create table if not exists public.blog_posts (
  id text primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  author text,
  author_avatar text,
  image text,
  category text,
  tags text[] default '{}',
  read_time text,
  published_at date,
  featured boolean default false
);
alter table public.blog_posts enable row level security;
create policy "Anyone can read blog posts" on public.blog_posts for select using (true);
create policy "Admin can manage blog posts" on public.blog_posts for all using (auth.role() = 'authenticated');

-- =============================================
-- SEED DATA
-- =============================================

insert into public.instructors (id, name, bio, avatar, specialties, video_count, followers) values
('i1','Kemi Adeyemi','Born in Lagos and based in Paris, Kemi has been teaching Afrobeats dance for over 12 years. She has choreographed for major African artists and leads workshops across Europe.','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',array['Afrobeats','Afro Fusion','Choreography'],24,18500),
('i2','Marcus "Flow" Johnson','A veteran of the hip-hop dance scene with 20 years of experience spanning New York, London, and Paris. Marcus specializes in urban styles and battle culture.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',array['Hip-Hop','Breaking','Freestyle','Locking','Popping'],31,24300),
('i3','Amara Diallo','Choreographer and performer whose work bridges traditional West African dance with contemporary forms. Her company has toured internationally and her AfroBreak classes are consistently oversubscribed.','https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',array['Contemporary','West African','Choreography','Afro Fusion'],18,14200),
('i4','Yaya Kingston','Jamaican-born, Marseille-based Dancehall ambassador who has spent two decades spreading Caribbean dance culture across Europe. Yaya brings unmatched authenticity and infectious energy.','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',array['Dancehall','Caribbean','Afro-Caribbean'],15,11800)
on conflict (id) do nothing;

insert into public.videos (id,title,description,instructor,thumbnail,duration,category,level,is_premium,price,views,likes,video_url,tags,created_at) values
('v1','Afrobeat Foundations: The Basics','Master the fundamental movements of Afrobeat dance. Learn the essential steps, body isolations, and rhythmic patterns that form the foundation of this vibrant dance style.','Kemi Adeyemi','https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80','24:30','Afro','Beginner',false,null,45820,3240,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['afrobeat','foundations','beginner','body movement'],'2024-01-15'),
('v2','Hip-Hop Cypher: Advanced Freestyling','Take your freestyle skills to the next level with these advanced cypher techniques. Explore footwork, top-rock, and improvisation strategies used by top battle dancers.','Marcus "Flow" Johnson','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80','38:15','Hip-Hop','Advanced',true,9.99,28340,2180,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['hip-hop','freestyle','cypher','battle'],'2024-02-03'),
('v3','Dancehall Vibes: Beginner Series','Dive into the energy of Dancehall with this comprehensive beginner series. Learn the most iconic moves and understand the culture behind the dance.','Yaya Kingston','https://images.unsplash.com/photo-1504680177321-2e6a879d4e8f?w=800&q=80','31:45','Dancehall','Beginner',false,null,62100,5430,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['dancehall','caribbean','beginner','vibes'],'2024-01-28'),
('v4','Afro Contemporary Fusion','Blend traditional African movements with contemporary dance vocabulary. This class bridges the gap between cultural roots and modern expression.','Amara Diallo','https://images.unsplash.com/photo-1535525153412-5a42439a210e?w=800&q=80','42:20','Contemporary','Intermediate',true,9.99,19870,1650,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['contemporary','fusion','afro','artistic'],'2024-02-14'),
('v5','Kids Afro Dance Party','A fun and energetic class designed specifically for children aged 5-12. Learn age-appropriate Afro dance moves in a playful, encouraging environment.','Mama Bella','https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80','18:00','Kids','Beginner',false,null,38920,4210,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['kids','children','fun','afro'],'2024-02-20'),
('v6','Breaking: Power Moves Masterclass','Learn the most impressive power moves in breaking. From windmills to flares, this masterclass will push your physical limits and elevate your breaking game.','B-Boy Saka','https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80','55:10','Hip-Hop','Advanced',true,14.99,33450,2980,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['breaking','bboy','power moves','advanced'],'2024-03-01'),
('v7','Afrobeats Choreography Tutorial','Follow along with this step-by-step choreography set to popular Afrobeats hits. Perfect for performers and social dancers looking to add structured routines to their repertoire.','Kemi Adeyemi','https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80','28:45','Tutorial','Intermediate',false,null,71230,6890,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['tutorial','choreography','afrobeats','performance'],'2024-03-10'),
('v8','Urban Dance: Street Styles Overview','An exploration of the diverse street dance styles that emerged from urban communities worldwide. Covering locking, popping, waacking, and more.','Marcus "Flow" Johnson','https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80','45:30','Hip-Hop','Intermediate',true,9.99,24560,2100,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['urban','street','locking','popping','waacking'],'2024-03-15'),
('v9','Afro Fusion: Music Video Style','Learn high-energy routines inspired by African music videos. Combine Afrobeats, Amapiano, and Afropop movement styles into slick performance-ready choreography.','Amara Diallo','https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80','33:20','Afro','Intermediate',true,9.99,41780,3560,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['afro fusion','music video','amapiano','performance'],'2024-03-22'),
('v10','Dancehall Intermediate: Pon Di Floor','Step up your Dancehall game with intermediate-level techniques. Learn floor work, partnering concepts, and advanced arm patterns from Jamaica''s finest dance tradition.','Yaya Kingston','https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=800&q=80','36:50','Dancehall','Intermediate',false,null,29340,2540,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['dancehall','intermediate','floor work','caribbean'],'2024-04-01'),
('v11','Contemporary African Dance: Spirit & Form','Explore the spiritual and physical dimensions of contemporary African dance. This class dives deep into the philosophy of movement as cultural expression.','Amara Diallo','https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80','49:15','Contemporary','Advanced',true,12.99,15670,1420,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['contemporary','african','spiritual','advanced'],'2024-04-08'),
('v12','Hip-Hop Foundations: Locking & Popping','Master the classic funk styles of locking and popping. Understand the origins of these styles and build a solid technical foundation that will serve all your street dance pursuits.','B-Boy Saka','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80','29:40','Tutorial','Beginner',false,null,58340,5120,'https://www.youtube.com/embed/dQw4w9WgXcQ',array['hip-hop','locking','popping','foundations','beginner'],'2024-04-15')
on conflict (id) do nothing;

insert into public.events (id,title,description,date,time,location,city,type,price,image,instructor,capacity,registered,tags) values
('e1','Afrobeats Intensive Weekend','A two-day deep dive into Afrobeats dance with instructors from Nigeria, Ghana, and Senegal.','2026-04-12','10:00','Studio Groove, 45 Rue de la Danse','Paris','Workshop',120,'https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80','Kemi Adeyemi',40,32,array['afrobeats','intensive','weekend','paris']),
('e2','Hip-Hop Battle: AfroBreak Edition','The biggest urban dance battle of the season. Open to all styles with special categories for Afro-fusion.','2026-04-26','19:00','La Grande Halle','Lyon','Battle',25,'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80','Marcus "Flow" Johnson',500,287,array['battle','hip-hop','competition','lyon']),
('e3','Dancehall Weekly Class','Every Tuesday evening, join Yaya Kingston for a high-energy Dancehall session. Suitable for all levels.','2026-04-07','19:30','AfroGroove Studio','Marseille','Class',18,'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80','Yaya Kingston',25,18,array['dancehall','weekly','all levels','marseille']),
('e4','Afro Contemporary Showcase','An evening of breathtaking performances blending African traditions with contemporary dance forms.','2026-05-03','20:00','Théâtre de la Ville','Paris','Show',45,'https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80','Amara Diallo',300,241,array['show','contemporary','afro','performance']),
('e5','Kids Summer Dance Camp','Five days of dancing, games, and cultural discovery for children aged 6-14.','2026-07-14','09:00','Centre Culturel Arc-en-Ciel','Bordeaux','Workshop',199,'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80','Mama Bella',30,22,array['kids','summer','camp','bordeaux']),
('e6','Breaking & B-Boy Masterclass','An intensive masterclass with world-renowned B-Boy Saka.','2026-05-17','14:00','Urban Dance Academy','Toulouse','Workshop',65,'https://images.unsplash.com/photo-1504680177321-2e6a879d4e8f?w=800&q=80','B-Boy Saka',20,20,array['breaking','bboy','masterclass','toulouse'])
on conflict (id) do nothing;

insert into public.blog_posts (id,slug,title,excerpt,content,author,author_avatar,image,category,tags,read_time,published_at,featured) values
('b1','history-of-afrobeats-dance','The Rich History of Afrobeats Dance: From Lagos to Paris','How a music and dance revolution that started in the streets of Lagos transformed global culture and found a passionate home in the heart of Europe.','Afrobeats dance is not simply choreography—it is a living language. Born from the vibrant streets of Lagos, Accra, and Dakar, it carries the stories, struggles, and celebrations of an entire continent.','Kemi Adeyemi','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80','https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80','Culture',array['afrobeats','history','lagos','culture','diaspora'],'8 min read','2024-03-10',true),
('b2','5-tips-beginners-afro-dance','5 Essential Tips for Absolute Beginners in Afro Dance','Starting your Afro dance journey can feel overwhelming. These five foundational tips will help you progress faster and enjoy the process more.','Starting any new dance style requires patience, but Afro dance has a particular warmth that makes the beginner journey especially rewarding.','Mama Bella','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80','https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=1200&q=80','Dance Tips',array['beginner','tips','afro dance','learning'],'5 min read','2024-03-20',false),
('b3','interview-amara-diallo-contemporary','Interview: Amara Diallo on Bridging Traditions and Modernity','We sat down with one of France''s most celebrated Afro-contemporary choreographers to discuss her creative process, cultural responsibility, and the future of African dance.','Amara Diallo needs no introduction in the Afro-contemporary dance world.','AfroBreak Editorial','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80','https://images.unsplash.com/photo-1535525153412-5a42439a210e?w=1200&q=80','Interviews',array['interview','choreography','contemporary','amara diallo'],'10 min read','2024-04-01',false),
('b4','dancehall-culture-caribbean-roots','Dancehall: Understanding Its Caribbean Roots and Global Reach','Dancehall is far more than a dance style—it''s a complete cultural system with its own fashion, language, spirituality, and political consciousness.','To understand Dancehall dance, you have to understand Dancehall culture.','Yaya Kingston','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80','https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80','Culture',array['dancehall','caribbean','jamaica','culture','history'],'7 min read','2024-04-10',false),
('b5','creating-dance-routine-amapiano','How to Create Your First Amapiano Dance Routine','Amapiano is taking over dance floors globally. Here''s a step-by-step guide to building your own routine to this infectious South African sound.','Amapiano arrived like a warm thunderstorm—unexpected, irresistible, and absolutely transformative.','Kemi Adeyemi','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80','https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=1200&q=80','Dance Tips',array['amapiano','routine','south africa','tutorial','beginner'],'6 min read','2024-04-20',false),
('b6','dance-for-wellness-mental-health','Dancing for Wellness: How Afro Dance Transformed My Mental Health','A personal account of how committing to Afro dance three times a week became the most powerful mental health intervention imaginable.','I''m not a professional dancer. I''m a 32-year-old project manager who found AfroBreak at the lowest point of my life.','Sofia Mendes','https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80','Lifestyle',array['wellness','mental health','lifestyle','personal story'],'9 min read','2024-05-01',false)
on conflict (id) do nothing;
