'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, User, Share2, ChevronRight, Check } from 'lucide-react'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/db'
import type { BlogPost } from '@/lib/types'
import BlogCard from '@/components/blog/BlogCard'
import Badge from '@/components/ui/Badge'
import { useLanguage } from '@/lib/LanguageContext'

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
  const { tr } = useLanguage()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([getBlogPostBySlug(params.slug), getBlogPosts()]).then(([p, all]) => {
      if (!p) { setLoading(false); return }
      setPost(p)
      setRelated(all.filter(a => a.slug !== p.slug && a.category === p.category).slice(0, 3))
      setLoading(false)
    })
  }, [params.slug])

  if (loading) return <div className="min-h-screen pt-16 flex items-center justify-center"><p className="text-text-secondary">{tr.common.loading}</p></div>
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
            {tr.blog.backToBlog}
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
                <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary-500/30 bg-primary-500/20 flex items-center justify-center">
                  {post.authorAvatar
                    ? <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                    : <span className="text-primary-400 font-bold text-lg">{post.author.charAt(0).toUpperCase()}</span>
                  }
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
                <div className="relative">
                  <button
                    onClick={() => setShowShare(v => !v)}
                    className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-white bg-surface border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/30 transition-all"
                  >
                    <Share2 size={13} /> {tr.blog.share}
                  </button>

                  {showShare && post && (
                    <div className="absolute right-0 top-full mt-2 z-30 w-52 bg-surface border border-white/10 rounded-xl p-2 shadow-2xl">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`${post.title}\n\n${window.location.href}`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        X (Twitter)
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href).catch(() => {})
                          setCopied(true)
                          setTimeout(() => { setCopied(false); setShowShare(false) }, 2000)
                        }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all text-sm text-white"
                      >
                        {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} className="text-text-muted" />}
                        {copied ? tr.blog.copied : tr.blog.copyLink}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-lg text-white font-medium leading-relaxed mb-8 italic border-l-4 border-primary-500 pl-5">
              {post.excerpt}
            </p>

            <div className="prose-custom">
              {renderContent(post.content)}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm font-semibold text-text-secondary mb-3">{tr.blog.tags}</p>
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
              <h3 className="font-bold text-white mb-4">{tr.blog.aboutAuthor}</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-primary-500/20 bg-primary-500/20 flex items-center justify-center">
                  {post.authorAvatar
                    ? <img src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
                    : <span className="text-primary-400 font-bold text-2xl">{post.author.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">{post.author}</h4>
                  <p className="text-sm text-primary-400 mb-2">{tr.blog.contributorAt}</p>
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
                  {tr.blog.relatedArticles}
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
                  <p className="text-sm text-text-muted">{tr.blog.moreArticlesSoon}</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
