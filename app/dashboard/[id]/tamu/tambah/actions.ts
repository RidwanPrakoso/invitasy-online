// app/dashboard/[id]/tamu/tambah/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { Tamu, Undangan } from '@/lib/supabase/types'

/**
 * Action to add a new guest to an invitation.
 */
export async function addTamu(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const undangan_id = formData.get('undangan_id') as string
  const nama = formData.get('nama') as string
  const no_wa = formData.get('no_wa') as string
  const kategori = formData.get('kategori') as string

  const link_token = crypto.randomUUID().split('-')[0]

  const { error } = await (supabase
    .from('tamu') as any)
    .insert({
      undangan_id,
      nama,
      no_wa,
      kategori,
      link_token,
      blast_status: 'pending'
    })

  if (error) {
    console.error('Error adding tamu:', error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/${undangan_id}/tamu`)
  redirect(`/dashboard/${undangan_id}/tamu`)
}

export async function importTamuBulk(undangan_id: string, dataTamu: { nama: string, no_wa: string, kategori: string }[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Map data and generate tokens
  const rows = dataTamu.map(t => ({
    undangan_id,
    nama: t.nama,
    no_wa: t.no_wa?.toString(),
    kategori: t.kategori || 'Umum',
    link_token: crypto.randomUUID().split('-')[0],
    blast_status: 'pending'
  }))

  const { error } = await (supabase
    .from('tamu') as any)
    .insert(rows)

  if (error) {
    console.error('Error bulk import tamu:', error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/${undangan_id}/tamu`)
  return { success: true, count: rows.length }
}

export async function updateBlastStatus(tamuId: string, status: string) {
  const supabase = await createClient()
  const { error } = await (supabase.from('tamu') as any).update({
    blast_status: status,
    blast_at: new Date().toISOString()
  }).eq('id', tamuId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function sendBlastFonnte(undanganId: string, template: string, selectedTamu: Tamu[]) {
  const supabase = await createClient()
  const apiKey = process.env.FONNTE_API_KEY
  
  if (!apiKey) return { error: 'Fonnte API Key belum diatur di .env.local' }

  // Fetch data undangan untuk ambil slug
  const { data: undangan } = await supabase.from('undangan').select('*').eq('id', undanganId).single() as { data: Undangan | null }
  if (!undangan) return { error: 'Undangan tidak ditemukan' }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  // Siapkan data untuk Fonnte
  const targets = selectedTamu.map(t => t.no_wa).join(',')
  const messages = selectedTamu.map(t => {
    const link = `${baseUrl}/u/${undangan.slug}?t=${t.link_token}&untuk=${encodeURIComponent(t.nama)}`
    return template.replace(/\[nama\]/gi, t.nama).replace(/\[link\]/gi, link)
  }).join('|')

  try {
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': apiKey
      },
      body: new URLSearchParams({
        'target': targets,
        'message': messages,
        'delay': '2' // Delay 2 detik antar pesan agar aman
      })
    })

    const result = await response.json()

    if (result.status) {
      // Update status tamu di database
      const ids = selectedTamu.map(t => t.id)
      await (supabase.from('tamu') as any)
        .update({ blast_status: 'sent', blast_at: new Date().toISOString() })
        .in('id', ids)

      revalidatePath(`/dashboard/${undanganId}/tamu`)
      return { success: true, count: selectedTamu.length }
    } else {
      return { error: result.reason || 'Gagal mengirim pesan via Fonnte' }
    }
  } catch (err) {
    console.error(err)
    return { error: 'Terjadi kesalahan saat menghubungi Fonnte API' }
  }
}
