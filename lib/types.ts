export interface Video {
  id: string
  title: string
  description: string
  instructor: string
  thumbnail: string
  duration: string
  category: VideoCategory
  level: VideoLevel
  isPremium: boolean
  price?: number
  views: number
  likes: number
  videoUrl: string
  tags: string[]
  createdAt: string
}

export type VideoCategory = 'Afro' | 'Hip-Hop' | 'Tutorial' | 'Dancehall' | 'Contemporary' | 'Kids'
export type VideoLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  city: string
  type: EventType
  price: number
  image: string
  instructor: string
  capacity: number
  registered: number
  tags: string[]
}

export type EventType = 'Workshop' | 'Class' | 'Show' | 'Battle'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar: string
  image: string
  category: BlogCategory
  tags: string[]
  readTime: string
  publishedAt: string
  featured: boolean
}

export type BlogCategory = 'Dance Tips' | 'Lifestyle' | 'Culture' | 'Interviews' | 'News'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  isPremium: boolean
  subscriptionEnd?: string
  favorites: string[]
  watchLater: string[]
}

export interface Instructor {
  id: string
  name: string
  bio: string
  avatar: string
  specialties: string[]
  videoCount: number
  followers: number
}
