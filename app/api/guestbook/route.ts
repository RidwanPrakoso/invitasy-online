// app/api/guestbook/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { undangan_id, nama, ucapan } = body

    if (!undangan_id || !nama || !ucapan) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await (supabase
      .from('guestbook') as any)
      .insert({
        undangan_id,
        nama,
        ucapan,
        tampil: true
      })

    if (error) {
      console.error('Guestbook error:', error)
      return NextResponse.json({ error: 'Gagal mengirim ucapan' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
