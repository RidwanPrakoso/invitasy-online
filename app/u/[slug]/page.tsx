// app/u/[slug]/page.tsx
// Halaman undangan untuk tamu — publik, no auth required

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import InvitationClient from './InvitationClient'
import type { Undangan, Tamu } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ t?: string; untuk?: string }> // token tamu atau nama langsung
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: undangan } = await supabase
    .from('undangan')
    .select('mempelai_1, mempelai_2, foto_url')
    .eq('slug', slug)
    .single()

  if (!undangan) {
    return {
      title: 'Undangan Tidak Ditemukan',
    }
  }

  return {
    title: `The Wedding of ${undangan.mempelai_1} & ${undangan.mempelai_2}`,
    description: `Kami mengundang Anda untuk hadir di acara pernikahan kami.`,
    openGraph: {
      images: undangan.foto_url ? [undangan.foto_url] : [],
    },
  }
}

export default async function UndanganPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { t, untuk } = await searchParams
  const supabase = await createClient()

  // Fetch undangan by slug
  const { data: undangan } = await supabase
    .from('undangan')
    .select('*')
    .eq('slug', slug)
    .single() as { data: Undangan | null }

  if (!undangan) notFound()

  // Fetch data tamu jika ada token
  let tamu: any = null
  if (t) {
    const { data } = await supabase
      .from('tamu')
      .select('*')
      .eq('link_token', t)
      .eq('undangan_id', undangan.id)
      .single()
    tamu = data
  }

  // Fallback: Jika tidak ada token (t), cek apakah ada nama di parameter 'untuk'
  if (!tamu && untuk) {
    tamu = {
      nama: decodeURIComponent(untuk),
      status: 'Manual'
    }
  }

  // Fetch guestbook (10 terbaru)
  const { data: guestbook } = await supabase
    .from('guestbook')
    .select('*')
    .eq('undangan_id', undangan.id)
    .eq('tampil', true)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <InvitationClient
      undangan={undangan}
      tamu={tamu}
      guestbook={guestbook || []}
      token={t}
    />
  )
}
