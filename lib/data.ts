import type { Video, Event, BlogPost, Instructor } from '@/lib/types'

export const videos: Video[] = [
  {
    id: 'v1',
    title: 'Afrobeat Foundations: The Basics',
    description: 'Master the fundamental movements of Afrobeat dance. Learn the essential steps, body isolations, and rhythmic patterns that form the foundation of this vibrant dance style.',
    instructor: 'Kemi Adeyemi',
    thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
    duration: '24:30',
    category: 'Afro',
    level: 'Beginner',
    isPremium: false,
    views: 45820,
    likes: 3240,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['afrobeat', 'foundations', 'beginner', 'body movement'],
    createdAt: '2024-01-15',
  },
  {
    id: 'v2',
    title: 'Hip-Hop Cypher: Advanced Freestyling',
    description: 'Take your freestyle skills to the next level with these advanced cypher techniques. Explore footwork, top-rock, and improvisation strategies used by top battle dancers.',
    instructor: 'Marcus "Flow" Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    duration: '38:15',
    category: 'Hip-Hop',
    level: 'Advanced',
    isPremium: true,
    price: 9.99,
    views: 28340,
    likes: 2180,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['hip-hop', 'freestyle', 'cypher', 'battle'],
    createdAt: '2024-02-03',
  },
  {
    id: 'v3',
    title: 'Dancehall Vibes: Beginner Series',
    description: 'Dive into the energy of Dancehall with this comprehensive beginner series. Learn the most iconic moves and understand the culture behind the dance.',
    instructor: 'Yaya Kingston',
    thumbnail: 'https://images.unsplash.com/photo-1504680177321-2e6a879d4e8f?w=800&q=80',
    duration: '31:45',
    category: 'Dancehall',
    level: 'Beginner',
    isPremium: false,
    views: 62100,
    likes: 5430,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['dancehall', 'caribbean', 'beginner', 'vibes'],
    createdAt: '2024-01-28',
  },
  {
    id: 'v4',
    title: 'Afro Contemporary Fusion',
    description: 'Blend traditional African movements with contemporary dance vocabulary. This class bridges the gap between cultural roots and modern expression.',
    instructor: 'Amara Diallo',
    thumbnail: 'https://images.unsplash.com/photo-1535525153412-5a42439a210e?w=800&q=80',
    duration: '42:20',
    category: 'Contemporary',
    level: 'Intermediate',
    isPremium: true,
    price: 9.99,
    views: 19870,
    likes: 1650,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['contemporary', 'fusion', 'afro', 'artistic'],
    createdAt: '2024-02-14',
  },
  {
    id: 'v5',
    title: 'Kids Afro Dance Party',
    description: 'A fun and energetic class designed specifically for children aged 5-12. Learn age-appropriate Afro dance moves in a playful, encouraging environment.',
    instructor: 'Mama Bella',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    duration: '18:00',
    category: 'Kids',
    level: 'Beginner',
    isPremium: false,
    views: 38920,
    likes: 4210,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['kids', 'children', 'fun', 'afro'],
    createdAt: '2024-02-20',
  },
  {
    id: 'v6',
    title: 'Breaking: Power Moves Masterclass',
    description: 'Learn the most impressive power moves in breaking. From windmills to flares, this masterclass will push your physical limits and elevate your breaking game.',
    instructor: 'B-Boy Saka',
    thumbnail: 'https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80',
    duration: '55:10',
    category: 'Hip-Hop',
    level: 'Advanced',
    isPremium: true,
    price: 14.99,
    views: 33450,
    likes: 2980,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['breaking', 'bboy', 'power moves', 'advanced'],
    createdAt: '2024-03-01',
  },
  {
    id: 'v7',
    title: 'Afrobeats Choreography Tutorial',
    description: 'Follow along with this step-by-step choreography set to popular Afrobeats hits. Perfect for performers and social dancers looking to add structured routines to their repertoire.',
    instructor: 'Kemi Adeyemi',
    thumbnail: 'https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80',
    duration: '28:45',
    category: 'Tutorial',
    level: 'Intermediate',
    isPremium: false,
    views: 71230,
    likes: 6890,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['tutorial', 'choreography', 'afrobeats', 'performance'],
    createdAt: '2024-03-10',
  },
  {
    id: 'v8',
    title: 'Urban Dance: Street Styles Overview',
    description: 'An exploration of the diverse street dance styles that emerged from urban communities worldwide. Covering locking, popping, waacking, and more.',
    instructor: 'Marcus "Flow" Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80',
    duration: '45:30',
    category: 'Hip-Hop',
    level: 'Intermediate',
    isPremium: true,
    price: 9.99,
    views: 24560,
    likes: 2100,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['urban', 'street', 'locking', 'popping', 'waacking'],
    createdAt: '2024-03-15',
  },
  {
    id: 'v9',
    title: 'Afro Fusion: Music Video Style',
    description: 'Learn high-energy routines inspired by African music videos. Combine Afrobeats, Amapiano, and Afropop movement styles into slick performance-ready choreography.',
    instructor: 'Amara Diallo',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    duration: '33:20',
    category: 'Afro',
    level: 'Intermediate',
    isPremium: true,
    price: 9.99,
    views: 41780,
    likes: 3560,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['afro fusion', 'music video', 'amapiano', 'performance'],
    createdAt: '2024-03-22',
  },
  {
    id: 'v10',
    title: 'Dancehall Intermediate: Pon Di Floor',
    description: 'Step up your Dancehall game with intermediate-level techniques. Learn floor work, partnering concepts, and advanced arm patterns from Jamaica\'s finest dance tradition.',
    instructor: 'Yaya Kingston',
    thumbnail: 'https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=800&q=80',
    duration: '36:50',
    category: 'Dancehall',
    level: 'Intermediate',
    isPremium: false,
    views: 29340,
    likes: 2540,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['dancehall', 'intermediate', 'floor work', 'caribbean'],
    createdAt: '2024-04-01',
  },
  {
    id: 'v11',
    title: 'Contemporary African Dance: Spirit & Form',
    description: 'Explore the spiritual and physical dimensions of contemporary African dance. This class dives deep into the philosophy of movement as cultural expression.',
    instructor: 'Amara Diallo',
    thumbnail: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
    duration: '49:15',
    category: 'Contemporary',
    level: 'Advanced',
    isPremium: true,
    price: 12.99,
    views: 15670,
    likes: 1420,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['contemporary', 'african', 'spiritual', 'advanced'],
    createdAt: '2024-04-08',
  },
  {
    id: 'v12',
    title: 'Hip-Hop Foundations: Locking & Popping',
    description: 'Master the classic funk styles of locking and popping. Understand the origins of these styles and build a solid technical foundation that will serve all your street dance pursuits.',
    instructor: 'B-Boy Saka',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    duration: '29:40',
    category: 'Tutorial',
    level: 'Beginner',
    isPremium: false,
    views: 58340,
    likes: 5120,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['hip-hop', 'locking', 'popping', 'foundations', 'beginner'],
    createdAt: '2024-04-15',
  },
]

