'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, Check, Music, Disc, ChevronDown, ChevronUp, Link2 } from 'lucide-react'
import { getTracks, createTrack, updateTrack, deleteTrack, getAlbums, createAlbum, updateAlbum, deleteAlbum } from '@/lib/db'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/ui/ImageUpload'
import AudioUpload from '@/components/ui/AudioUpload'

const genres = ['Afrobeats', 'Amapiano', 'Dancehall', 'Afro-Fusion', 'Hip-Hop']

const emptyTrack = { title: '', artist: '', genre: 'Afrobeats', duration: '', price: '1.99', cover: '', preview_url: '', download_url: '', album: '', badge: '' }
const emptyAlbum = { title: '', artist: '', genre: 'Afrobeats', price: '9.99', cover: '', track_count: '0', description: '', download_url: '' }

type TrackForm = typeof emptyTrack
type AlbumForm = typeof emptyAlbum
type TrackRow = { id: string; title: string; artist: string; genre: string; duration: string; price: number; cover: string; preview_url: string; download_url: string; album: string; badge: string; in_stock: boolean }
type AlbumRow = { id: string; title: string; artist: string; genre: string; price: number; cover: string; track_count: number; description: string; download_url: string }

function Field({ label, value, onChange, placeholder, required, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; required?: boolean; type?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1.5">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="input-base" />
    </div>
  )
}

