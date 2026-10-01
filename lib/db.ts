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
    youtubeUrl: row.youtube_url as string | undefined,
    country: row.country as string | undefined,
    isInternational: row.is_international as boolean | undefined,
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
    role: (row.role as string) || '',
    bio: row.bio as string,
    avatar: (row.avatar as string) || '',
    cover: (row.cover as string) || '',
    specialties: (row.specialties as string[]) || [],
    location: (row.location as string) || '',
    rating: (row.rating as number) || 5.0,
    videoCount: (row.video_count as number) || 0,
    followers: (row.followers as number) || 0,
    displayOrder: (row.display_order as number) || 0,
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

// ── MUSIC ─────────────────────────────────────────────────────────
// All admin-created tracks/albums use settings table (avoids RLS on tracks/albums tables).
// Legacy DB tracks (t1-t5 seed data) are read from tracks table + can be overridden/deleted via settings.
// Settings keys: musictrack_{id} = full track JSON, musicalbum_{id} = full album JSON

function parseSettingsTracks(rows: { key: string; value: string }[]) {
  return rows
    .map(r => { try { return JSON.parse(r.value) } catch { return null } })
    .filter(Boolean)
}

export async function getTracks() {
  // Read settings-based tracks (admin-created or edits/deletes of legacy tracks)
  const { data: sRows } = await supabase.from('settings').select('key, value').like('key', 'musictrack_%')
  const settingsTracks = parseSettingsTracks(sRows || [])
  const overrideIds = new Set(settingsTracks.map((t: Record<string, unknown>) => t.id as string))

  // Read legacy DB tracks for any not overridden in settings
  const { data: dbRows } = await supabase.from('tracks').select('*').order('created_at', { ascending: false })
  const legacyTracks = (dbRows || [])
    .filter(r => !overrideIds.has(r.id))
    .map(r => ({
      id: r.id,
      title: r.title,
      artist: r.artist,
      album: r.album || '',
      duration: r.duration || '',
      cover: r.cover_url || '',
      preview_url: r.audio_url || '',
      genre: '',
      badge: '',
      price: r.price || 0,
      download_url: '',
      in_stock: true,
    }))

  // Merge: settings tracks first (newest), then legacy, excluding deleted ones
  const all = [
    ...settingsTracks.filter((t: Record<string, unknown>) => !t.deleted),
    ...legacyTracks,
  ]
  return all
}

export async function createTrack(t: Record<string, unknown>) {
  const id = `musictrack_${Date.now()}`
  const payload = {
    id,
    title: t.title || '',
    artist: t.artist || '',
    album: t.album || '',
    duration: t.duration || '',
    cover: t.cover || '',
    preview_url: t.preview_url || '',
    genre: t.genre || '',
    badge: t.badge || '',
    price: t.price || 0,
    download_url: t.download_url || '',
    in_stock: true,
    created_at: new Date().toISOString(),
  }
  const ok = await saveSetting(id, JSON.stringify(payload))
  if (!ok) return null
  return payload
}

export async function updateTrack(id: string, t: Record<string, unknown>) {
  // For both new (musictrack_) and legacy (t1-t5) tracks, save full data to settings
  const settingsKey = id.startsWith('musictrack_') ? id : `musictrack_${id}`
  const existing = await getSetting(settingsKey)
  let base: Record<string, unknown> = {}
  if (existing) {
    try { base = JSON.parse(existing) } catch { /* use empty */ }
  } else {
    // Legacy track — pull current data from DB as base
    const { data } = await supabase.from('tracks').select('*').eq('id', id).single()
    if (data) base = {
      id: data.id,
      title: data.title,
      artist: data.artist,
      album: data.album || '',
      duration: data.duration || '',
      cover: data.cover_url || '',
      preview_url: data.audio_url || '',
      genre: '',
      badge: '',
      price: data.price || 0,
      download_url: '',
      in_stock: true,
      created_at: data.created_at,
    }
  }
  const updated = {
    ...base,
    id: id.startsWith('musictrack_') ? id : id,
    title: t.title ?? base.title,
    artist: t.artist ?? base.artist,
    album: t.album ?? base.album,
    duration: t.duration ?? base.duration,
    cover: t.cover ?? base.cover,
    preview_url: t.preview_url ?? base.preview_url,
    genre: t.genre ?? base.genre,
    badge: t.badge ?? base.badge,
    price: t.price ?? base.price,
    download_url: t.download_url ?? base.download_url,
    in_stock: true,
  }
  return saveSetting(settingsKey, JSON.stringify(updated))
}

export async function deleteTrack(id: string) {
  if (id.startsWith('musictrack_')) {
    const { error } = await supabase.from('settings').delete().eq('key', id)
    return !error
  }
  // Legacy DB track: mark as deleted in settings so getTracks skips it
  return saveSetting(`musictrack_${id}`, JSON.stringify({ id, deleted: true }))
}

