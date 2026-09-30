'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Save, ExternalLink, Newspaper, Film } from 'lucide-react'
import {
  getPresscoverage, createPressCoverage, updatePressCoverage, deletePressCoverage,
  getDocumentaries, createDocumentary, updateDocumentary, deleteDocumentary,
} from '@/lib/db'
import ImageUpload from '@/components/ui/ImageUpload'

const DOC_SQL = `create table if not exists documentaries (
  id text primary key,
  title text not null,
  description text,
  year text,
  url text,
  thumbnail text,
  created_at timestamptz default now()
);
alter table documentaries enable row level security;
create policy "Public read documentaries" on documentaries for select using (true);
create policy "Auth write documentaries" on documentaries for all to authenticated using (true) with check (true);`

type PressItem = { id: string; outlet: string; title: string; date: string; type: string; logo: string; url: string }
type Documentary = { id: string; title: string; description: string; year: string; url: string; thumbnail: string }

const emptyPress: Omit<PressItem, 'id'> = { outlet: '', title: '', date: '', type: 'Feature', logo: '📰', url: '' }
const emptyDoc: Omit<Documentary, 'id'> = { title: '', description: '', year: new Date().getFullYear().toString(), url: '', thumbnail: '' }

const defaultDocs: Omit<Documentary, 'id'>[] = [
  { title: 'Root of the Culture', description: 'Documentary premiere following the journey of African breakers on their path to the AfroBreak Africa Final. Premiered July 19, 2025.', year: '2025', url: 'https://afrobreak.com/root-of-the-culture-premiere-on-july-19-2025/', thumbnail: '' },
  { title: 'Akwaaba AfroBreak', description: 'Official dance video celebrating the AfroBreak movement and its cultural roots across the African continent.', year: '2025', url: 'https://afrobreak.com/akwaaba-afrobreak-music-official-dance-video/', thumbnail: '' },
  { title: 'Cultural Journey Exhibition', description: 'Bboy Lyricx chronicles his journey through 36+ countries as a cultural ambassador for African breaking and hiphop culture.', year: '2024', url: 'https://afrobreak.com/ghana-breakdance-pioneer-bboy-lyricx-launches-cultural-journey-exhibition/', thumbnail: '' },
]

const defaultCoverage: Omit<PressItem, 'id'>[] = [
  { outlet: 'MyJoyOnline', title: 'Afro Break championship set for October 27 in Accra', date: 'October 2024', type: 'News', logo: '🗞️', url: 'https://www.myjoyonline.com/afro-break-championship-set-for-october-27-in-accra/' },
  { outlet: 'News Ghana', title: "Ghana hosts fourth AfroBreak championship amid breaking's Olympic recognition", date: 'November 2024', type: 'Feature', logo: '📰', url: 'https://www.newsghana.com.gh/ghana-hosts-fourth-afrobreak-championship-amid-breakings-olympic-recognition/' },
  { outlet: 'MyJoyOnline', title: 'South Africa, Benin claim top prizes at AfroBreak championships', date: 'November 2024', type: 'News', logo: '🗞️', url: 'https://www.myjoyonline.com/south-africa-benin-claim-top-prizes-at-afrobreak-championships/' },
  { outlet: 'News Ghana', title: 'Ghana breakdance pioneer launches Cultural Journey exhibition', date: 'October 2024', type: 'Feature', logo: '📰', url: 'https://www.newsghana.com.gh/ghana-breakdance-pioneer-launches-cultural-journey-exhibition/' },
  { outlet: 'AfroBreak', title: 'Root of the Culture — Premiere on July 19, 2025', date: 'July 2025', type: 'Event', logo: '🎬', url: 'https://afrobreak.com/root-of-the-culture-premiere-on-july-19-2025/' },
  { outlet: 'AfroBreak', title: 'Akwaaba AfroBreak Music — Official Dance Video', date: 'June 2025', type: 'Release', logo: '🎵', url: 'https://afrobreak.com/akwaaba-afrobreak-music-official-dance-video/' },
  { outlet: 'AfroBreak', title: 'Ghana breakdance pioneer Bboy Lyricx launches Cultural Journey exhibition', date: 'October 2024', type: 'Feature', logo: '🎨', url: 'https://afrobreak.com/ghana-breakdance-pioneer-bboy-lyricx-launches-cultural-journey-exhibition/' },
  { outlet: 'Ghana Talk News', title: 'Breaking Federation of Ghana start preparations for 2026 Youth Olympics', date: 'January 2025', type: 'News', logo: '🏅', url: 'https://www.ghanatalknews.com/breaking-federation-of-ghana-start-preparations-for-2026-youth-olympics/' },
  { outlet: 'AfroBreak', title: 'KGL Foundation and ABA partner to empower girls using break dance and hiphop culture in Tamale', date: 'February 2025', type: 'Impact', logo: '🌍', url: 'https://afrobreak.com/kgl-foundation-and-aba-partnered-to-empower-girls-using-break-dance-and-hiphop-culture-in-tamale-northern-ghana/' },
]

