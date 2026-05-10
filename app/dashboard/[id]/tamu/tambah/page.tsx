// app/dashboard/[id]/tamu/tambah/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Undangan } from '@/lib/supabase/types'
import TambahTamuForm from './TambahTamuForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TambahTamuPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: undangan } = await supabase
    .from('undangan')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: Undangan | null }

  if (!undangan) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '80px', fontFamily: '"Inter", sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        .responsive-nav {
          background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 5%;
          min-height: 64px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 12px; padding-bottom: 12px; position: sticky; top: 0; z-index: 100;
        }
      `}</style>

      <nav className="responsive-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href={`/dashboard/${id}/tamu`} style={{
            fontSize: '13px', color: '#64748b', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500
          }}>
            ← Kembali
          </Link>
          <div style={{ width: '1px', height: '16px', background: '#e2e8f0' }} />
          <span style={{ fontWeight: 600, color: '#0f172a' }}>Tambah Tamu</span>
        </div>
      </nav>

      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
           <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Tambah Tamu</h1>
           <p style={{ color: '#64748b', fontSize: '15px' }}>Data ini akan digunakan untuk membuat link undangan personal.</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <TambahTamuForm undanganId={id} />
        </div>
      </div>
    </main>
  )
}