export async function getAlbums() {
  const { data: sRows } = await supabase.from('settings').select('key, value').like('key', 'musicalbum_%')
  const settingsAlbums = parseSettingsTracks(sRows || [])
  const overrideIds = new Set(settingsAlbums.map((a: Record<string, unknown>) => a.id as string))

  const { data: dbRows } = await supabase.from('albums').select('*').order('created_at', { ascending: false })
  const legacyAlbums = (dbRows || [])
    .filter(r => !overrideIds.has(r.id))
    .map(r => ({
      id: r.id,
      title: r.title,
      artist: r.artist,
      cover: r.cover_url || '',
      genre: '',
      price: 0,
      track_count: 0,
      description: '',
      download_url: '',
    }))

  return [
    ...settingsAlbums.filter((a: Record<string, unknown>) => !a.deleted),
    ...legacyAlbums,
  ]
}

export async function createAlbum(a: Record<string, unknown>) {
  const id = `musicalbum_${Date.now()}`
  const payload = {
    id,
    title: a.title || '',
    artist: a.artist || '',
    cover: a.cover || '',
    genre: a.genre || '',
    price: a.price || 0,
    track_count: a.track_count || 0,
    description: a.description || '',
    download_url: a.download_url || '',
    created_at: new Date().toISOString(),
  }
  const ok = await saveSetting(id, JSON.stringify(payload))
  if (!ok) return null
  return payload
}

export async function updateAlbum(id: string, a: Record<string, unknown>) {
  const settingsKey = id.startsWith('musicalbum_') ? id : `musicalbum_${id}`
  const existing = await getSetting(settingsKey)
  let base: Record<string, unknown> = {}
  if (existing) {
    try { base = JSON.parse(existing) } catch { /* use empty */ }
  }
  const updated = {
    ...base,
    id,
    title: a.title ?? base.title,
    artist: a.artist ?? base.artist,
    cover: a.cover ?? base.cover,
    genre: a.genre ?? base.genre,
    price: a.price ?? base.price,
    track_count: a.track_count ?? base.track_count,
    description: a.description ?? base.description,
    download_url: a.download_url ?? base.download_url,
  }
  return saveSetting(settingsKey, JSON.stringify(updated))
}

export async function deleteAlbum(id: string) {
  if (id.startsWith('musicalbum_')) {
    const { error } = await supabase.from('settings').delete().eq('key', id)
    return !error
  }
  return saveSetting(`musicalbum_${id}`, JSON.stringify({ id, deleted: true }))
}

// ── STORE PRODUCTS ────────────────────────────────────────────────
export async function getProducts() {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  return data || []
}
export async function createProduct(p: Record<string, unknown>) {
  const { data, error } = await supabase.from('products').insert({ id: `p${Date.now()}`, ...p }).select().single()
  if (error) return null
  return data
}
export async function updateProduct(id: string, p: Record<string, unknown>) {
  const { error } = await supabase.from('products').update(p).eq('id', id)
  return !error
}
export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  return !error
}

// ── SITE SETTINGS ─────────────────────────────────────────────────
export async function getSetting(key: string): Promise<string | null> {
  const { data } = await supabase.from('settings').select('value').eq('key', key).single()
  return data?.value ?? null
}

export async function saveSetting(key: string, value: string): Promise<boolean> {
  const { error } = await supabase.from('settings').upsert({ key, value })
  return !error
}

// ── TEAM MEMBERS ──────────────────────────────────────────────────
export async function getTeamMembers() {
  const { data } = await supabase.from('team_members').select('*').order('display_order', { ascending: true })
  return data || []
}
export async function createTeamMember(m: Record<string, unknown>) {
  const { data, error } = await supabase.from('team_members').insert({ id: `tm${Date.now()}`, ...m }).select().single()
  if (error) return null
  return data
}
export async function updateTeamMember(id: string, m: Record<string, unknown>) {
  const { error } = await supabase.from('team_members').update(m).eq('id', id)
  return !error
}
export async function deleteTeamMember(id: string) {
  const { error } = await supabase.from('team_members').delete().eq('id', id)
  return !error
}

// ── CHAMPIONS ─────────────────────────────────────────────────────
export async function getChampions() {
  const { data } = await supabase.from('champions').select('*').order('year', { ascending: false })
  return data || []
}
export async function createChampion(c: Record<string, unknown>) {
  const { data, error } = await supabase.from('champions').insert({ id: `ch${Date.now()}`, ...c }).select().single()
  if (error) return null
  return data
}
export async function updateChampion(id: string, c: Record<string, unknown>) {
  const { error } = await supabase.from('champions').update(c).eq('id', id)
  return !error
}
export async function deleteChampion(id: string) {
  const { error } = await supabase.from('champions').delete().eq('id', id)
  return !error
}

// ── PRESS COVERAGE ────────────────────────────────────────────────
export async function getPresscoverage() {
  const { data } = await supabase.from('press_coverage').select('*').order('date', { ascending: false })
  return data || []
}
export async function createPressCoverage(p: Record<string, unknown>) {
  const { data, error } = await supabase.from('press_coverage').insert({ id: `pc${Date.now()}`, ...p }).select().single()
  if (error) return null
  return data
}
export async function updatePressCoverage(id: string, p: Record<string, unknown>) {
  const { error } = await supabase.from('press_coverage').update(p).eq('id', id)
  return !error
}
export async function deletePressCoverage(id: string) {
  const { error } = await supabase.from('press_coverage').delete().eq('id', id)
  return !error
}

