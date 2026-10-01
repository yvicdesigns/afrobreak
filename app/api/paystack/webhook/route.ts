import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SERVCE_ROLE!
)

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const body = await req.text()
  const signature = req.headers.get('x-paystack-signature') || ''

  // Verify HMAC signature
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.event === 'charge.success') {
    const data = event.data
    const metadata = data.metadata?.custom_fields || []
    const planField = metadata.find((f: { variable_name: string }) => f.variable_name === 'plan')
    const plan = planField?.value || 'monthly'
    const userId = data.metadata?.user_id

    const isAnnual = plan === 'annual'
    const subscriptionEnd = new Date()
    if (isAnnual) {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
    }
    const endDate = subscriptionEnd.toISOString()
    const amount = data.amount / 100

    // Record subscription
    await supabase.from('subscriptions').upsert({
      paystack_ref: data.reference,
      user_id: userId || null,
      plan,
      amount,
      currency: data.currency,
      status: 'active',
      started_at: new Date().toISOString(),
      ends_at: endDate,
    }, { onConflict: 'paystack_ref' })

    // Update user profile if we have a user_id
    if (userId) {
      await supabase.from('profiles').update({
        is_premium: true,
        subscription_end: endDate,
      }).eq('id', userId)
    }
  }

  return NextResponse.json({ received: true })
}
