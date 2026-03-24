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
  {
    id: 'e1',
    title: 'Afrobeats Intensive Weekend',
    description: 'A two-day deep dive into Afrobeats dance with instructors from Nigeria, Ghana, and Senegal. Expect high-energy sessions, cultural context, and unforgettable connections with the global Afro dance community.',
    date: '2026-04-12',
    time: '10:00',
    location: 'Studio Groove, 45 Rue de la Danse',
    city: 'Paris',
    type: 'Workshop',
    price: 120,
    image: 'https://images.unsplash.com/photo-1483362271674-7461064d5e66?w=800&q=80',
    instructor: 'Kemi Adeyemi',
    capacity: 40,
    registered: 32,
    tags: ['afrobeats', 'intensive', 'weekend', 'paris'],
  },
  {
    id: 'e2',
    title: 'Hip-Hop Battle: AfroBreak Edition',
    description: 'The biggest urban dance battle of the season. Open to all styles with special categories for Afro-fusion. Cash prizes, industry judges, and legendary freestyles await.',
    date: '2026-04-26',
    time: '19:00',
    location: 'La Grande Halle',
    city: 'Lyon',
    type: 'Battle',
    price: 25,
    image: 'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=800&q=80',
    instructor: 'Marcus "Flow" Johnson',
    capacity: 500,
    registered: 287,
    tags: ['battle', 'hip-hop', 'competition', 'lyon'],
  },
  {
    id: 'e3',
    title: 'Dancehall Weekly Class',
    description: 'Every Tuesday evening, join Yaya Kingston for a high-energy Dancehall session. Suitable for all levels, just bring your energy and willingness to have fun.',
    date: '2026-04-07',
    time: '19:30',
    location: 'AfroGroove Studio',
    city: 'Marseille',
    type: 'Class',
    price: 18,
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80',
    instructor: 'Yaya Kingston',
    capacity: 25,
    registered: 18,
    tags: ['dancehall', 'weekly', 'all levels', 'marseille'],
  },
  {
    id: 'e4',
    title: 'Afro Contemporary Showcase',
    description: 'An evening of breathtaking performances blending African traditions with contemporary dance forms. Featuring soloists and ensembles from across the African diaspora.',
    date: '2026-05-03',
    time: '20:00',
    location: 'Théâtre de la Ville',
    city: 'Paris',
    type: 'Show',
    price: 45,
    image: 'https://images.unsplash.com/photo-1508700929628-c3d7819c1498?w=800&q=80',
    instructor: 'Amara Diallo',
    capacity: 300,
    registered: 241,
    tags: ['show', 'contemporary', 'afro', 'performance'],
  },
  {
    id: 'e5',
    title: 'Kids Summer Dance Camp',
    description: 'Five days of dancing, games, and cultural discovery for children aged 6-14. Kids will learn Afro dance, hip-hop basics, and put together a final performance for their families.',
    date: '2026-07-14',
    time: '09:00',
    location: 'Centre Culturel Arc-en-Ciel',
    city: 'Bordeaux',
    type: 'Workshop',
    price: 199,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    instructor: 'Mama Bella',
    capacity: 30,
    registered: 22,
    tags: ['kids', 'summer', 'camp', 'bordeaux'],
  },
  {
    id: 'e6',
    title: 'Breaking & B-Boy Masterclass',
    description: 'An intensive masterclass with world-renowned B-Boy Saka. Learn power moves, footwork sequences, and battle strategy from a champion who has competed on every continent.',
    date: '2026-05-17',
    time: '14:00',
    location: 'Urban Dance Academy',
    city: 'Toulouse',
    type: 'Workshop',
    price: 65,
    image: 'https://images.unsplash.com/photo-1504680177321-2e6a879d4e8f?w=800&q=80',
    instructor: 'B-Boy Saka',
    capacity: 20,
    registered: 20,
    tags: ['breaking', 'bboy', 'masterclass', 'toulouse'],
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: 'history-of-afrobeats-dance',
    title: 'The Rich History of Afrobeats Dance: From Lagos to Paris',
    excerpt: 'How a music and dance revolution that started in the streets of Lagos transformed global culture and found a passionate home in the heart of Europe.',
    content: `Afrobeats dance is not simply choreography—it is a living language. Born from the vibrant streets of Lagos, Accra, and Dakar, it carries the stories, struggles, and celebrations of an entire continent.

The origins trace back decades, weaving through highlife, jùjú music, and the township sounds of South Africa. But the contemporary Afrobeats wave, which exploded globally in the 2010s, brought with it a new vocabulary of movement: the Shaku Shaku, the Zanku, the Leg Work.

What makes Afrobeats dance so compelling is its democratic nature. Unlike many dance forms gatekept by expensive studios and rigid technique requirements, Afrobeats invites everyone. The dance floor is the classroom. The community is the teacher.

In Paris, this democracy of movement found fertile ground. The city's diverse African and Caribbean diaspora had always carried these rhythms. When Afrobeats broke into mainstream consciousness, Paris was ready. Studios like those in Château Rouge and Belleville became incubators for a European Afro dance scene that now exports talent back to the continent.

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
    excerpt: 'We sat down with one of France\'s most celebrated Afro-contemporary choreographers to discuss her creative process, cultural responsibility, and the future of African dance.',
    content: `Amara Diallo needs no introduction in the Afro-contemporary dance world. Her work has graced stages from Avignon to Johannesburg, and her classes at AfroBreak regularly sell out within hours of opening.

We caught up with her at her Paris studio between rehearsals for her upcoming piece, "Mémoire des Corps."

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

The global spread of Dancehall has been both exciting and complicated. Its influence on UK grime and garage, on American trap, on French urbain, is undeniable. But with influence comes appropriation, and the Dancehall community has been vocal about wanting credit and compensation for its cultural gifts.

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
    bio: 'Born in Lagos and based in Paris, Kemi has been teaching Afrobeats dance for over 12 years. She has choreographed for major African artists and leads workshops across Europe.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
    specialties: ['Afrobeats', 'Afro Fusion', 'Choreography'],
    videoCount: 24,
    followers: 18500,
  },
  {
    id: 'i2',
    name: 'Marcus "Flow" Johnson',
    bio: 'A veteran of the hip-hop dance scene with 20 years of experience spanning New York, London, and Paris. Marcus specializes in urban styles and battle culture.',
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
    bio: 'Jamaican-born, Marseille-based Dancehall ambassador who has spent two decades spreading Caribbean dance culture across Europe. Yaya brings unmatched authenticity and infectious energy.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    specialties: ['Dancehall', 'Caribbean', 'Afro-Caribbean'],
    videoCount: 15,
    followers: 11800,
  },
]
