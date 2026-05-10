// app/api/rsvp/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, status, jumlah_tamu, ucapan, nama, undangan_id } = body

    const supabase = await createClient()
    let tamuId = null
    let undanganId = undangan_id
    let tamuNama = nama

    if (token) {
      // Cari tamu berdasarkan link_token
      const { data: existingTamu, error: tamuError } = await supabase
        .from('tamu')
        .select('id, undangan_id, nama')
        .eq('link_token', token)
        .single()

      if (!tamuError && existingTamu) {
        tamuId = existingTamu.id
        undanganId = existingTamu.undangan_id
        tamuNama = existingTamu.nama
      }
    }

    // Jika tidak ada tamuId tapi ada nama dan undanganId, buat/cari tamu "Manual"
    if (!tamuId && nama && undanganId) {
      // Cari apakah sudah ada tamu dengan nama ini di undangan ini (untuk menghindari duplikasi tamu manual)
      const { data: manualTamu } = await supabase
        .from('tamu')
        .select('id')
        .eq('undangan_id', undanganId)
        .eq('nama', nama)
        .limit(1)
        .maybeSingle()

      if (manualTamu) {
        tamuId = manualTamu.id
      } else {
        // Buat record tamu baru (Manual)
        const { data: newTamu, error: createError } = await supabase
          .from('tamu')
          .insert({
            undangan_id: undanganId,
            nama: nama,
            kategori: 'Umum',
            blast_status: 'pending'
          } as any)
          .select('id')
          .single()
        
        if (!createError && newTamu) {
          tamuId = newTamu.id
        }
      }
    }

    if (!tamuId || !status || !undanganId) {
      return NextResponse.json(
        { error: 'Data konfirmasi tidak lengkap (Token atau Nama wajib ada).' },
        { status: 400 }
      )
    }

    // Upsert RSVP
    const { error: rsvpError } = await supabase
      .from('rsvp')
      .upsert({
        tamu_id: tamuId,
        undangan_id: undanganId,
        status,
        jumlah_tamu: jumlah_tamu || 1,
        ucapan: ucapan || null,
      } as any, { onConflict: 'tamu_id' })

    if (rsvpError) {
      console.error('RSVP error:', rsvpError)
      return NextResponse.json(
        { error: 'Gagal menyimpan konfirmasi. Silakan coba lagi.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Terima kasih, ${tamuNama || 'Tamu'}! Konfirmasi berhasil disimpan.`
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.' },
      { status: 500 }
    )
  }
}
