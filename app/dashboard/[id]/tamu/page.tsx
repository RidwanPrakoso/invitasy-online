// app/dashboard/[id]/tamu/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'
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
    .eq('undangan_id', id)
    .order('nama', { ascending: true }) as { data: Tamu[] }

  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const tdStyle: React.CSSProperties = { padding: '16px', fontSize: '14px', color: '#64748b' }
  const iconBtnStyle: React.CSSProperties = {
    padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0',
    background: '#fff', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px' }}>
      <style>{`
        .responsive-nav {
          background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 5%;
          min-height: 64px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 12px; padding-bottom: 12px;
        }
        .responsive-nav-actions {
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .table-container {
          background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; overflow-x: auto;
        }
      `}</style>
      <nav className="responsive-nav">
         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Dashboard</Link>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Kelola Tamu</h1>
         </div>
         <div className="responsive-nav-actions">
            <BlastWAModal tamuList={tamuList || []} undangan={undangan} />
            <ImportTamuExcel undanganId={id} />
            <Link href={`/dashboard/${id}/tamu/tambah`} style={{
              background: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap'
            }}>+ Tambah Tamu</Link>
         </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>Nama Tamu</th>
                  <th style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>Kategori</th>
                  <th style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>No. WhatsApp</th>
                  <th style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>Status Blast</th>
                  <th style={{ ...tdStyle, fontWeight: 600, color: '#0f172a' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {!tamuList || tamuList.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: '80px 0' }}>
                       <div style={{ fontSize: '40px', marginBottom: '16px' }}>👥</div>
                       Belum ada tamu. Yuk tambah tamu atau import dari Excel!
                    </td>
                  </tr>
                ) : (
                  tamuList.map((t) => {
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
                                 noWa={t.no_wa}
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
  )
}
