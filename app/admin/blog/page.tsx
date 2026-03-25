'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, Check, Eye, EyeOff, Bold, Italic, List } from 'lucide-react'
import clsx from 'clsx'
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '@/lib/db'
import type { BlogPost, BlogCategory } from '@/lib/types'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'
import Badge from '@/components/ui/Badge'

const categories: BlogCategory[] = ['Dance Tips', 'Lifestyle', 'Culture', 'Interviews', 'News']

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  author: '',
  authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
  image: '',
  category: 'Dance Tips' as BlogCategory,
  tags: '',
  readTime: '5 min read',
  featured: false,
}

type FormState = typeof emptyForm

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [success, setSuccess] = useState('')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getBlogPosts().then(setPosts)
  }, [])

  const validate = () => {
    const errs: Partial<FormState> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.excerpt.trim()) errs.excerpt = 'Excerpt is required'
    if (!form.content.trim()) errs.content = 'Content is required'
    if (!form.author.trim()) errs.author = 'Author is required'
    if (!form.image.trim()) errs.image = 'Image URL is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const insertFormat = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('blog-content') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = form.content.substring(start, end)
    const newContent = form.content.substring(0, start) + prefix + selected + suffix + form.content.substring(end)
    setForm(f => ({...f, content: newContent}))
    setTimeout(() => {
      textarea.selectionStart = start + prefix.length
      textarea.selectionEnd = end + prefix.length
      textarea.focus()
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)

    if (editId) {
      const ok = await updateBlogPost(editId, {
        title: form.title, excerpt: form.excerpt, content: form.content,
        author: form.author, authorAvatar: form.authorAvatar, image: form.image,
        category: form.category, tags, readTime: form.readTime, featured: form.featured,
      })
      if (ok) {
        setPosts(prev => prev.map(p =>
          p.id === editId
            ? { ...p, title: form.title, slug: slugify(form.title), excerpt: form.excerpt, content: form.content, author: form.author, authorAvatar: form.authorAvatar, image: form.image, category: form.category, tags, readTime: form.readTime, featured: form.featured }
            : p
        ))
        setSuccess('Post updated!')
      }
    } else {
      const created = await createBlogPost({
        title: form.title, excerpt: form.excerpt, content: form.content,
        author: form.author, authorAvatar: form.authorAvatar, image: form.image,
        category: form.category, tags, readTime: form.readTime, featured: form.featured,
      })
      if (created) {
        setPosts(prev => [created, ...prev])
        setSuccess('Post published!')
      }
    }

    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    setEditId(null)
    setPreview(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title, excerpt: post.excerpt, content: post.content,
      author: post.author, authorAvatar: post.authorAvatar, image: post.image,
      category: post.category, tags: post.tags.join(', '),
      readTime: post.readTime, featured: post.featured,
    })
    setEditId(post.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return
    const ok = await deleteBlogPost(id)
    if (ok) setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-text-secondary text-sm">{posts.length} posts published</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm); setPreview(false) }}>
          {showForm ? 'Cancel' : 'New Post'}
        </Button>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4">
          <Check size={16} /> {success}
        </div>
      )}

      {showForm && (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Post' : 'New Blog Post'}</h2>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPreview(!preview)}
                className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-all',
                  preview ? 'bg-secondary-500/15 text-secondary-400 border-secondary-500/30' : 'text-text-secondary border-white/10 hover:text-white')}>
                {preview ? <EyeOff size={14} /> : <Eye size={14} />}
                {preview ? 'Edit' : 'Preview'}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); setPreview(false) }}
                className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>
          </div>

          {preview ? (
            <div className="space-y-4">
              {form.image && <div className="h-64 rounded-xl overflow-hidden"><img src={form.image} alt="Preview" className="w-full h-full object-cover" /></div>}
              <Badge label={form.category} variant={form.category} />
              <h2 className="text-2xl font-bold text-white">{form.title || 'Untitled Post'}</h2>
              <p className="text-text-secondary italic">{form.excerpt}</p>
              <div className="border-t border-white/10 pt-4 text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{form.content}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-1.5">Title *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                    placeholder="Article title" className={`input-base ${errors.title ? 'border-red-500/60' : ''}`} />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                  {form.title && <p className="text-xs text-text-muted mt-1">Slug: /{slugify(form.title)}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-1.5">Excerpt *</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))}
                    placeholder="Brief summary..." rows={2} className={`input-base resize-none ${errors.excerpt ? 'border-red-500/60' : ''}`} />
                  {errors.excerpt && <p className="text-red-400 text-xs mt-1">{errors.excerpt}</p>}
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-white">Content *</label>
                    <div className="flex items-center gap-1 bg-surface-2 border border-white/10 rounded-lg p-1">
                      <button type="button" onClick={() => insertFormat('**', '**')} className="p-1.5 rounded text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="Bold"><Bold size={13} /></button>
                      <button type="button" onClick={() => insertFormat('*', '*')} className="p-1.5 rounded text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="Italic"><Italic size={13} /></button>
                      <button type="button" onClick={() => insertFormat('\n- ')} className="p-1.5 rounded text-text-secondary hover:text-white hover:bg-white/10 transition-all" title="List"><List size={13} /></button>
                    </div>
                  </div>
                  <textarea id="blog-content" value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))}
                    placeholder="Write your article... Use **bold** for headings." rows={14}
                    className={`input-base resize-none font-mono text-sm leading-relaxed ${errors.content ? 'border-red-500/60' : ''}`} />
                  {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value as BlogCategory}))} className="input-base">
                    {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Read Time</label>
                  <input type="text" value={form.readTime} onChange={e => setForm(f => ({...f, readTime: e.target.value}))} placeholder="5 min read" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Author *</label>
                  <input type="text" value={form.author} onChange={e => setForm(f => ({...f, author: e.target.value}))}
                    placeholder="Author name" className={`input-base ${errors.author ? 'border-red-500/60' : ''}`} />
                  {errors.author && <p className="text-red-400 text-xs mt-1">{errors.author}</p>}
                </div>
                <div>
                  <ImageUpload label="Cover Image *" value={form.image} onChange={v => setForm(f => ({...f, image: v}))} folder="blog" />
                  {errors.image && <p className="text-red-400 text-xs mt-1">{errors.image}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1.5">Tags (comma-separated)</label>
                  <input type="text" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} placeholder="afro, dance, culture" className="input-base" />
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setForm(f => ({...f, featured: !f.featured}))}
                    className={clsx('flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                      form.featured ? 'bg-gold-DEFAULT/15 text-gold-DEFAULT border-gold-DEFAULT/40' : 'bg-surface-2 text-text-secondary border-white/10')}>
                    ★ {form.featured ? 'Featured Post' : 'Mark as Featured'}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                <Button type="submit" variant="primary" loading={saving}>{editId ? 'Update Post' : 'Publish Post'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); setPreview(false) }}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Post</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Author</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-center p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Featured</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">{post.title}</p>
                        <p className="text-xs text-text-secondary">{post.readTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell"><Badge label={post.category} variant={post.category} /></td>
                  <td className="p-4 hidden md:table-cell text-sm text-text-secondary">{post.author}</td>
                  <td className="p-4 hidden lg:table-cell text-sm text-text-secondary">{formatDate(post.publishedAt)}</td>
                  <td className="p-4 text-center">{post.featured ? <span className="text-gold-DEFAULT">★</span> : <span className="text-text-muted">☆</span>}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(post)} className="p-2 rounded-lg text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
