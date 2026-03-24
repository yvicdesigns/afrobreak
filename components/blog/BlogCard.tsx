import Link from 'next/link'
import { Clock, User } from 'lucide-react'
import clsx from 'clsx'
import type { BlogPost } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface BlogCardProps {
  post: BlogPost
  className?: string
  featured?: boolean
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function BlogCard({ post, className, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={clsx(
          'group relative rounded-2xl overflow-hidden block',
          'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
          className
        )}
      >
        <div className="relative h-80 sm:h-96">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-4">
              <Badge label={post.category} variant={post.category} size="md" />
              <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                <Clock size={12} /> {post.readTime}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 line-clamp-2">
              {post.title}
            </h2>
            <p className="text-text-secondary text-sm line-clamp-2 mb-4">{post.excerpt}</p>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <User size={14} className="text-primary-500" />
              <span>{post.author}</span>
              <span className="text-text-muted">·</span>
              <span className="text-text-muted">{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={clsx(
        'group block rounded-xl overflow-hidden',
        'bg-surface border border-white/5',
        'transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-card-hover',
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge label={post.category} variant={post.category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {post.readTime}
          </span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>

        <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2 mb-4">{post.excerpt}</p>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-surface-2 overflow-hidden ring-1 ring-white/10">
            <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs text-text-secondary font-medium">{post.author}</span>
        </div>
      </div>
    </Link>
  )
}
