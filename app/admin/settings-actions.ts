'use server'

import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SERVCE_ROLE!
  )
}

export async function saveSettingAction(key: string, value: string): Promise<boolean> {
  const { error } = await adminClient().from('settings').upsert({ key, value })
  return !error
}

export async function getSettingAction(key: string): Promise<string | null> {
  const { data } = await adminClient().from('settings').select('value').eq('key', key).single()
  return data?.value ?? null
}
