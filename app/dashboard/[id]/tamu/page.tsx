// app/dashboard/[id]/tamu/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Tamu, Undangan } from '@/lib/supabase/types'
import ImportTamuExcel from './ImportTamuExcel'
import CopyLinkButton from './CopyLinkButton'
import CopyWATemplateButton from './CopyWATemplateButton'
import BlastWAModal from './BlastWAModal'

interface Props {
  params: Promise<{ id: string }>
}

export default async function KelolaTamuPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: undangan } = await supabase
    .from('undangan')
    .select('*')
    .eq('id', id)
    .single() as { data: Undangan | null }

  if (!undangan) redirect('/dashboard')

  const { data: tamuList } = await supabase
    .from('tamu')
    .select('*')
    .eq('undangan_id', undangan.id)
    .order('created_at', { ascending: false }) as { data: Tamu[] | null }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Inter", sans-serif' }}>
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
        <div style={{ display: 'flex', gap: '12px' }}>
           <BlastWAModal undangan={undangan} tamuList={tamuList || []} />
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Kelola Tamu</h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>Daftar tamu undangan yang akan menerima link digital.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <ImportTamuExcel undanganId={id} />
            <Link href={`/dashboard/${id}/tamu/tambah`} style={{
              background: '#0f172a', color: '#fff', textDecoration: 'none',
              padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Tamu
            </Link>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={thStyle}>NAMA TAMU</th>
                  <th style={thStyle}>KATEGORI</th>
                  <th style={thStyle}>WHATSAPP</th>
                  <th style={thStyle}>STATUS BLAST</th>
                  <th style={thStyle}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {!tamuList || tamuList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '80px', textAlign: 'center', color: '#94a3b8', fontSize: '15px' }}>
                       <div style={{ fontSize: '40px', marginBottom: '16px' }}>👥</div>
                       Belum ada tamu. Yuk tambah tamu atau import dari Excel!
                    </td>
                  </tr>
                ) : (
                  tamuList.map((t) => {
                    // Use origin if available, otherwise fallback
                    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
                    const guestUrl = `${baseUrl}/u/${undangan.slug}?t=${t.link_token}&untuk=${encodeURIComponent(t.nama)}`
                    return (
                      <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={tdStyle}>
                           <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.nama}</div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '4px 12px', borderRadius: '20px', background: '#f1f5f9',
                            fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                          }}>
                            {t.kategori}
                          </span>
                        </td>
                        <td style={tdStyle}>{t.no_wa || '-'}</td>
                        <td style={tdStyle}>
                           <span style={{
                             display: 'inline-flex', alignItems: 'center', gap: '8px',
                             fontSize: '12px', fontWeight: 600, color: t.blast_status === 'sent' ? '#10b981' : '#f59e0b'
                           }}>
                             <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.blast_status === 'sent' ? '#10b981' : '#f59e0b' }} />
                             {t.blast_status === 'sent' ? 'Sudah Terkirim' : 'Pending'}
                           </span>
                        </td>
                        <td style={tdStyle}>
                           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                             <CopyWATemplateButton 
                                namaTamu={t.nama}
                                mempelai1={undangan.mempelai_1}
                                mempelai2={undangan.mempelai_2}
                                tanggal={new Date((undangan.tanggal_resepsi || undangan.tanggal_akad || '') as string).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                lokasi={undangan.lokasi_resepsi || undangan.lokasi_akad || ''}
                                url={guestUrl}
                             />
                             <CopyLinkButton url={guestUrl} />
                             <button style={iconBtnStyle} title="Hapus">
                               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                 <polyline points="3 6 5 6 21 6" />
                                 <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                               </svg>
                             </button>
                           </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
  )
}

const thStyle: React.CSSProperties = {
  padding: '18px 24px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748b',
  letterSpacing: '0.05em'
}

const tdStyle: React.CSSProperties = {
  padding: '20px 24px',
  fontSize: '14px',
  color: '#334155'
}

const iconBtnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  border: '1px solid #fee2e2',
  background: '#fef2f2',
  color: '#ef4444',
  cursor: 'pointer',
  transition: 'all 0.2s'
}
