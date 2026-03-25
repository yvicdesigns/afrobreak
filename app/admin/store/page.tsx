'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, Check, Lock, Unlock } from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/db'
import Button from '@/components/ui/Button'

const categories = ['Apparel', 'Accessories', 'Footwear', 'Digital']

const emptyForm = {
  name: '',
  description: '',
  price: '29.99',
  image: '',
  category: 'Apparel',
  sizes: '',
  colors: '',
  badge: '',
  in_stock: true,
}

type FormState = typeof emptyForm

function Field({ label, value, onChange, placeholder, required, type = 'text', textarea }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; type?: string; textarea?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1.5">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className="input-base resize-none" />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-base" />
      }
    </div>
  )
}

export default function AdminStorePage() {
  const [products, setProducts] = useState<Record<string, unknown>[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => { getProducts().then(setProducts) }, [])

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) return
    setSaving(true)
    const payload = {
      ...form,
      price: parseFloat(form.price),
      sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
    }
    if (editId) {
      await updateProduct(editId, payload)
      setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...payload } : p))
      flash('Product updated!')
    } else {
      const created = await createProduct(payload)
      if (created) setProducts(prev => [created, ...prev])
      flash('Product added!')
    }
    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    setEditId(null)
  }

  const handleEdit = (p: Record<string, unknown>) => {
    setForm({
      name: p.name as string || '',
      description: p.description as string || '',
      price: String(p.price || '29.99'),
      image: p.image as string || '',
      category: p.category as string || 'Apparel',
      sizes: (p.sizes as string[] || []).join(', '),
      colors: (p.colors as string[] || []).join(', '),
      badge: p.badge as string || '',
      in_stock: p.in_stock as boolean ?? true,
    })
    setEditId(p.id as string)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Store Products</h1>
          <p className="text-text-secondary text-sm">{products.length} products</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}
          onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(!showForm) }}>
          {showForm ? 'Cancel' : 'Add Product'}
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
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Product Name" required value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="AfroBreak Hoodie" />
              <Field label="Price (€)" required type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="29.99" />
              <div className="md:col-span-2">
                <Field label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Describe the product..." textarea />
              </div>
              <div className="md:col-span-2">
                <Field label="Image URL" value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-base">
                  {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
                </select>
              </div>
              <Field label="Badge (optional)" value={form.badge} onChange={v => setForm(f => ({ ...f, badge: v }))} placeholder="New, Best Seller, Limited..." />
              <Field label="Sizes (comma-separated)" value={form.sizes} onChange={v => setForm(f => ({ ...f, sizes: v }))} placeholder="XS, S, M, L, XL" />
              <Field label="Colors (comma-separated)" value={form.colors} onChange={v => setForm(f => ({ ...f, colors: v }))} placeholder="Black, White, Orange" />
              <div className="md:col-span-2">
                <button type="button" onClick={() => setForm(f => ({ ...f, in_stock: !f.in_stock }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${form.in_stock ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' : 'bg-surface-2 text-text-secondary border-white/10'}`}>
                  {form.in_stock ? <><Unlock size={15} /> In Stock</> : <><Lock size={15} /> Out of Stock</>}
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Button type="submit" variant="primary" loading={saving}>{editId ? 'Update Product' : 'Save Product'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="text-center p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Stock</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-text-secondary text-sm">No products yet. Add your first product!</td></tr>
              ) : products.map(product => (
                <tr key={product.id as string} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={product.image as string} alt={product.name as string} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{product.name as string}</p>
                        {product.badge && <span className="text-[10px] text-primary-400">{product.badge as string}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell"><span className="text-xs text-text-secondary">{product.category as string}</span></td>
                  <td className="p-4 text-center">
                    {product.in_stock
                      ? <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">IN STOCK</span>
                      : <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-bold">OUT</span>
                    }
                  </td>
                  <td className="p-4 text-right"><span className="text-sm font-bold text-white">€{(product.price as number)?.toFixed(2)}</span></td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 rounded-lg text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(product.id as string)} className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
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