export const events: Event[] = [
  // ── UPCOMING ─────────────────────────────────────────────────────────────────
  {
    id: 'e_kotc',
    title: 'King of the Cypher',
    description: 'The legendary King of the Cypher battle returns to Lagos, Nigeria. Top breakers from across West Africa and the diaspora compete for the crown in one of the most prestigious battles on the continent.',
    date: '2026-04-11',
    time: '18:00',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    type: 'Battle',
    price: 0,
    image: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80',
    instructor: 'ABA',
    capacity: 300,
    registered: 0,
    tags: ['breaking', 'battle', 'nigeria', 'cypher'],
  },
  {
    id: 'e_floormot',
    title: 'Floor Motion',
    description: 'An immersive workshop series in Gulu, Uganda, bringing breaking, hiphop, and African dance education to youth in East Africa. Hands-on sessions with ABA Global Ambassadors.',
    date: '2026-05-15',
    time: '10:00',
    location: 'Gulu, Uganda',
    city: 'Gulu',
    type: 'Workshop',
    price: 0,
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
    instructor: 'ABA',
    capacity: 80,
    registered: 0,
    tags: ['workshop', 'uganda', 'east africa', 'hiphop'],
  },
  {
    id: 'e_eaqualif',
    title: 'AfroBreak East Africa Qualifier',
    description: 'The official AfroBreak qualifier for East Africa. Breakers from Uganda, Kenya, Tanzania, Rwanda, and beyond compete for a spot at the AfroBreak Africa Final in Accra.',
    date: '2026-08-22',
    time: '14:00',
    location: 'Kampala, Uganda',
    city: 'Kampala',
    type: 'Battle',
    price: 20,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    instructor: 'ABA',
    capacity: 200,
    registered: 0,
    tags: ['battle', 'qualifier', 'east africa', 'kampala'],
  },
  {
    id: 'e_roots2026',
    title: 'Africa Roots in Motion',
    description: 'A celebration of African dance culture — from breaking to Afrobeats, Amapiano to Kizomba. Live performances, workshops, and cultural exchanges across three days in Accra.',
    date: '2026-10-10',
    time: '17:00',
    location: 'National Theatre, Accra',
    city: 'Accra',
    type: 'Show',
    price: 50,
    image: 'https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80',
    instructor: 'ABA',
    capacity: 500,
    registered: 0,
    tags: ['show', 'accra', 'africa', 'cultural'],
  },
  {
    id: 'e_final2026',
    title: 'AfroBreak Africa Final 2026',
    description: 'The biggest breaking event on the African continent returns to Accra. The AfroBreak Africa Final crowns the continent\'s best breakers in front of a capacity crowd.',
    date: '2026-11-28',
    time: '18:00',
    location: 'Accra Sports Complex',
    city: 'Accra',
    type: 'Show',
    price: 80,
    image: 'https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80',
    instructor: 'Bboy Lyricx',
    capacity: 1000,
    registered: 0,
    tags: ['africa final', 'breaking', 'championship', 'accra'],
  },
  // ── PAST AFRICA FINALS ────────────────────────────────────────────────────────
  {
    id: 'e_final2025',
    title: 'AfroBreak Africa Final 2025',
    description: '5th edition — Zinji (Algeria) and Kris (Nigeria) were crowned AfroBreak African Champions in a historic night at the Accra Sports Complex. 20+ nations represented.',
    date: '2025-10-25',
    time: '18:00',
    location: 'Accra Sports Complex',
    city: 'Accra',
    type: 'Show',
    price: 0,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
    instructor: 'Bboy Lyricx',
    capacity: 800,
    registered: 800,
    tags: ['africa final', '2025', 'champions', 'accra'],
    youtubeUrl: 'https://youtube.com/live/95xXH9iaSnE?feature=share',
  },
  {
    id: 'e_final2024',
    title: 'AfroBreak Africa Final 2024',
    description: '4th edition — Smith (Benin) and Courtnea Paul (South Africa) were crowned AfroBreak African Champions. Bboy Lyricx inducted into Paris 2024 Olympics Hall of Fame.',
    date: '2024-11-16',
    time: '18:00',
    location: 'Accra Sports Complex',
    city: 'Accra',
    type: 'Show',
    price: 0,
    image: 'https://images.unsplash.com/photo-1504680177321-2e6a879d4e8f?w=800&q=80',
    instructor: 'Bboy Lyricx',
    capacity: 600,
    registered: 600,
    tags: ['africa final', '2024', 'champions', 'accra'],
    youtubeUrl: 'https://youtube.com/live/snT-2V8Uf3s?feature=share',
  },
  {
    id: 'e_final2023',
    title: 'AfroBreak Africa Final 2023',
    description: '3rd edition — Lil Vic (Nigeria) and Sandrine (Benin) claimed the AfroBreak African Champion titles. Tris Naomi dominated at national and international level.',
    date: '2023-11-18',
    time: '18:00',
    location: 'Accra Sports Complex',
    city: 'Accra',
    type: 'Show',
    price: 0,
    image: 'https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=800&q=80',
    instructor: 'Bboy Lyricx',
    capacity: 500,
    registered: 500,
    tags: ['africa final', '2023', 'champions', 'accra'],
  },
  {
    id: 'e_final2022',
    title: 'AfroBreak Africa Final 2022',
    description: '2nd edition — Pape (Senegal) was crowned AfroBreak African Champion in Accra. The event solidified AfroBreak as the continent\'s premier breaking platform.',
    date: '2022-10-22',
    time: '18:00',
    location: 'Accra Cultural Centre',
    city: 'Accra',
    type: 'Show',
    price: 0,
    image: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80',
    instructor: 'Bboy Lyricx',
    capacity: 300,
    registered: 300,
    tags: ['africa final', '2022', 'champions', 'accra'],
  },
  // ── PROJECTS / WORKSHOPS ─────────────────────────────────────────────────────
  {
    id: 'e_tamale2025',
    title: 'Break It All — Tamale',
    description: 'ABA in partnership with KGL Foundation brought breaking and hiphop education to youth in Tamale, Northern Ghana. Free workshops empowering girls through break dance and hiphop culture.',
    date: '2025-02-15',
    time: '10:00',
    location: 'Tamale, Northern Ghana',
    city: 'Tamale',
    type: 'Workshop',
    price: 0,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    instructor: 'Bboy Lyricx',
    capacity: 100,
    registered: 100,
    tags: ['workshop', 'tamale', 'northern ghana', 'kgl foundation', 'girls empowerment'],
  },
  {
    id: 'e_ada2025',
    title: 'Break It All — Ada School',
    description: 'ABA brought breaking workshops to Ada school, empowering young students through hiphop culture, breaking technique, and the values of creativity and discipline.',
    date: '2025-07-20',
    time: '09:00',
    location: 'Ada, Ghana',
    city: 'Ada',
    type: 'Workshop',
    price: 0,
    image: 'https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80',
    instructor: 'ABA',
    capacity: 60,
    registered: 60,
    tags: ['workshop', 'ada', 'school', 'youth', 'education'],
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: 'history-of-afrobeats-dance',
    title: 'The Rich History of Afrobeats Dance: From Lagos to Accra',
    excerpt: 'How a music and dance revolution that started in the streets of Lagos transformed global culture and found a passionate home across West Africa — with Accra at its heart.',
    content: `Afrobeats dance is not simply choreography—it is a living language. Born from the vibrant streets of Lagos, Accra, and Dakar, it carries the stories, struggles, and celebrations of an entire continent.

The origins trace back decades, weaving through highlife, jùjú music, and the township sounds of South Africa. But the contemporary Afrobeats wave, which exploded globally in the 2010s, brought with it a new vocabulary of movement: the Shaku Shaku, the Zanku, the Leg Work.

What makes Afrobeats dance so compelling is its democratic nature. Unlike many dance forms gatekept by expensive studios and rigid technique requirements, Afrobeats invites everyone. The dance floor is the classroom. The community is the teacher.

In Accra, this democracy of movement has always had deep roots. Ghana's vibrant cultural scene — from the Highlife halls of Jamestown to the open-air dance arenas of Osu — has long been a proving ground for West African movement. As Afrobeats broke into mainstream global consciousness, Accra was not just ready — it was already leading. Studios in Osu, Labone, and East Legon became hubs where local talent refined and shaped the continental sound.

Today, Afrobeats dance is taught at major institutions, featured in global advertising campaigns, and performed at events from São Paulo to Seoul. But its heart remains in the community—in the informal sessions, the late-night studio jams, the WhatsApp groups coordinating the next cypher.

This is the world AfroBreak was built to celebrate and expand.`,
    author: 'Kemi Adeyemi',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=80',
    category: 'Culture',
    tags: ['afrobeats', 'history', 'lagos', 'culture', 'diaspora'],
    readTime: '8 min read',
    publishedAt: '2024-03-10',
    featured: true,
  },
  {
    id: 'b2',
    slug: '5-tips-beginners-afro-dance',
    title: '5 Essential Tips for Absolute Beginners in Afro Dance',
    excerpt: 'Starting your Afro dance journey can feel overwhelming. These five foundational tips will help you progress faster and enjoy the process more.',
    content: `Starting any new dance style requires patience, but Afro dance has a particular warmth that makes the beginner journey especially rewarding. Here are five tips from our top instructors to set you up for success.

**1. Listen Before You Move**
Before trying to replicate any movement, spend time simply listening to the music. Afrobeats has a complex rhythmic structure with multiple layers. Let your body absorb the rhythm before your brain tries to control it.

**2. Focus on Your Core**
Almost all Afro dance styles originate from the core—the torso, hips, and lower back. Don't isolate your limbs first. Learn to initiate movement from your center, and everything else will follow more naturally.

**3. Embrace Imperfection**
The cultural context of Afro dance values authenticity over perfection. Your "mistakes" often become your signature moves. Give yourself permission to look awkward while you're learning.

**4. Watch African Music Videos**
The best free resource for learning Afro dance? African music videos. Artists like Burna Boy, Davido, and Wizkid feature incredible dancers whose style evolves with each release. Study them obsessively.

**5. Find Your Community**
Dancing alone will only take you so far. Find a class, join an online group, attend local events. The social dimension of Afro dance is inseparable from the physical one.`,
    author: 'Mama Bella',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    image: 'https://images.unsplash.com/photo-1526483291330-fe44429f3e0d?w=1200&q=80',
    category: 'Dance Tips',
    tags: ['beginner', 'tips', 'afro dance', 'learning'],
    readTime: '5 min read',
    publishedAt: '2024-03-20',
    featured: false,
  },
  {
    id: 'b3',
    slug: 'interview-amara-diallo-contemporary',
    title: 'Interview: Amara Diallo on Bridging Traditions and Modernity',
    excerpt: 'We sat down with one of Ghana\'s most celebrated Afro-contemporary choreographers to discuss her creative process, cultural responsibility, and the future of African dance.',
    content: `Amara Diallo needs no introduction in the Afro-contemporary dance world. Her work has graced stages from Accra to Johannesburg, and her classes at AfroBreak regularly sell out within hours of opening.

We caught up with her at her Accra studio between rehearsals for her upcoming piece, "Mémoire des Corps."

**AfroBreak: Your work sits at the intersection of traditional African movement and contemporary dance. How do you navigate that space?**

Amara: I think the premise of "intersection" is itself a Western lens. From inside the work, it doesn't feel like two things meeting. African movement philosophies are already contemporary. They've always been experimental, always been evolving. What I try to do is make that evolution visible.

**AB: Do you feel pressure to represent African culture authentically?**

Amara: Of course. And I also push back against the idea that authenticity means static. My grandmother's dances were radical for her time. I'm trying to be radical for mine.

**AB: What advice do you have for young African dancers in Europe trying to find their voice?**

Amara: Learn everything you can—ballet, contemporary, hip-hop, breaking. But never let those vocabularies colonize your body. Keep coming back to your roots. The most interesting work happens when you're fluent in multiple languages and choose which one to speak, and when to mix them.`,
    author: 'AfroBreak Editorial',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210e?w=1200&q=80',
    category: 'Interviews',
    tags: ['interview', 'choreography', 'contemporary', 'amara diallo'],
    readTime: '10 min read',
    publishedAt: '2024-04-01',
    featured: false,
  },
  {
    id: 'b4',
    slug: 'dancehall-culture-caribbean-roots',
    title: 'Dancehall: Understanding Its Caribbean Roots and Global Reach',
    excerpt: 'Dancehall is far more than a dance style—it\'s a complete cultural system with its own fashion, language, spirituality, and political consciousness.',
    content: `To understand Dancehall dance, you have to understand Dancehall culture. And to understand Dancehall culture, you have to understand Jamaica in the 1970s and 80s—the sound systems, the yards, the political tumult, and the extraordinary creative energy that emerged from those conditions.

The dance itself is inseparable from the music. Riddims dictate rhythms. The culture is explicitly social—Dancehall is not a solo pursuit but a communal practice. This is why it's impossible to truly learn Dancehall from videos alone. You need the dance floor.

The global spread of Dancehall has been both exciting and complicated. Its influence on UK grime and garage, on American trap, on Afrobeats and Amapiano, is undeniable. But with influence comes appropriation, and the Dancehall community has been vocal about wanting credit and compensation for its cultural gifts.

As we teach and celebrate Dancehall at AfroBreak, we do so with an explicit commitment to cultural acknowledgment. Our instructors bring not just the movements but the stories, the political context, and the living culture that gives those movements meaning.

This is what makes Yaya Kingston's classes special. She doesn't just teach steps—she teaches Dancehall as a worldview.`,
    author: 'Yaya Kingston',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&q=80',
    category: 'Culture',
    tags: ['dancehall', 'caribbean', 'jamaica', 'culture', 'history'],
    readTime: '7 min read',
    publishedAt: '2024-04-10',
    featured: false,
  },
  {
    id: 'b5',
    slug: 'creating-dance-routine-amapiano',
    title: 'How to Create Your First Amapiano Dance Routine',
    excerpt: 'Amapiano is taking over dance floors globally. Here\'s a step-by-step guide to building your own routine to this infectious South African sound.',
    content: `Amapiano arrived like a warm thunderstorm—unexpected, irresistible, and absolutely transformative. The South African genre, built on log drums, jazzy chords, and an irresistible bounce, has spawned a dance style that feels simultaneously ancient and futuristic.

Creating your first Amapiano routine doesn't require advanced skills—just a good ear and a willingness to feel the music in your bones.

**Step 1: Choose Your Riddim**
Amapiano has several sub-flavors—some heavier and more angular, others smooth and flowing. Choose a track that matches your current level. Beginners: look for slower, heavier riddims. Intermediate dancers: try the faster, more percussive tracks.

**Step 2: Structure Your 8-Count**
Like all street dance, Amapiano works in 8-count phrases. Identify where the phrases begin in your chosen track. Build your routine around these natural musical sections.

**Step 3: Start with the Log Drum**
The log drum is Amapiano's signature sound. Your footwork should respond primarily to this. Develop a core footwork pattern that answers the log drum, then add upper body embellishments.

**Step 4: Add Your Signature**
The most viral Amapiano content on social media features dancers who have added personal signature moves. Spend 20% of your practice time experimenting with moves that feel uniquely yours.

**Step 5: Film Everything**
Watching yourself is uncomfortable but essential. Film your practice sessions and identify what's working and what needs refinement.`,
    author: 'Kemi Adeyemi',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    image: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=1200&q=80',
    category: 'Dance Tips',
    tags: ['amapiano', 'routine', 'south africa', 'tutorial', 'beginner'],
    readTime: '6 min read',
    publishedAt: '2024-04-20',
    featured: false,
  },
  {
    id: 'b6',
    slug: 'dance-for-wellness-mental-health',
    title: 'Dancing for Wellness: How Afro Dance Transformed My Mental Health',
    excerpt: 'A personal account of how committing to Afro dance three times a week became the most powerful mental health intervention imaginable.',
    content: `I'm not a professional dancer. I'm a 32-year-old project manager who found AfroBreak at the lowest point of my life. What happened next genuinely surprised me.

The science is unequivocal: dance is good for mental health. The combination of physical movement, rhythm, social connection, and cultural expression creates a neurological cocktail that rivals many pharmaceutical interventions for anxiety and depression.

But statistics don't capture what it actually feels like to step into a room full of people who all want to move, who all bring their own history and energy to the floor, and who all leave 90 minutes later somehow lighter.

Afro dance specifically has something extra. The styles that we practice at AfroBreak carry ancestral energy. When you learn that certain movements were originally ritual, were originally communal ceremonies, were originally acts of resistance—you carry that meaning in your body. It changes how you move and, gradually, how you exist in the world.

I started for the exercise. I stayed for the community. I kept coming back because it was the one space in my week where I was fully present—not thinking about deadlines, not scrolling my phone, not managing anyone else's expectations. Just music, movement, and breath.

If you're considering starting your dance journey, I can tell you: it will be the best decision you make this year.`,
    author: 'Sofia Mendes',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    category: 'Lifestyle',
    tags: ['wellness', 'mental health', 'lifestyle', 'personal story'],
    readTime: '9 min read',
    publishedAt: '2024-05-01',
    featured: false,
  },
]

