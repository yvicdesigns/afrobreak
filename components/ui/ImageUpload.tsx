'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  folder?: string // e.g. 'thumbnails', 'covers', 'avatars'
}

export default function ImageUpload({ value, onChange, label = 'Image', folder = 'uploads' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setError('')
    setUploading(true)

    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, { upsert: false })

    if (uploadError || !data) {
      setError('Upload failed. Please try again.')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
    onChange(publicUrl)
    setUploading(false)

    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-xs font-medium text-white mb-1.5">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative mb-2 inline-block">
          <img src={value} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-white/10" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors"
          >
            <X size={10} className="text-white" />
          </button>
        </div>
      )}

      {/* Upload button + URL input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Paste URL or upload an image →"
          className="input-base flex-1 text-sm"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 disabled:opacity-50 text-primary-400 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