// ── DOCUMENTARIES ─────────────────────────────────────────────────
export async function getDocumentaries() {
  const { data } = await supabase.from('documentaries').select('*').order('year', { ascending: false })
  return data || []
}
export async function createDocumentary(d: Record<string, unknown>) {
  const { data, error } = await supabase.from('documentaries').insert({ id: `doc${Date.now()}`, ...d }).select().single()
  if (error) return null
  return data
}
export async function updateDocumentary(id: string, d: Record<string, unknown>) {
  const { error } = await supabase.from('documentaries').update(d).eq('id', id)
  return !error
}
export async function deleteDocumentary(id: string) {
  const { error } = await supabase.from('documentaries').delete().eq('id', id)
  return !error
}

// ── JOBS ──────────────────────────────────────────────────────────
export async function getJobs() {
  const { data } = await supabase.from('jobs').select('*').order('title', { ascending: true })
  return data || []
}
export async function createJob(j: Record<string, unknown>) {
  const { data, error } = await supabase.from('jobs').insert({ id: `j${Date.now()}`, ...j }).select().single()
  if (error) return null
  return data
}
export async function updateJob(id: string, j: Record<string, unknown>) {
  const { error } = await supabase.from('jobs').update(j).eq('id', id)
  return !error
}
export async function deleteJob(id: string) {
  const { error } = await supabase.from('jobs').delete().eq('id', id)
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

// ── PARTNERS ──────────────────────────────────────────────────────
export async function getPartners() {
  const { data } = await supabase.from('partners').select('*').order('display_order', { ascending: true })
  return data || []
}
export async function createPartner(p: Record<string, unknown>) {
  const { data, error } = await supabase.from('partners').insert({ id: `pt${Date.now()}`, ...p }).select().single()
  if (error) return null
  return data
}
export async function updatePartner(id: string, p: Record<string, unknown>) {
  const { error } = await supabase.from('partners').update(p).eq('id', id)
  return !error
}
export async function deletePartner(id: string) {
  const { error } = await supabase.from('partners').delete().eq('id', id)
  return !error
}

// ── AWARD CATEGORIES (stored in award_categories table) ────────────────
export async function getAwardCategories() {
  const { data } = await supabase.from('award_categories').select('*').order('num', { ascending: true })
  return data || []
}
export async function updateAwardCategory(num: number, fields: Record<string, unknown>) {
  const { error } = await supabase
    .from('award_categories')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('num', num)
  return !error
}
export async function seedAwardCategories(categories: Record<string, unknown>[]) {
  const { error } = await supabase.from('award_categories').upsert(categories as never[])
  if (error) throw new Error('Failed to seed award categories')
  return true
}

// ── NOMINATIONS (stored as JSON rows in settings, key = nom_TIMESTAMP) ──
export async function getNominations() {
  const { data } = await supabase.from('settings').select('key, value').like('key', 'nom_%')
  if (!data) return []
  return data
    .map(row => {
      try {
        const n = JSON.parse(row.value)
        // Normalize camelCase (old format) to snake_case (current format)
        if (n.nominatorName && !n.nominator_name) {
          return {
            id: n.id,
            status: n.status || 'pending',
            created_at: n.created_at,
            nominator_name: n.nominatorName,
            nominator_email: n.nominatorEmail,
            nominator_phone: n.nominatorPhone,
            nominator_country: n.nominatorCountry,
            relationship_to_nominee: n.relationshipToNominee,
            category_num: n.categoryNum,
            category: n.categoryName,
            section: n.section,
            nominee_name: n.nomineeName,
            nominee_stage_name: n.nomineeStage,
            nominee_gender: n.nomineeGender,
            nominee_country: n.nomineeCountry,
            nominee_city: n.nomineeCity,
            nominee_region: n.nomineeRegion,
            nominee_email: n.nomineeEmail,
            nominee_phone: n.nomineePhone,
            nominee_social_links: n.nomineeSocial,
            support_links: n.supportLinks,
          }
        }
        return n
      } catch { return null }
    })
    .filter(Boolean)
    .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
      new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
    )
}
export async function createNomination(n: Record<string, unknown>) {
  const id = `nom_${Date.now()}`
  const payload = { id, ...n, status: 'pending', created_at: new Date().toISOString() }
  const ok = await saveSetting(id, JSON.stringify(payload))
  if (!ok) throw new Error('Failed to save nomination')
  return payload
}
export async function updateNominationStatus(id: string, status: string) {
  const current = await getSetting(id)
  if (!current) return false
  try {
    const parsed = JSON.parse(current)
    return saveSetting(id, JSON.stringify({ ...parsed, status }))
  } catch { return false }
}
export async function deleteNomination(id: string) {
  const { error } = await supabase.from('settings').delete().eq('key', id)
  return !error
}
