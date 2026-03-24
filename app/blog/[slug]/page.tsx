'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Share2, ChevronRight } from 'lucide-react'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/db'
import type { BlogPost } from '@/lib/types'
import BlogCard from '@/components/blog/BlogCard'
import Badge from '@/components/ui/Badge'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function renderContent(content: string) {
  const paragraphs = content.split('\n\n')
  return paragraphs.map((para, i) => {
    if (para.startsWith('**') && para.endsWith('**')) {
      return (
        <h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">
          {para.replace(/\*\*/g, '')}
        </h3>
      )
    }
    const withBold = para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    return (
      <p
        key={i}
        className="text-text-secondary leading-relaxed mb-6 text-base"
        dangerouslySetInnerHTML={{ __html: withBold }}
      />
    )
  })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBlogPostBySlug(params.slug), getBlogPosts()]).then(([p, all]) => {
      if (!p) { setLoading(false); return }
      setPost(p)
      setRelated(all.filter(a => a.slug !== p.slug && a.category === p.category).slice(0, 3))
      setLoading(false)
    })
  }, [params.slug])

  if (loading) return <div className="min-h-screen pt-16 flex items-center justify-center"><p className="text-text-secondary">Loading...</p></div>
  if (!post) return notFound()

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

        <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-black/60 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <Badge label={post.category} variant={post.category} size="md" className="mb-4" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <article className="lg:col-span-3">
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary-500/30">
                  <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-white flex items-center gap-1.5">
                    <User size={13} className="text-primary-500" />
                    {post.author}
                  </p>
                  <p className="text-xs text-text-secondary">{formatDate(post.publishedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <Clock size={13} /> {post.readTime}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-white bg-surface border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/30 transition-all"
                >
                  <Share2 size={13} /> Share
                </button>
              </div>
            </div>

            <p className="text-lg text-white font-medium leading-relaxed mb-8 italic border-l-4 border-primary-500 pl-5">
              {post.excerpt}
            </p>

            <div className="prose-custom">
              {renderContent(post.content)}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm font-semibold text-text-secondary mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-surface-2 border border-white/10 text-xs text-text-secondary hover:text-white hover:border-white/30 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 bg-surface rounded-2xl border border-white/5 p-6">
              <h3 className="font-bold text-white mb-4">About the Author</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-primary-500/20">
                  <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{post.author}</h4>
                  <p className="text-sm text-primary-400 mb-2">Contributor at AfroBreak</p>
                  <p className="text-sm text-text-secondary">
                    A passionate advocate for Afro and urban dance culture, dedicated to preserving and promoting the richness of African movement traditions across the diaspora.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  Related Articles
                  <Link href="/blog" className="ml-auto">
                    <ChevronRight size={14} className="text-primary-500" />
                  </Link>
                </h3>
                {related.length > 0 ? (
                  <div className="space-y-4">
                    {related.map(p => (
                      <Link
                        key={p.id}
                        href={`/blog/${p.slug}`}
                        className="group block bg-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/15 transition-all"
                      >
                        <div className="h-28 overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <Badge label={p.category} variant={p.category} />
                          <p className="text-xs text-white font-semibold mt-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1">{p.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">More articles coming soon.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
