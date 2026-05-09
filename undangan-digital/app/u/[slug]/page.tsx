// app/u/[slug]/page.tsx
// Halaman undangan untuk tamu — publik, no auth required

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import RSVPForm from './RSVPForm'
import type { Undangan, Tamu } from '@/lib/supabase/types'

interface Props {
  params: { slug: string }
  searchParams: { t?: string } // token tamu
}

export default async function UndanganPage({ params, searchParams }: Props) {
  const supabase = await createClient()

  // Fetch undangan by slug
  const { data: undangan } = await supabase
    .from('undangan')
    .select('*')
    .eq('slug', params.slug)
    .eq('aktif', true)
    .single()

  if (!undangan) notFound()

  // Fetch data tamu jika ada token
  let tamu: Tamu | null = null
  if (searchParams.t) {
    const { data } = await supabase
      .from('tamu')
      .select('*')
      .eq('link_token', searchParams.t)
      .eq('undangan_id', undangan.id)
      .single()
    tamu = data
  }

  // Fetch guestbook (10 terbaru)
  const { data: guestbook } = await supabase
    .from('guestbook')
    .select('*')
    .eq('undangan_id', undangan.id)
    .eq('tampil', true)
    .order('created_at', { ascending: false })
    .limit(10)

  const tema = undangan.tema || 'mono'

  return <TemplatePage undangan={undangan} tamu={tamu} guestbook={guestbook || []} token={searchParams.t} />
}

function TemplatePage({
  undangan: u, tamu, guestbook, token
}: {
  undangan: Undangan
  tamu: Tamu | null
  guestbook: any[]
  token?: string
}) {
  const tglResepsi = u.tanggal_resepsi
    ? new Date(u.tanggal_resepsi)
    : null

  const tglFormatted = tglResepsi
    ? tglResepsi.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : ''

  // Mono Minimal theme (default)
  return (
    <main style={{ background: '#f5f5f5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{
        background: '#fff', padding: '64px 24px 48px',
        textAlign: 'center', borderBottom: '1px solid #e8e8e8'
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '.22em', color: '#999', textTransform: 'uppercase', marginBottom: '24px' }}>
          The Wedding of
        </p>
        <h1 style={{ fontSize: '48px', fontWeight: 300, color: '#111', letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 8px' }}>
          {u.mempelai_1}
        </h1>
        <p style={{ fontSize: '16px', color: '#ccc', letterSpacing: '.1em', margin: '8px 0' }}>&</p>
        <h1 style={{ fontSize: '48px', fontWeight: 300, color: '#111', letterSpacing: '-1px', lineHeight: 1.1, margin: '0 0 32px' }}>
          {u.mempelai_2}
        </h1>
        {tamu && (
          <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
            Kepada Yth. <strong style={{ color: '#111' }}>{tamu.nama}</strong>
          </p>
        )}
        {tglFormatted && (
          <p style={{ fontSize: '14px', color: '#555', letterSpacing: '.04em' }}>{tglFormatted}</p>
        )}
      </section>

      {/* Detail acara */}
      <section style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px' }}>
        {u.lokasi_akad && (
          <div style={{
            background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px',
            padding: '20px', marginBottom: '12px'
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '.2em', color: '#bbb', textTransform: 'uppercase', marginBottom: '8px' }}>
              Akad Nikah
            </p>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#111', marginBottom: '4px' }}>{u.lokasi_akad}</p>
            {u.alamat_akad && <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{u.alamat_akad}</p>}
          </div>
        )}

        {u.lokasi_resepsi && (
          <div style={{
            background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px',
            padding: '20px', marginBottom: '24px'
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '.2em', color: '#bbb', textTransform: 'uppercase', marginBottom: '8px' }}>
              Resepsi
            </p>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#111', marginBottom: '4px' }}>{u.lokasi_resepsi}</p>
            {u.alamat_resepsi && <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{u.alamat_resepsi}</p>}
            {u.maps_url && (
              <a href={u.maps_url} target="_blank" rel="noreferrer" style={{
                display: 'inline-block', marginTop: '10px', fontSize: '12px',
                color: '#111', textDecoration: 'underline'
              }}>
                Buka di Google Maps →
              </a>
            )}
          </div>
        )}

        {/* RSVP Form */}
        {token ? (
          <RSVPForm token={token} undanganId={u.id} />
        ) : (
          <div style={{
            background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px',
            padding: '24px', textAlign: 'center', marginBottom: '24px'
          }}>
            <p style={{ fontSize: '13px', color: '#888' }}>
              Buka link undangan personal kamu untuk konfirmasi kehadiran.
            </p>
          </div>
        )}

        {/* Guestbook */}
        {guestbook.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12px', letterSpacing: '.2em', color: '#bbb', textTransform: 'uppercase', marginBottom: '16px' }}>
              Ucapan & doa
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {guestbook.map((g: any) => (
                <div key={g.id} style={{
                  background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px', padding: '16px'
                }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#111', marginBottom: '4px' }}>{g.nama}</p>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>{g.ucapan}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid #e8e8e8' }}>
        <p style={{ fontSize: '11px', color: '#ccc', letterSpacing: '.08em' }}>
          {u.mempelai_1} & {u.mempelai_2} · 2025
        </p>
      </footer>
    </main>
  )
}
