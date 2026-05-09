// app/dashboard/[id]/rsvp/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { RSVPTable } from './RSVPTable'
import type { Undangan, RSVP } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function RSVPPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Ambil data undangan
  const { data: undangan } = await supabase
    .from('undangan')
    .select('*')
    .eq('id', id)
    .single() as { data: Undangan | null }

  if (!undangan) redirect('/dashboard')

  // Ambil data RSVP dengan JOIN ke tabel tamu untuk ambil nama
  const { data: rsvpList } = await supabase
    .from('rsvp')
    .select('*, tamu(nama)')
    .eq('undangan_id', id)
    .order('created_at', { ascending: false }) as any

  const list = (rsvpList || []).map((r: any) => ({
    ...r,
    nama: r.tamu?.nama || 'Tamu Tanpa Nama'
  }))

  // Hitung Ringkasan
  const totalPax = list.filter((r: any) => r.status === 'hadir').reduce((acc: number, r: any) => acc + (r.jumlah_tamu || 1), 0)
  const totalHadir = list.filter((r: any) => r.status === 'hadir').length
  const totalTidakHadir = list.filter((r: any) => r.status === 'tidak').length

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px', fontFamily: '"Inter", sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Navbar Modern */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '0 5%', height: '64px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/dashboard" style={{
            fontSize: '13px', color: '#64748b', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500
          }}>
            ← Dashboard
          </Link>
          <div style={{ width: '1px', height: '16px', background: '#e2e8f0' }} />
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{undangan.mempelai_1} & {undangan.mempelai_2}</span>
        </div>
        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
          Laporan RSVP
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '32px' }}>
           <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Data RSVP</h1>
           <p style={{ color: '#64748b', fontSize: '15px' }}>Rekapitulasi kehadiran tamu undangan secara real-time.</p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={cardStyle}>
            <p style={labelStyle}>Total Tamu (Pax)</p>
            <h2 style={valueStyle}>{totalPax}</h2>
          </div>
          <div style={{ ...cardStyle, borderLeft: '4px solid #10b981' }}>
            <p style={labelStyle}>Konfirmasi Hadir</p>
            <h2 style={{ ...valueStyle, color: '#10b981' }}>{totalHadir}</h2>
          </div>
          <div style={{ ...cardStyle, borderLeft: '4px solid #f43f5e' }}>
            <p style={labelStyle}>Tidak Hadir</p>
            <h2 style={{ ...valueStyle, color: '#f43f5e' }}>{totalTidakHadir}</h2>
          </div>
        </div>

        <RSVPTable data={list} />
      </div>
    </main>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#64748b',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '12px'
}

const valueStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  color: '#0f172a',
  margin: 0
}
