'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, Music2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AudioUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  maxMB?: number
}

export default function AudioUpload({ value, onChange, label = 'Audio File', maxMB = 50 }: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file (MP3, WAV, AAC, OGG)')
      return
    }

    if (file.size > maxMB * 1024 * 1024) {
      setError(`File must be under ${maxMB}MB`)
      return
    }

    setError('')
    setUploading(true)
    setProgress(0)

    const ext = file.name.split('.').pop()
    const fileName = `audio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, { upsert: false })

    if (uploadError || !data) {
      setError('Upload failed. Check that your Supabase storage bucket allows audio files.')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
    onChange(publicUrl)
    setUploading(false)
    setProgress(100)

    if (inputRef.current) inputRef.current.value = ''
  }

  // Extract filename from URL for display
  const fileName = value ? value.split('/').pop()?.split('?')[0] || 'audio file' : ''

  return (
    <div>
      <label className="block text-xs font-medium text-white mb-1.5">{label}</label>

      {/* Current file indicator */}
      {value && (
        <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-secondary-500/10 border border-secondary-500/30 rounded-xl">
          <Music2 size={14} className="text-secondary-400 flex-shrink-0" />
          <span className="text-xs text-white truncate flex-1">{fileName}</span>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-0.5 rounded hover:text-red-400 text-text-muted transition-colors flex-shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* URL input + Upload button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste direct MP3 URL or upload →"
          className="input-base flex-1 text-sm"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-secondary-500/20 hover:bg-secondary-500/30 disabled:opacity-50 text-secondary-400 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? `Uploading…` : 'Upload'}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      <p className="text-text-muted text-xs mt-1">MP3 or WAV · Max {maxMB}MB · Or paste a direct URL</p>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
