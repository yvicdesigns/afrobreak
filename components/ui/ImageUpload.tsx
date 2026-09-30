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

async function compressImage(file: File, maxPx = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round((height * maxPx) / width); width = maxPx }
        else { width = Math.round((width * maxPx) / height); height = maxPx }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Compression failed')), 'image/webp', quality)
    }
    img.onerror = reject
    img.src = url
  })
}

export default function ImageUpload({ value, onChange, label = 'Image', folder = 'uploads' }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [compressing, setCompressing] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Image must be under 20MB')
      return
    }

    setError('')
    setCompressing(true)

    let blob: Blob
    try {
      blob = await compressImage(file)
    } catch {
      blob = file
    }
    setCompressing(false)
    setUploading(true)

    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`

    const { data, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, blob, { upsert: false, contentType: 'image/webp' })

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
          disabled={uploading || compressing}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 disabled:opacity-50 text-primary-400 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0"
        >
          {(compressing || uploading) ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {compressing ? 'Compressing…' : uploading ? 'Uploading…' : 'Upload'}
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
