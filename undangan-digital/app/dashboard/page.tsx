// app/dashboard/page.tsx
// Server Component — fetch data di server

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Undangan } from '@/lib/supabase/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Cek auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch semua undangan milik user
  const { data: undanganList } = await supabase
    .from('undangan')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Navbar */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid #e8e8e8',
        padding: '0 24px', height: '56px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontWeight: 500, color: '#111' }}>Undangan Digital</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#888' }}>{user.email}</span>
          <form action="/api/auth/signout" method="post">
            <button style={{
              fontSize: '13px', color: '#888', background: 'none',
              border: '1px solid #e0e0e0', borderRadius: '6px',
              padding: '6px 12px', cursor: 'pointer'
            }}>
              Keluar
            </button>
          </form>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#111' }}>
            Undangan saya
          </h1>
          <Link href="/dashboard/buat" style={{
            background: '#111', color: '#fff', padding: '10px 18px',
            borderRadius: '8px', fontSize: '14px', textDecoration: 'none'
          }}>
            + Buat undangan
          </Link>
        </div>

        {/* List undangan */}
        {!undanganList || undanganList.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8',
            padding: '60px 24px', textAlign: 'center'
          }}>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '16px' }}>
              Belum ada undangan. Buat yang pertama!
            </p>
            <Link href="/dashboard/buat" style={{
              background: '#111', color: '#fff', padding: '10px 20px',
              borderRadius: '8px', fontSize: '14px', textDecoration: 'none'
            }}>
              Buat undangan
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {undanganList.map((u: Undangan) => (
              <UndanganCard key={u.id} undangan={u} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function UndanganCard({ undangan: u }: { undangan: Undangan }) {
  const tgl = u.tanggal_resepsi
    ? new Date(u.tanggal_resepsi).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : 'Tanggal belum diset'

  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8',
      padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#111', marginBottom: '4px' }}>
          {u.mempelai_1} & {u.mempelai_2}
        </h2>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>{tgl}</p>
        <p style={{ fontSize: '12px', color: '#bbb' }}>/{u.slug}</p>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link href={`/u/${u.slug}`} target="_blank" style={{
          fontSize: '13px', color: '#555', padding: '7px 14px',
          border: '1px solid #e0e0e0', borderRadius: '7px', textDecoration: 'none'
        }}>
          Preview
        </Link>
        <Link href={`/dashboard/${u.id}/tamu`} style={{
          fontSize: '13px', color: '#555', padding: '7px 14px',
          border: '1px solid #e0e0e0', borderRadius: '7px', textDecoration: 'none'
        }}>
          Kelola tamu
        </Link>
        <Link href={`/dashboard/${u.id}/rsvp`} style={{
          fontSize: '13px', color: '#fff', background: '#111', padding: '7px 14px',
          border: '1px solid #111', borderRadius: '7px', textDecoration: 'none'
        }}>
          RSVP
        </Link>
      </div>
    </div>
  )
}