export const instructors: Instructor[] = [
  {
    id: 'i1',
    name: 'Kemi Adeyemi',
    bio: 'Born in Lagos and based in Accra, Kemi has been teaching Afrobeats dance for over 12 years. She has choreographed for major African artists and leads workshops across West Africa.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    specialties: ['Afrobeats', 'Afro Fusion', 'Choreography'],
    videoCount: 24,
    followers: 18500,
  },
  {
    id: 'i2',
    name: 'Marcus "Flow" Johnson',
    bio: 'A veteran of the hip-hop dance scene with 20 years of experience spanning New York, London, and Accra. Marcus specializes in urban styles and battle culture.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    specialties: ['Hip-Hop', 'Breaking', 'Freestyle', 'Locking', 'Popping'],
    videoCount: 31,
    followers: 24300,
  },
  {
    id: 'i3',
    name: 'Amara Diallo',
    bio: 'Choreographer and performer whose work bridges traditional West African dance with contemporary forms. Her company has toured internationally and her AfroBreak classes are consistently oversubscribed.',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&q=80',
    specialties: ['Contemporary', 'West African', 'Choreography', 'Afro Fusion'],
    videoCount: 18,
    followers: 14200,
  },
  {
    id: 'i4',
    name: 'Yaya Kingston',
    bio: 'Jamaican-born, Accra-based Dancehall ambassador who has spent two decades spreading Caribbean dance culture across Africa and the diaspora. Yaya brings unmatched authenticity and infectious energy.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    specialties: ['Dancehall', 'Caribbean', 'Afro-Caribbean'],
    videoCount: 15,
    followers: 11800,
  },
]
