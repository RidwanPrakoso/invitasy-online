// app/dashboard/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditUndanganForm from './EditUndanganForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: undangan } = await supabase
    .from('undangan')
    .select('*')
    .eq('id', id)
    .single()

  if (!undangan) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100vh', background: '#fff', paddingBottom: '100px', fontFamily: '"Inter", sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header / Navbar */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid #f1f5f9',
        padding: '0 5%', height: '72px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/dashboard" style={{
            fontSize: '13px', color: '#64748b', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500
          }}>
            ← Dashboard
          </Link>
          <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>Edit Detail Undangan</span>
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>
           Changes are saved to the cloud.
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '60px' }}>
           <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em' }}>Pengaturan Undangan</h1>
           <p style={{ color: '#64748b', fontSize: '16px' }}>Kelola seluruh konten, tampilan, dan informasi pernikahan kamu.</p>
        </div>

        <EditUndanganForm undangan={undangan} />
      </div>
    </main>
  )
}