export default function AdminMusicPage() {
  const [tab, setTab] = useState<'tracks' | 'albums'>('tracks')
  const [tracks, setTracks] = useState<TrackRow[]>([])
  const [albums, setAlbums] = useState<AlbumRow[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [trackForm, setTrackForm] = useState<TrackForm>(emptyTrack)
  const [albumForm, setAlbumForm] = useState<AlbumForm>(emptyAlbum)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    getTracks().then(data => setTracks(data as TrackRow[]))
    getAlbums().then(data => setAlbums(data as AlbumRow[]))
  }, [])

  const [formError, setFormError] = useState('')
  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000) }

  // --- TRACK HANDLERS ---
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackForm.title || !trackForm.artist) return
    setSaving(true)
    const payload = { ...trackForm, price: parseFloat(trackForm.price), in_stock: true }
    if (editId) {
      await updateTrack(editId, payload)
      setTracks(prev => prev.map(t => t.id === editId ? { ...t, ...payload } as TrackRow : t))
      flash('Track updated!')
    } else {
      const created = await createTrack(payload)
      if (created) setTracks(prev => [created as TrackRow, ...prev])
      flash('Track added!')
    }
    setSaving(false)
    setTrackForm(emptyTrack)
    setShowForm(false)
    setEditId(null)
  }

  const handleTrackEdit = (t: TrackRow) => {
    setTrackForm({
      title: t.title || '',
      artist: t.artist || '',
      genre: t.genre || 'Afrobeats',
      duration: t.duration || '',
      price: String(t.price || '1.99'),
      cover: t.cover || '',
      preview_url: t.preview_url || '',
      download_url: t.download_url || '',
      album: t.album || '',
      badge: t.badge || '',
    })
    setEditId(t.id)
    setShowForm(true)
  }

  const handleTrackDelete = async (id: string) => {
    if (!confirm('Delete this track?')) return
    await deleteTrack(id)
    setTracks(prev => prev.filter(t => t.id !== id))
  }

  // --- ALBUM HANDLERS ---
  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!albumForm.title || !albumForm.artist) return
    setSaving(true)
    const payload = { ...albumForm, price: parseFloat(albumForm.price), track_count: parseInt(albumForm.track_count) }
    if (editId) {
      await updateAlbum(editId, payload)
      setAlbums(prev => prev.map(a => a.id === editId ? { ...a, ...payload } as AlbumRow : a))
      flash('Album updated!')
    } else {
      const created = await createAlbum(payload)
      if (created) {
        setAlbums(prev => [created as AlbumRow, ...prev])
        flash('Album added!')
      } else {
        setFormError('Failed to save album. Make sure you ran the SQL to add description and download_url columns in Supabase.')
        setSaving(false)
        return
      }
    }
    setSaving(false)
    setAlbumForm(emptyAlbum)
    setShowForm(false)
    setEditId(null)
  }

  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null)

  const handleAlbumEdit = (a: AlbumRow) => {
    setAlbumForm({
      title: a.title || '',
      artist: a.artist || '',
      genre: a.genre || 'Afrobeats',
      price: String(a.price || '9.99'),
      cover: a.cover || '',
      track_count: String(a.track_count || '0'),
      description: a.description || '',
      download_url: a.download_url || '',
    })
    setEditId(a.id)
    setShowForm(true)
  }

  const handleAlbumDelete = async (id: string) => {
    if (!confirm('Delete this album?')) return
    await deleteAlbum(id)
    setAlbums(prev => prev.filter(a => a.id !== id))
  }

  const openAdd = () => {
    setEditId(null)
    tab === 'tracks' ? setTrackForm(emptyTrack) : setAlbumForm(emptyAlbum)
    setShowForm(!showForm)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Music</h1>
          <p className="text-text-secondary text-sm">{tracks.length} tracks · {albums.length} albums</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openAdd}>
          {showForm ? 'Cancel' : tab === 'tracks' ? 'Add Track' : 'Add Album'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 border border-white/10 w-fit">
        {(['tracks', 'albums'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setShowForm(false); setEditId(null) }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-primary-500 text-white' : 'text-text-secondary hover:text-white'}`}>
            {t === 'tracks' ? <Music size={14} /> : <Disc size={14} />}
            {t === 'tracks' ? 'Tracks' : 'Albums'}
          </button>
        ))}
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl p-4">
          <Check size={16} /> {success}
        </div>
      )}

      {/* TRACK FORM */}
      {showForm && tab === 'tracks' && (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Track' : 'Add New Track'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
          </div>
          <form onSubmit={handleTrackSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Title" required value={trackForm.title} onChange={v => setTrackForm(f => ({ ...f, title: v }))} placeholder="Track title" />
              <Field label="Artist" required value={trackForm.artist} onChange={v => setTrackForm(f => ({ ...f, artist: v }))} placeholder="Artist name" />
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Genre</label>
                <select value={trackForm.genre} onChange={e => setTrackForm(f => ({ ...f, genre: e.target.value }))} className="input-base">
                  {genres.map(g => <option key={g} value={g} className="bg-surface">{g}</option>)}
                </select>
              </div>
              <Field label="Duration" value={trackForm.duration} onChange={v => setTrackForm(f => ({ ...f, duration: v }))} placeholder="3:45" />
              <Field label="Price (€)" type="number" value={trackForm.price} onChange={v => setTrackForm(f => ({ ...f, price: v }))} placeholder="1.99" />
              <Field label="Album" value={trackForm.album} onChange={v => setTrackForm(f => ({ ...f, album: v }))} placeholder="Album name" />
              <div className="md:col-span-2">
                <ImageUpload label="Cover Image" value={trackForm.cover} onChange={v => setTrackForm(f => ({ ...f, cover: v }))} folder="music" />
              </div>
              <div className="md:col-span-2">
                <AudioUpload
                  label="Preview File (30-sec clip — plays on the music page)"
                  value={trackForm.preview_url}
                  onChange={v => setTrackForm(f => ({ ...f, preview_url: v }))}
                  maxMB={10}
                />
              </div>
              <div className="md:col-span-2">
                <AudioUpload
                  label="Full Track Download (sent to buyer after purchase)"
                  value={trackForm.download_url}
                  onChange={v => setTrackForm(f => ({ ...f, download_url: v }))}
                  maxMB={100}
                />
              </div>
              <Field label="Badge (optional)" value={trackForm.badge} onChange={v => setTrackForm(f => ({ ...f, badge: v }))} placeholder="New, Hot, Best Seller..." />
            </div>
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Button type="submit" variant="primary" loading={saving}>{editId ? 'Update Track' : 'Save Track'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* ALBUM FORM */}
      {showForm && tab === 'albums' && (
        <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-slide-down">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{editId ? 'Edit Album' : 'Add New Album'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-all"><X size={18} /></button>
          </div>
          <form onSubmit={handleAlbumSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Album Title" required value={albumForm.title} onChange={v => setAlbumForm(f => ({ ...f, title: v }))} placeholder="Album name" />
              <Field label="Artist" required value={albumForm.artist} onChange={v => setAlbumForm(f => ({ ...f, artist: v }))} placeholder="Artist name" />
              <div>
                <label className="block text-sm font-medium text-white mb-1.5">Genre</label>
                <select value={albumForm.genre} onChange={e => setAlbumForm(f => ({ ...f, genre: e.target.value }))} className="input-base">
                  {genres.map(g => <option key={g} value={g} className="bg-surface">{g}</option>)}
                </select>
              </div>
              <Field label="Price (GH₵)" type="number" value={albumForm.price} onChange={v => setAlbumForm(f => ({ ...f, price: v }))} placeholder="9.99" />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1.5">Description</label>
                <textarea
                  value={albumForm.description}
                  onChange={e => setAlbumForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe this album..."
                  rows={3}
                  className="input-base resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <ImageUpload label="Cover Image" value={albumForm.cover} onChange={v => setAlbumForm(f => ({ ...f, cover: v }))} folder="music" />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Full Album Download URL"
                  value={albumForm.download_url}
                  onChange={v => setAlbumForm(f => ({ ...f, download_url: v }))}
                  placeholder="https://drive.google.com/... or Dropbox link to ZIP"
                />
                <p className="text-xs text-text-muted mt-1">Buyers receive this link by email after purchase. Use Google Drive, Dropbox, or any direct download URL.</p>
              </div>
              <div className="bg-white/3 border border-white/10 rounded-xl p-4 md:col-span-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Linked Tracks</p>
                {tracks.filter(t => t.album === albumForm.title).length === 0 ? (
                  <p className="text-xs text-text-muted">
                    No tracks linked yet. Add tracks and set their <strong className="text-white">Album</strong> field to <strong className="text-primary-400">&quot;{albumForm.title || 'this album title'}&quot;</strong>.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {tracks.filter(t => t.album === albumForm.title).map(t => (
                      <div key={t.id} className="flex items-center gap-2 text-xs text-text-secondary">
                        <Music size={10} className="text-primary-400" />
                        <span className="text-white">{t.title}</span>
                        <span>·</span>
                        <span>{t.artist}</span>
                        <span>·</span>
                        <span>{t.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {formError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {formError}
              </div>
            )}
            <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
              <Button type="submit" variant="primary" loading={saving}>{editId ? 'Update Album' : 'Save Album'}</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditId(null); setFormError('') }}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* TRACKS TABLE */}
      {tab === 'tracks' && (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Track</th>
                  <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Genre</th>
                  <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Duration</th>
                  <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                  <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tracks.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-text-secondary text-sm">No tracks yet. Add your first track!</td></tr>
                ) : tracks.map(track => (
                  <tr key={track.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {!!track.cover && (
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{track.title}</p>
                          <p className="text-xs text-text-secondary">{track.artist}{track.album ? ` · ${track.album}` : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell"><span className="text-xs text-text-secondary">{track.genre}</span></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-xs text-text-secondary">{track.duration}</span></td>
                    <td className="p-4 text-right"><span className="text-sm font-bold text-white">€{track.price?.toFixed(2)}</span></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleTrackEdit(track)} className="p-2 rounded-lg text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit3 size={15} /></button>
                        <button onClick={() => handleTrackDelete(track.id)} className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALBUMS TABLE */}
      {tab === 'albums' && (
        <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Album</th>
                  <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Genre</th>
                  <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Tracks</th>
                  <th className="text-left p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Download</th>
                  <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                  <th className="text-right p-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {albums.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-text-secondary text-sm">No albums yet. Add your first album!</td></tr>
                ) : albums.map(album => {
                  const linkedTracks = tracks.filter(t => t.album === album.title)
                  const isExpanded = expandedAlbum === album.id
                  return (
                    <>
                      <tr key={album.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {!!album.cover && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-white">{album.title}</p>
                              <p className="text-xs text-text-secondary">{album.artist}</p>
                              {album.description && <p className="text-xs text-text-muted mt-0.5 line-clamp-1 max-w-[200px]">{album.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell"><span className="text-xs text-text-secondary">{album.genre}</span></td>
                        <td className="p-4 hidden md:table-cell">
                          <button
                            onClick={() => setExpandedAlbum(isExpanded ? null : album.id)}
                            className="flex items-center gap-1 text-xs text-text-secondary hover:text-white transition-colors"
                          >
                            <Music size={11} className="text-primary-400" />
                            {linkedTracks.length} linked
                            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          {album.download_url
                            ? <span className="flex items-center gap-1 text-xs text-emerald-400"><Link2 size={11} /> Set</span>
                            : <span className="text-xs text-text-muted">—</span>
                          }
                        </td>
                        <td className="p-4 text-right"><span className="text-sm font-bold text-white">GH₵{album.price?.toFixed(2)}</span></td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleAlbumEdit(album)} className="p-2 rounded-lg text-text-secondary hover:text-blue-400 hover:bg-blue-500/10 transition-all"><Edit3 size={15} /></button>
                            <button onClick={() => handleAlbumDelete(album.id)} className="p-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${album.id}-tracks`} className="border-b border-white/5 bg-white/2">
                          <td colSpan={6} className="px-6 py-4">
                            {linkedTracks.length === 0 ? (
                              <p className="text-xs text-text-muted">No tracks linked to this album yet. Add tracks and set their Album field to &quot;{album.title}&quot;.</p>
                            ) : (
                              <div className="space-y-2">
                                {linkedTracks.map((t, i) => (
                                  <div key={t.id} className="flex items-center gap-3 text-xs">
                                    <span className="text-text-muted w-4">{i + 1}</span>
                                    {t.cover && <img src={t.cover} alt={t.title} className="w-7 h-7 rounded object-cover" />}
                                    <span className="text-white font-medium">{t.title}</span>
                                    <span className="text-text-muted">·</span>
                                    <span className="text-text-secondary">{t.artist}</span>
                                    <span className="text-text-muted">·</span>
                                    <span className="text-text-muted">{t.duration}</span>
                                    <span className="ml-auto text-primary-400 font-bold">GH₵{(t.price * 15.5).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
