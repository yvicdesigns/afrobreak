import { supabase } from '@/lib/supabase'
import type { Video, Event, BlogPost, Instructor } from '@/lib/types'

function mapVideo(row: Record<string, unknown>): Video {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    instructor: row.instructor as string,
    thumbnail: row.thumbnail as string,
    duration: row.duration as string,
    category: row.category as Video['category'],
    level: row.level as Video['level'],
    isPremium: row.is_premium as boolean,
    price: row.price as number | undefined,
    views: row.views as number,
    likes: row.likes as number,
    videoUrl: row.video_url as string,
    tags: row.tags as string[],
    createdAt: row.created_at as string,
  }
}

function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    date: row.date as string,
    time: row.time as string,
    location: row.location as string,
    city: row.city as string,
    type: row.type as Event['type'],
    price: row.price as number,
    image: row.image as string,
    instructor: row.instructor as string,
    capacity: row.capacity as number,
    registered: row.registered as number,
    tags: row.tags as string[],
  }
}

function mapBlogPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: row.content as string,
    author: row.author as string,
    authorAvatar: row.author_avatar as string,
    image: row.image as string,
    category: row.category as BlogPost['category'],
    tags: row.tags as string[],
    readTime: row.read_time as string,
    publishedAt: row.published_at as string,
    featured: row.featured as boolean,
  }
}

function mapInstructor(row: Record<string, unknown>): Instructor {
  return {
    id: row.id as string,
    name: row.name as string,
    bio: row.bio as string,
    avatar: row.avatar as string,
    specialties: row.specialties as string[],
    videoCount: row.video_count as number,
    followers: row.followers as number,
  }
}

export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
  if (error || !data) return []
  return data.map(mapVideo)
}

export async function getVideoById(id: string): Promise<Video | null> {
  const { data, error } = await supabase.from('videos').select('*').eq('id', id).single()
  if (error || !data) return null
  return mapVideo(data)
}

export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true })
  if (error || !data) return []
  return data.map(mapEvent)
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
  if (error || !data) return null
  return mapEvent(data)
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from('blog_posts').select('*').order('published_at', { ascending: false })
  if (error || !data) return []
  return data.map(mapBlogPost)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single()
  if (error || !data) return null
  return mapBlogPost(data)
}

export async function getInstructors(): Promise<Instructor[]> {
  const { data, error } = await supabase.from('instructors').select('*')
  if (error || !data) return []
  return data.map(mapInstructor)
}

// ── VIDEO MUTATIONS ──────────────────────────────────────────────
export async function createVideo(v: Omit<Video, 'id' | 'views' | 'likes' | 'createdAt'>): Promise<Video | null> {
  const { data, error } = await supabase.from('videos').insert({
    id: `v${Date.now()}`,
    title: v.title,
    description: v.description,
    instructor: v.instructor,
    thumbnail: v.thumbnail,
    duration: v.duration,
    category: v.category,
    level: v.level,
    is_premium: v.isPremium,
    price: v.isPremium ? v.price : null,
    views: 0,
    likes: 0,
    video_url: v.videoUrl,
    tags: v.tags,
    created_at: new Date().toISOString().split('T')[0],
  }).select().single()
  if (error || !data) return null
  return mapVideo(data)
}

export async function updateVideo(id: string, v: Partial<Video>): Promise<boolean> {
  const updates: Record<string, unknown> = {}
  if (v.title !== undefined) updates.title = v.title
  if (v.description !== undefined) updates.description = v.description
  if (v.instructor !== undefined) updates.instructor = v.instructor
  if (v.thumbnail !== undefined) updates.thumbnail = v.thumbnail
  if (v.duration !== undefined) updates.duration = v.duration
  if (v.category !== undefined) updates.category = v.category
  if (v.level !== undefined) updates.level = v.level
  if (v.isPremium !== undefined) updates.is_premium = v.isPremium
  if (v.price !== undefined) updates.price = v.price
  if (v.videoUrl !== undefined) updates.video_url = v.videoUrl
  if (v.tags !== undefined) updates.tags = v.tags
  const { error } = await supabase.from('videos').update(updates).eq('id', id)
  return !error
}

export async function deleteVideo(id: string): Promise<boolean> {
  const { error } = await supabase.from('videos').delete().eq('id', id)
  return !error
}

// ── EVENT MUTATIONS ──────────────────────────────────────────────
export async function createEvent(e: Omit<Event, 'id' | 'registered'>): Promise<Event | null> {
  const { data, error } = await supabase.from('events').insert({
    id: `e${Date.now()}`,
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    location: e.location,
    city: e.city,
    type: e.type,
    price: e.price,
    image: e.image,
    instructor: e.instructor,
    capacity: e.capacity,
    registered: 0,
    tags: e.tags,
  }).select().single()
  if (error || !data) return null
  return mapEvent(data)
}

export async function updateEvent(id: string, e: Partial<Event>): Promise<boolean> {
  const updates: Record<string, unknown> = { ...e }
  const { error } = await supabase.from('events').update(updates).eq('id', id)
  return !error
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase.from('events').delete().eq('id', id)
  return !error
}

// ── BLOG MUTATIONS ───────────────────────────────────────────────
function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function createBlogPost(p: Omit<BlogPost, 'id' | 'slug' | 'publishedAt'>): Promise<BlogPost | null> {
  const { data, error } = await supabase.from('blog_posts').insert({
    id: `b${Date.now()}`,
    slug: slugify(p.title),
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    author: p.author,
    author_avatar: p.authorAvatar,
    image: p.image,
    category: p.category,
    tags: p.tags,
    read_time: p.readTime,
    published_at: new Date().toISOString().split('T')[0],
    featured: p.featured,
  }).select().single()
  if (error || !data) return null
  return mapBlogPost(data)
}

export async function updateBlogPost(id: string, p: Partial<BlogPost>): Promise<boolean> {
  const updates: Record<string, unknown> = {}
  if (p.title !== undefined) { updates.title = p.title; updates.slug = slugify(p.title) }
  if (p.excerpt !== undefined) updates.excerpt = p.excerpt
  if (p.content !== undefined) updates.content = p.content
  if (p.author !== undefined) updates.author = p.author
  if (p.authorAvatar !== undefined) updates.author_avatar = p.authorAvatar
  if (p.image !== undefined) updates.image = p.image
  if (p.category !== undefined) updates.category = p.category
  if (p.tags !== undefined) updates.tags = p.tags
  if (p.readTime !== undefined) updates.read_time = p.readTime
  if (p.featured !== undefined) updates.featured = p.featured
  const { error } = await supabase.from('blog_posts').update(updates).eq('id', id)
  return !error
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  return !error
}

// ── PROFILE MUTATIONS ─────────────────────────────────────────────
export async function updateProfile(userId: string, updates: { name?: string; avatar?: string }): Promise<boolean> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
  return !error
}

export async function toggleFavorite(userId: string, videoId: string, currentFavorites: string[]): Promise<string[]> {
  const updated = currentFavorites.includes(videoId)
    ? currentFavorites.filter(id => id !== videoId)
    : [...currentFavorites, videoId]
  await supabase.from('profiles').update({ favorites: updated }).eq('id', userId)
  return updated
}

export async function toggleWatchLater(userId: string, videoId: string, currentWatchLater: string[]): Promise<string[]> {
  const updated = currentWatchLater.includes(videoId)
    ? currentWatchLater.filter(id => id !== videoId)
    : [...currentWatchLater, videoId]
  await supabase.from('profiles').update({ watch_later: updated }).eq('id', userId)
  return updated
}
