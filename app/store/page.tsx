'use client'

import { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, ShoppingBag, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import type { Product, CartItem, ProductCategory } from '@/lib/types'
import Button from '@/components/ui/Button'

const products: Product[] = [
  {
    id: 'p1',
    name: 'AfroBreak Classic Hoodie',
    description: 'Premium heavyweight hoodie with embroidered AfroBreak logo. Perfect for dance sessions or casual wear.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
    category: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Orange'],
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'p2',
    name: 'AfroBreak Dance Tee',
    description: 'Lightweight breathable t-shirt designed for movement. 100% organic cotton with moisture-wicking technology.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    category: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Orange', 'Purple'],
    inStock: true,
  },
  {
    id: 'p3',
    name: 'Culture Snapback Cap',
    description: 'Structured snapback with AfroBreak embroidery. One size fits all with adjustable snap closure.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80',
    category: 'Accessories',
    colors: ['Black', 'White'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p4',
    name: 'AfroBreak Dance Joggers',
    description: 'Ultra-flexible joggers built for dancers. Tapered fit with deep pockets and elastic waistband.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4346?w=600&q=80',
    category: 'Apparel',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Grey'],
    inStock: true,
  },
  {
    id: 'p5',
    name: 'Afro Roots Tote Bag',
    description: 'Heavy-duty canvas tote bag with AfroBreak print. Spacious enough for all your dance gear.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80',
    category: 'Accessories',
    colors: ['Black', 'Natural'],
    inStock: true,
  },
  {
    id: 'p6',
    name: 'Dance Crew Windbreaker',
    description: 'Lightweight windbreaker jacket with full-zip closure. Water-resistant and packable.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Orange'],
    badge: 'Limited',
    inStock: true,
  },
  {
    id: 'p7',
    name: 'AfroBreak Wristband Set',
    description: 'Set of 3 silicone wristbands in AfroBreak brand colors. Show your culture everywhere.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80',
    category: 'Accessories',
    inStock: true,
  },
  {
    id: 'p8',
    name: 'Premium Dance Shoes',
    description: 'Professional split-sole dance shoes with suede bottom. Perfect for Afro and urban styles.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    category: 'Footwear',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    colors: ['Black', 'White', 'Nude'],
    badge: 'Pro Pick',
    inStock: true,
  },
]

const categories: ('All' | ProductCategory)[] = ['All', 'Apparel', 'Accessories', 'Footwear', 'Digital']

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState<'All' | ProductCategory>('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [addedId, setAddedId] = useState<string | null>(null)

  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const openProduct = (product: Product) => {
    setSelectedProduct(product)
    setSelectedSize(product.sizes?.[0] || '')
    setSelectedColor(product.colors?.[0] || '')
  }

  const addToCart = (product: Product, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size && i.color === color)
      if (existing) return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1, size, color }]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
    setSelectedProduct(null)
  }

  const updateQty = (index: number, delta: number) => {
    setCart(prev => prev.map((item, i) => {
      if (i !== index) return item
      const qty = item.quantity + delta
      return qty <= 0 ? null : { ...item, quantity: qty }
    }).filter(Boolean) as CartItem[])
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hero */}
      <div className="bg-surface border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">AfroBreak Store</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Wear the <span className="gradient-text-orange">Culture</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Official AfroBreak merchandise. Dance gear, apparel, and accessories crafted for the community.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
            {[
              { icon: Truck, text: 'Free shipping over €50' },
              { icon: Shield, text: 'Secure payment' },
              { icon: RotateCcw, text: '30-day returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-text-secondary">
                <Icon size={15} className="text-primary-500" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters + Cart button */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface border border-white/10 text-text-secondary hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-xl text-sm font-medium text-white hover:border-primary-500/40 transition-all"
          >
            <ShoppingCart size={16} className="text-primary-500" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <div
              key={product.id}
              className="group bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary-500/20 transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-primary-500 text-white text-[10px] font-bold rounded-lg uppercase">
                    {product.badge}
                  </span>
                )}
                {addedId === product.id && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <span className="bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-xl">Added!</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-text-muted mb-1">{product.category}</p>
                <h3 className="font-bold text-white mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white">€{product.price.toFixed(2)}</span>
                  <Button variant="primary" size="sm" onClick={() => openProduct(product)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-xl animate-slide-down overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-bold text-white">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="flex gap-4 p-5">
              <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-sm text-text-secondary">{selectedProduct.description}</p>
                <p className="text-xl font-black text-white">€{selectedProduct.price.toFixed(2)}</p>

                {selectedProduct.sizes && (
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            selectedSize === s
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'border-white/10 text-text-secondary hover:border-white/30'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.colors && (
                  <div>
                    <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Color: {selectedColor}</p>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                            selectedColor === c
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'border-white/10 text-text-secondary hover:border-white/30'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 pt-0">
              <Button
                variant="primary"
                fullWidth
                leftIcon={<ShoppingCart size={16} />}
                onClick={() => addToCart(selectedProduct, selectedSize, selectedColor)}
              >
                Add to Cart — €{selectedProduct.price.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-surface border-l border-white/10 flex flex-col h-full animate-slide-down">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary-500" />
                <h2 className="font-bold text-white">Your Cart ({cartCount})</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart size={40} className="text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-surface-2 rounded-xl border border-white/5">
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-text-muted">{[item.size, item.color].filter(Boolean).join(' · ')}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(i, -1)} className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                            <Minus size={10} />
                          </button>
                          <span className="text-sm text-white font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(i, 1)} className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                            <Plus size={10} />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-white">€{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total</span>
                  <span className="text-xl font-black text-white">€{cartTotal.toFixed(2)}</span>
                </div>
                {cartTotal < 50 && (
                  <p className="text-xs text-text-muted text-center">
                    Add €{(50 - cartTotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <Button variant="primary" fullWidth leftIcon={<ShoppingCart size={16} />}>
                  Checkout — €{cartTotal.toFixed(2)}
                </Button>
                <Button variant="ghost" fullWidth onClick={() => setCartOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews section */}
      <div className="border-t border-white/5 py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">What the community says</h2>
          <div className="flex justify-center gap-1 mb-8">
            {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-gold-DEFAULT fill-gold-DEFAULT" />)}
            <span className="text-text-secondary text-sm ml-2">4.9 / 5 based on 240+ reviews</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Sofia M.', text: 'The hoodie is incredible quality. Wearing it to every class!', rating: 5 },
              { name: 'Kwame A.', text: 'Dance joggers are perfect — finally something made for dancers.', rating: 5 },
              { name: 'Amina D.', text: 'Love the tote bag. Fits all my gear and looks fire.', rating: 5 },
            ].map(review => (
              <div key={review.name} className="bg-surface border border-white/5 rounded-2xl p-5 text-left">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-gold-DEFAULT fill-gold-DEFAULT" />)}
                </div>
                <p className="text-sm text-text-secondary mb-3 italic">&ldquo;{review.text}&rdquo;</p>
                <p className="text-sm font-semibold text-white">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
