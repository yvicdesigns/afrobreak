'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, ShoppingCart, Music, Download, Clock, Volume2, X, Check, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import PaystackCheckoutModal from '@/components/ui/PaystackCheckoutModal'
import { getTracks, getAlbums } from '@/lib/db'

type MusicGenre = 'All' | 'Afrobeats' | 'Amapiano' | 'Dancehall' | 'Afro-Fusion' | 'Hip-Hop'

interface Track {
  id: string
  title: string
  artist: string
  genre: string
  duration: string
  price: number
  cover: string
  preview: string
  album?: string
  badge?: string
}

interface Album {
  id: string
  title: string
  artist: string
  genre: string
  price: number
  cover: string
  track_count: number
}

const genres: MusicGenre[] = ['All', 'Afrobeats', 'Amapiano', 'Dancehall', 'Afro-Fusion', 'Hip-Hop']

export default function MusicPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [activeGenre, setActiveGenre] = useState<MusicGenre>('All')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [cart, setCart] = useState<string[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [tab, setTab] = useState<'tracks' | 'albums'>('tracks')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [albumCheckout, setAlbumCheckout] = useState<Album | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    Promise.all([getTracks(), getAlbums()]).then(([rawTracks, rawAlbums]) => {
      setTracks((rawTracks as Record<string, unknown>[]).map(t => ({
        id: t.id as string,
        title: t.title as string,
        artist: t.artist as string,
        genre: t.genre as string,
        duration: (t.duration as string) || '',
        price: (t.price as number) || 0,
        cover: (t.cover as string) || '',
        preview: (t.preview_url as string) || '',
        album: (t.album as string) || '',
        badge: (t.badge as string) || '',
      })))
      setAlbums((rawAlbums as Record<string, unknown>[]).map(a => ({
        id: a.id as string,
        title: a.title as string,
        artist: a.artist as string,
        genre: (a.genre as string) || '',
        price: (a.price as number) || 0,
        cover: (a.cover as string) || '',
        track_count: (a.track_count as number) || 0,
      })))
    })
    return () => { audioRef.current?.pause() }
  }, [])

  const filtered = activeGenre === 'All' ? tracks : tracks.filter(t => t.genre === activeGenre)
  const cartItems = tracks.filter(t => cart.includes(t.id))
  const cartTotal = cartItems.reduce((sum: number, t: Track) => sum + t.price, 0)

  const togglePlay = (track: Track) => {
    if (playingId === track.id) {
      setPlayingId(null)
      audioRef.current?.pause()
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = track.preview || ''
        audioRef.current.play().catch(() => {})
      }
      setPlayingId(track.id)
    }
  }

  const addToCart = (trackId: string) => {
    if (!cart.includes(trackId)) {
      setCart(prev => [...prev, trackId])
      setAddedId(trackId)
      setTimeout(() => setAddedId(null), 1500)
    }
  }

  const removeFromCart = (trackId: string) => setCart(prev => prev.filter(id => id !== trackId))

  return (
    <div className="min-h-screen pt-20 bg-background">
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} preload="none" />

      {/* Hero */}
      <div className="relative bg-surface border-b border-white/5 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 via-transparent to-primary-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-3">AfroBreak Music</p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Feel the <span className="gradient-text-purple">Rhythm</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            Preview and purchase exclusive Afro & urban music tracks. Download instantly, own forever.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-text-secondary">
            <div className="flex items-center gap-2"><Download size={14} className="text-primary-500" /> Instant download</div>
            <div className="flex items-center gap-2"><Music size={14} className="text-secondary-400" /> MP3 & WAV formats</div>
            <div className="flex items-center gap-2"><Volume2 size={14} className="text-gold-DEFAULT" /> 30-sec preview</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs + Cart */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex gap-1 bg-surface rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setTab('tracks')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'tracks' ? 'bg-primary-500 text-white' : 'text-text-secondary hover:text-white'}`}
            >
              Tracks
            </button>
            <button
              onClick={() => setTab('albums')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'albums' ? 'bg-primary-500 text-white' : 'text-text-secondary hover:text-white'}`}
            >
              Albums
            </button>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-xl text-sm font-medium text-white hover:border-primary-500/40 transition-all"
          >
            <ShoppingCart size={16} className="text-primary-500" />
            My Purchases
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {tab === 'tracks' && (
          <>
            {/* Genre filters */}
            <div className="flex gap-2 flex-wrap mb-8">
              {genres.map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeGenre === g
                      ? 'bg-secondary-500 text-white'
                      : 'bg-surface border border-white/10 text-text-secondary hover:text-white hover:border-white/20'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Tracks list */}
            <div className="space-y-3">
              {filtered.map((track, i) => (
                <div
                  key={track.id}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                    playingId === track.id
                      ? 'bg-primary-500/10 border-primary-500/30'
                      : 'bg-surface border-white/5 hover:border-white/15'
                  }`}
                >
                  {/* Index / Play */}
                  <button
                    onClick={() => togglePlay(track)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary-500/20 transition-all flex-shrink-0"
                  >
                    {playingId === track.id
                      ? <Pause size={16} className="text-primary-500" />
                      : <span className="text-text-muted text-sm group-hover:hidden">{i + 1}</span>
                    }
                    {playingId !== track.id && <Play size={16} className="text-primary-500 hidden group-hover:block" />}
                  </button>

                  {/* Cover */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white truncate">{track.title}</p>
                      {track.badge && (
                        <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-[10px] font-bold rounded-full flex-shrink-0">{track.badge}</span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary truncate">{track.artist} · {track.album}</p>
                  </div>

                  {/* Genre */}
                  <span className="hidden md:block text-xs text-text-muted bg-white/5 px-2 py-1 rounded-lg flex-shrink-0">{track.genre}</span>

                  {/* Duration */}
                  <div className="hidden sm:flex items-center gap-1 text-xs text-text-muted flex-shrink-0">
                    <Clock size={12} />
                    {track.duration}
                  </div>

                  {/* Price + Buy */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-white">GH₵{(track.price * 15.5).toFixed(2)}</span>
                    {cart.includes(track.id) ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl">
                        <Check size={12} /> Owned
                      </span>
                    ) : (
                      <button
                        onClick={() => addToCart(track.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          addedId === track.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-primary-500/15 text-primary-400 hover:bg-primary-500 hover:text-white border border-primary-500/30'
                        }`}
                      >
                        {addedId === track.id ? <><Check size={12} /> Added</> : <><ShoppingCart size={12} /> Buy</>}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'albums' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(album => (
              <div key={album.id} className="group bg-surface border border-white/5 rounded-2xl overflow-hidden hover:border-primary-500/20 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-secondary-500/80 text-white text-[10px] font-bold rounded-lg">{album.genre}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white mb-1">{album.title}</h3>
                  <p className="text-sm text-text-secondary mb-1">{album.artist}</p>
                  <p className="text-xs text-text-muted mb-4 flex items-center gap-1">
                    <Music size={11} /> {album.track_count} tracks
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-white">GH₵{(album.price * 15.5).toFixed(2)}</span>
                      <p className="text-xs text-text-muted">Full album</p>
                    </div>
                    <Button variant="primary" size="sm" leftIcon={<Download size={14} />} onClick={() => setAlbumCheckout(album)}>
                      Buy Album
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-surface border-l border-white/10 flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music size={18} className="text-primary-500" />
                <h2 className="font-bold text-white">My Purchases ({cart.length})</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <Music size={40} className="text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary">No tracks selected</p>
                </div>
              ) : (
                cartItems.map(track => (
                  <div key={track.id} className="flex gap-3 p-3 bg-surface-2 rounded-xl border border-white/5">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{track.title}</p>
                      <p className="text-xs text-text-muted">{track.artist}</p>
                      <p className="text-sm font-bold text-primary-400 mt-1">GH₵{(track.price * 15.5).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(track.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Total</span>
                  <span className="text-xl font-black text-white">€{cartTotal.toFixed(2)}</span>
                </div>
                <Button variant="primary" fullWidth leftIcon={<Download size={16} />} onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}>
                  Buy & Download — GH₵{(cartTotal * 15.5).toFixed(2)}
                </Button>
                <p className="text-xs text-text-muted text-center">MP3 + WAV · Instant download · DRM-free</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Paystack Checkout — tracks */}
      {checkoutOpen && (
        <PaystackCheckoutModal
          type="music"
          items={cartItems.map(t => ({ id: t.id, name: t.title, price: t.price, cover: t.cover }))}
          totalUSD={cartTotal}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      {/* Paystack Checkout — album */}
      {albumCheckout && (
        <PaystackCheckoutModal
          type="music"
          items={[{ id: albumCheckout.id, name: albumCheckout.title, price: albumCheckout.price }]}
          totalUSD={albumCheckout.price}
          onClose={() => setAlbumCheckout(null)}
        />
      )}

      {/* Featured artist */}
      <div className="border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-secondary-500/15 to-primary-500/10 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80" alt="Featured" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-secondary-400 text-xs font-bold uppercase tracking-widest mb-1">Featured Artist</p>
              <h3 className="text-xl font-bold text-white mb-1">DJ AfroBreak</h3>
              <p className="text-text-secondary text-sm">The official AfroBreak DJ — blending Lagos rhythms with European club culture since 2015.</p>
            </div>
            <Button variant="secondary" rightIcon={<ChevronRight size={16} />}>
              View All Tracks
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
