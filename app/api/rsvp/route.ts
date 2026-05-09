// app/api/rsvp/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, status, jumlah_tamu, ucapan } = body

    // Validasi input
    if (!token || !status) {
      return NextResponse.json(
        { error: 'Token dan status wajib diisi.' },
        { status: 400 }
      )
    }

    if (!['hadir', 'tidak', 'ragu'].includes(status)) {
      return NextResponse.json(
        { error: 'Status tidak valid.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Cari tamu berdasarkan link_token
    const { data: rawTamu, error: tamuError } = await supabase
      .from('tamu')
      .select('id, undangan_id, nama')
      .eq('link_token', token)
      .single()

    const tamu = rawTamu as any;

    if (tamuError || !tamu) {
      return NextResponse.json(
        { error: 'Link undangan tidak valid.' },
        { status: 404 }
      )
    }

    // Upsert RSVP (update jika sudah ada, insert jika belum)
    const { error: rsvpError } = await supabase
      .from('rsvp')
      .upsert({
        tamu_id: tamu.id,
        undangan_id: tamu.undangan_id,
        status,
        jumlah_tamu: jumlah_tamu || 1,
        ucapan: ucapan || null,
      } as any, { onConflict: 'tamu_id' })

    if (rsvpError) {
      console.error('RSVP error:', rsvpError)
      return NextResponse.json(
        { error: 'Gagal menyimpan konfirmasi. Coba lagi.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Terima kasih, ${tamu.nama}! Konfirmasi berhasil disimpan.`
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.' },
      { status: 500 }
    )
  }
}