type ActiveTab = 'press' | 'documentaries'

export default function AdminPressPage() {
  const [tab, setTab] = useState<ActiveTab>('documentaries')

  // Press state
  const [pressItems, setPressItems] = useState<PressItem[]>([])
  const [pressLoading, setPressLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [pressModal, setPressModal] = useState<null | 'create' | PressItem>(null)
  const [pressForm, setPressForm] = useState<Omit<PressItem, 'id'>>(emptyPress)
  const [pressSaving, setPressSaving] = useState(false)

  // Documentaries state
  const [docs, setDocs] = useState<Documentary[]>([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [docSqlCopied, setDocSqlCopied] = useState(false)
  const [docDbError, setDocDbError] = useState(false)
  const [docSeeding, setDocSeeding] = useState(false)
  const [docModal, setDocModal] = useState<null | 'create' | Documentary>(null)
  const [docForm, setDocForm] = useState<Omit<Documentary, 'id'>>(emptyDoc)
  const [docSaving, setDocSaving] = useState(false)

  useEffect(() => {
    getPresscoverage().then(data => { setPressItems(data as PressItem[]); setPressLoading(false) })
    getDocumentaries().then(data => {
      setDocs(data as Documentary[])
      setDocsLoading(false)
    }).catch(() => { setDocDbError(true); setDocsLoading(false) })
  }, [])

  // Press handlers
  const seedPress = async () => {
    setSeeding(true)
    for (let i = 0; i < defaultCoverage.length; i++) {
      await createPressCoverage({ ...defaultCoverage[i], id: `pc${Date.now()}${i}` } as Record<string, unknown>)
    }
    const data = await getPresscoverage()
    setPressItems(data as PressItem[])
    setSeeding(false)
  }

  const savePress = async () => {
    setPressSaving(true)
    if (pressModal === 'create') {
      const created = await createPressCoverage(pressForm as Record<string, unknown>)
      if (created) setPressItems(prev => [created as PressItem, ...prev])
    } else if (pressModal && typeof pressModal === 'object') {
      await updatePressCoverage(pressModal.id, pressForm as Record<string, unknown>)
      setPressItems(prev => prev.map(p => p.id === (pressModal as PressItem).id ? { ...p, ...pressForm } : p))
    }
    setPressSaving(false)
    setPressModal(null)
  }

  const deletePress = async (id: string) => {
    if (!confirm('Delete this press item?')) return
    await deletePressCoverage(id)
    setPressItems(prev => prev.filter(p => p.id !== id))
  }

  // Documentary handlers
  const seedDocs = async () => {
    setDocSeeding(true)
    for (let i = 0; i < defaultDocs.length; i++) {
      await createDocumentary({ ...defaultDocs[i], id: `doc${Date.now()}${i}` } as Record<string, unknown>)
    }
    const data = await getDocumentaries()
    setDocs(data as Documentary[])
    setDocSeeding(false)
  }

  const saveDoc = async () => {
    setDocSaving(true)
    if (docModal === 'create') {
      const created = await createDocumentary(docForm as Record<string, unknown>)
      if (created) setDocs(prev => [created as Documentary, ...prev])
    } else if (docModal && typeof docModal === 'object') {
      await updateDocumentary(docModal.id, docForm as Record<string, unknown>)
      setDocs(prev => prev.map(d => d.id === (docModal as Documentary).id ? { ...d, ...docForm } : d))
    }
    setDocSaving(false)
    setDocModal(null)
  }

  const deleteDoc = async (id: string) => {
    if (!confirm('Delete this documentary?')) return
    await deleteDocumentary(id)
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Press & Media</h1>
          <p className="text-text-secondary text-sm mt-1">Gérer la presse et les documentaires</p>
        </div>
        <button
          onClick={() => tab === 'press' ? (setPressForm(emptyPress), setPressModal('create')) : (setDocForm(emptyDoc), setDocModal('create'))}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-[#0D0A1A] rounded-xl hover:bg-primary-400 transition-colors text-sm font-semibold"
        >
          <Plus size={16} /> {tab === 'press' ? 'Add Coverage' : 'Add Documentary'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface border border-white/5 rounded-xl w-fit">
        <button onClick={() => setTab('documentaries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'documentaries' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-text-secondary hover:text-white'}`}>
          <Film size={14} /> Documentaries ({docs.length})
        </button>
        <button onClick={() => setTab('press')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'press' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-text-secondary hover:text-white'}`}>
          <Newspaper size={14} /> Press Coverage ({pressItems.length})
        </button>
      </div>

      {/* ── DOCUMENTARIES TAB ── */}
      {tab === 'documentaries' && (
        <>
          {docDbError && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-300">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Table not found. Run this SQL in Supabase:</p>
                <button onClick={() => { navigator.clipboard.writeText(DOC_SQL); setDocSqlCopied(true); setTimeout(() => setDocSqlCopied(false), 2000) }}
                  className="text-xs px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-colors">
                  {docSqlCopied ? '✓ Copied' : 'Copy SQL'}
                </button>
              </div>
              <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap">{DOC_SQL}</pre>
            </div>
          )}

          {!docDbError && docs.length === 0 && !docsLoading && (
            <div className="p-5 bg-primary-500/10 border border-primary-500/30 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-sm">Aucun documentaire dans la base de données</p>
                <p className="text-text-secondary text-xs mt-0.5">Importer les {defaultDocs.length} documentaires actuels</p>
              </div>
              <button onClick={seedDocs} disabled={docSeeding}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-[#0D0A1A] rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60 flex-shrink-0">
                {docSeeding ? <><div className="w-3.5 h-3.5 border-2 border-[#0D0A1A] border-t-transparent rounded-full animate-spin" /> Importation...</> : '⬆ Charger les données'}
              </button>
            </div>
          )}

          {docsLoading ? (
            <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {docs.map(doc => (
                <div key={doc.id} className="bg-surface border border-white/5 rounded-2xl overflow-hidden group hover:border-white/15 transition-all">
                  <div className="relative h-40 bg-white/5">
                    {doc.thumbnail
                      ? <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Film size={32} className="text-white/20" /></div>
                    }
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setDocForm({ title: doc.title, description: doc.description, year: doc.year, url: doc.url, thumbnail: doc.thumbnail }); setDocModal(doc) }}
                        className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => deleteDoc(doc.id)}
                        className="p-1.5 bg-red-500/60 hover:bg-red-500/80 text-white rounded-lg transition-colors"><Trash2 size={13} /></button>
                    </div>
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-lg">{doc.year}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-white text-sm mb-1 truncate">{doc.title}</p>
                    <p className="text-text-muted text-xs line-clamp-2">{doc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── PRESS COVERAGE TAB ── */}
      {tab === 'press' && (
        <>
          {pressItems.length === 0 && !pressLoading && (
            <div className="p-5 bg-primary-500/10 border border-primary-500/30 rounded-2xl flex items-center justify-between gap-4">
              <p className="text-white font-semibold text-sm">Aucune couverture presse</p>
              <button onClick={seedPress} disabled={seeding}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-[#0D0A1A] rounded-xl font-bold text-sm hover:bg-primary-400 transition-colors disabled:opacity-60 flex-shrink-0">
                {seeding ? <><div className="w-3.5 h-3.5 border-2 border-[#0D0A1A] border-t-transparent rounded-full animate-spin" /> Importation...</> : '⬆ Charger les données'}
              </button>
            </div>
          )}
          {pressLoading ? (
            <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {pressItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-surface border border-white/5 rounded-2xl hover:border-white/15 transition-all">
                  <span className="text-2xl flex-shrink-0">{item.logo}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white text-sm">{item.outlet}</span>
                      <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 text-[10px] font-bold rounded-full">{item.type}</span>
                    </div>
                    <p className="text-text-secondary text-sm truncate">{item.title}</p>
                    <p className="text-text-muted text-xs mt-0.5">{item.date}</p>
                  </div>
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary-400 transition-colors"><ExternalLink size={14} /></a>}
                  <div className="flex gap-2">
                    <button onClick={() => { setPressForm({ outlet: item.outlet, title: item.title, date: item.date, type: item.type, logo: item.logo, url: item.url }); setPressModal(item) }}
                      className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => deletePress(item.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── DOCUMENTARY MODAL ── */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{docModal === 'create' ? 'Add Documentary' : 'Edit Documentary'}</h2>
              <button onClick={() => setDocModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted"><X size={18} /></button>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Title *</label>
              <input value={docForm.title} onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))} className="input-base" placeholder="Documentary title" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Description</label>
              <textarea value={docForm.description} onChange={e => setDocForm(f => ({ ...f, description: e.target.value }))} className="input-base resize-none" rows={3} placeholder="Short description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Year</label>
                <input value={docForm.year} onChange={e => setDocForm(f => ({ ...f, year: e.target.value }))} className="input-base" placeholder="2025" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1">URL (link)</label>
                <input value={docForm.url} onChange={e => setDocForm(f => ({ ...f, url: e.target.value }))} className="input-base" placeholder="https://..." />
              </div>
            </div>
            <ImageUpload
              value={docForm.thumbnail}
              onChange={v => setDocForm(f => ({ ...f, thumbnail: v }))}
              label="Thumbnail (URL ou upload local)"
              folder="documentaries"
            />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDocModal(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={saveDoc} disabled={docSaving || !docForm.title}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-[#0D0A1A] rounded-xl text-sm font-semibold transition-colors">
                <Save size={14} /> {docSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRESS MODAL ── */}
      {pressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{pressModal === 'create' ? 'Add Press Coverage' : 'Edit Press Coverage'}</h2>
              <button onClick={() => setPressModal(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Outlet *</label>
                <input value={pressForm.outlet} onChange={e => setPressForm(f => ({ ...f, outlet: e.target.value }))} className="input-base" placeholder="e.g. Le Monde" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1">Type</label>
                <select value={pressForm.type} onChange={e => setPressForm(f => ({ ...f, type: e.target.value }))} className="input-base">
                  {['Feature', 'News', 'Interview', 'Event', 'Release', 'Impact'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Headline *</label>
              <input value={pressForm.title} onChange={e => setPressForm(f => ({ ...f, title: e.target.value }))} className="input-base" placeholder="Article headline..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white mb-1">Date</label>
                <input value={pressForm.date} onChange={e => setPressForm(f => ({ ...f, date: e.target.value }))} className="input-base" placeholder="e.g. March 2025" />
              </div>
              <div>
                <label className="block text-xs font-medium text-white mb-1">Logo Emoji</label>
                <input value={pressForm.logo} onChange={e => setPressForm(f => ({ ...f, logo: e.target.value }))} className="input-base" placeholder="📰" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white mb-1">Article URL</label>
              <input value={pressForm.url} onChange={e => setPressForm(f => ({ ...f, url: e.target.value }))} className="input-base" placeholder="https://..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPressModal(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={savePress} disabled={pressSaving || !pressForm.outlet || !pressForm.title}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-[#0D0A1A] rounded-xl text-sm font-semibold transition-colors">
                <Save size={14} /> {pressSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
