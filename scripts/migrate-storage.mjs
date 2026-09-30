// One-time script: migrate files from old Supabase storage to new project
// Run with: node scripts/migrate-storage.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Parse .env.local manually
const envContent = readFileSync('.env.local', 'utf-8')
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const i = l.indexOf('=')
      const key = l.slice(0, i).trim()
      let val = l.slice(i + 1).trim()
      // Strip surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      // Unescape literal \n and trim
      val = val.replace(/\\n/g, '').trim()
      return [key, val]
    })
)

const OLD_BASE = 'https://uexidlplvbssarvuxfyn.supabase.co'
const NEW_URL = env.NEXT_PUBLIC_SUPABASE_URL
const NEW_KEY = env.NEXT_SERVCE_ROLE  // note the typo in the env var name

if (!NEW_URL || !NEW_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_SERVCE_ROLE in .env.local')
  process.exit(1)
}

const supabase = createClient(NEW_URL, NEW_KEY)

// All files to migrate: [bucket, path-inside-bucket]
const FILES = [
  // Video thumbnails
  ['media', 'thumbnails/1774424299617-st0ntdzolp9.jpg'],
  ['media', 'thumbnails/1774423447004-p0joibckz7i.jpg'],
  ['media', 'thumbnails/1774423671621-mziusqbbe49.jpg'],
  ['media', 'thumbnails/1774421574589-qx0g51mrq7r.jpg'],
  ['media', 'thumbnails/1774424413803-ph5i2ubqwgk.jpg'],
  // Music covers
  ['media', 'music/1774557214801-wghu1ed6o1j.jpeg'],
  ['media', 'music/1774557332066-6j10vnjjdph.jpeg'],
  ['media', 'music/1774562488483-fcw730ow32.jpeg'],
  ['media', 'music/1774562689612-jmtlc76smpn.jpeg'],
  ['media', 'music/1774562887200-eb83lpv8bed.jpeg'],
  // Audio previews (MP3)
  ['media', 'audio/1774562804353-kuojikatbmo.mp3'],
  ['media', 'audio/1774562497554-rg89tk9s1f.mp3'],
  ['media', 'audio/1774562698849-1z1d5ljcuf8.mp3'],
  ['media', 'audio/1774562900714-9l3wtf7i39.mp3'],
  // Audio downloads (WAV)
  ['media', 'audio/1774562818629-jzsbnde6v3.wav'],
  ['media', 'audio/1774562580182-yueyl2oqtp.wav'],
  ['media', 'audio/1774562731556-92nx55hcknb.wav'],
  ['media', 'audio/1774562912833-vys7c4e093f.wav'],
]

const MIME = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', webp: 'image/webp',
  mp3: 'audio/mpeg', wav: 'audio/wav',
}

async function ensureBucket(name) {
  const { data } = await supabase.storage.listBuckets()
  if (!data?.find(b => b.name === name)) {
    const { error } = await supabase.storage.createBucket(name, { public: true })
    if (error) throw new Error(`Failed to create bucket ${name}: ${error.message}`)
    console.log(`✓ Created bucket: ${name}`)
  }
}

async function migrate() {
  console.log(`New project: ${NEW_URL}\n`)

  await ensureBucket('media')

  let ok = 0, fail = 0
  for (const [bucket, filePath] of FILES) {
    const oldUrl = `${OLD_BASE}/storage/v1/object/public/${bucket}/${filePath}`
    const ext = filePath.split('.').pop().toLowerCase()
    const contentType = MIME[ext] || 'application/octet-stream'

    process.stdout.write(`Migrating ${filePath} ... `)
    try {
      const res = await fetch(oldUrl)
      if (!res.ok) throw new Error(`Download ${res.status}`)
      const buffer = await res.arrayBuffer()

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, { contentType, upsert: true })

      if (error) throw new Error(`Upload: ${error.message}`)
      console.log('✓')
      ok++
    } catch (e) {
      console.log(`✗ ${e.message}`)
      fail++
    }
  }

  // Update DB: replace old URLs with new ones
  console.log('\nUpdating database URLs...')

  // Videos thumbnails
  const { data: videos } = await supabase.from('videos').select('id, thumbnail')
  for (const v of videos || []) {
    if (v.thumbnail?.includes('uexidlplvbssarvuxfyn')) {
      await supabase.from('videos').update({
        thumbnail: v.thumbnail.replace(OLD_BASE, NEW_URL)
      }).eq('id', v.id)
      console.log(`  ✓ video ${v.id}`)
    }
  }

  // Music tracks and albums in settings
  const { data: settings } = await supabase.from('settings')
    .select('key, value')
    .or('key.like.musictrack_%,key.like.musicalbum_%')

  for (const s of settings || []) {
    if (s.value?.includes('uexidlplvbssarvuxfyn')) {
      await supabase.from('settings').update({
        value: s.value.replaceAll(OLD_BASE, NEW_URL)
      }).eq('key', s.key)
      console.log(`  ✓ settings ${s.key}`)
    }
  }

  console.log(`\nDone — ${ok} files migrated, ${fail} failed.`)
}

migrate().catch(e => { console.error(e); process.exit(1) })
