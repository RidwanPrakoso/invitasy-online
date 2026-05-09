// app/dashboard/page.tsx (Updated for Ultra-Modern UI)
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Undangan } from '@/lib/supabase/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: undanganList } = await supabase
    .from('undangan')
    .select('*')
    .order('created_at', { ascending: false })

  const totalUndangan = undanganList?.length || 0

  return (
    <main style={{ display: 'flex', minHeight: '100vh', background: '#fff', fontFamily: '"Inter", sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* --- SIDEBAR (Minimalist White) --- */}
      <aside style={{
        width: '280px', background: '#fff', borderRight: '1px solid #f2f2f2',
        display: 'flex', flexDirection: 'column', padding: '32px 24px', position: 'fixed', height: '100vh', zIndex: 50
      }}>
        <div style={{ fontSize: '22px', fontWeight: 800, color: '#000', marginBottom: '48px', letterSpacing: '-1px' }}>
          Undangan<span style={{ color: '#3b82f6' }}>Digital</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <SidebarLink href="/dashboard" active>Dashboard</SidebarLink>
          <SidebarLink href="/dashboard/buat">Buat Baru</SidebarLink>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid #f2f2f2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {user.email?.[0].toUpperCase()}
             </div>
             <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#000', margin: 0 }}>{user.email?.split('@')[0]}</p>
                <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Administrator</p>
             </div>
          </div>
          <form action="/api/auth/signout" method="post">
            <button style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              background: '#f9f9f9', color: '#666', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <section style={{ marginLeft: '280px', flex: 1, padding: '60px 8%' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#000', letterSpacing: '-1.5px', marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ color: '#888', fontSize: '16px' }}>Overview of all your digital invitations.</p>
          </div>
          <Link href="/dashboard/buat" style={btnPrimaryMain}>
             + New Invitation
          </Link>
        </header>

        {/* --- GRID LIST --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!undanganList || undanganList.length === 0 ? (
            <div style={emptyStateStyle}>
              <p style={{ color: '#888' }}>No invitations found. Create one to get started.</p>
            </div>
          ) : (
            undanganList.map((u: Undangan) => (
              <InvitationModernCard key={u.id} u={u} />
            ))
          )}
        </div>
      </section>
    </main>
  )
}

function SidebarLink({ href, children, active = false }: { href: string, children: React.ReactNode, active?: boolean }) {
  return (
    <Link href={href} style={{
      padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', 
      fontSize: '14px', fontWeight: active ? 700 : 500,
      background: active ? '#f0f7ff' : 'transparent',
      color: active ? '#3b82f6' : '#666',
      transition: 'all 0.2s'
    }}>
      {children}
    </Link>
  )
}

function InvitationModernCard({ u }: { u: Undangan }) {
  return (
    <div className="modern-card" style={{
      background: '#fff', borderRadius: '20px', border: '1px solid #f2f2f2',
      padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Visual */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px', overflow: 'hidden',
          background: '#f9f9f9', border: '1px solid #f2f2f2', flexShrink: 0
        }}>
          {u.foto_url ? (
            <img src={u.foto_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Mempelai" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>💍</div>
          )}
        </div>

        {/* Info */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#000', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {u.mempelai_1} & {u.mempelai_2}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span style={{ fontSize: '13px', color: '#888' }}>/u/{u.slug}</span>
             <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ddd' }} />
             <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>● LIVE</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', background: '#f9f9f9', padding: '4px', borderRadius: '12px', gap: '4px' }}>
           <Link href={`/u/${u.slug}`} target="_blank" style={iconActionBtn} title="Preview">👁️</Link>
           <Link href={`/dashboard/${u.id}/edit`} style={iconActionBtn} title="Settings">⚙️</Link>
           <Link href={`/dashboard/${u.id}/tamu`} style={iconActionBtn} title="Guests">👥</Link>
        </div>
        <Link href={`/dashboard/${u.id}/rsvp`} style={btnPrimaryRSVP}>
           Laporan RSVP
        </Link>
      </div>

      <style>{`
        .modern-card:hover {
          transform: scale(1.01);
          box-shadow: 0 12px 30px rgba(0,0,0,0.04);
          border-color: #e2e2e2;
        }
      `}</style>
    </div>
  )
}

// Styled Components
const btnPrimaryMain: React.CSSProperties = {
  background: '#000', color: '#fff', padding: '14px 28px',
  borderRadius: '12px', fontSize: '15px', fontWeight: 700, textDecoration: 'none',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'all 0.2s'
}

const btnPrimaryRSVP: React.CSSProperties = {
  background: '#3b82f6', color: '#fff', padding: '12px 24px',
  borderRadius: '12px', fontSize: '14px', fontWeight: 700, textDecoration: 'none',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)', transition: 'all 0.2s'
}

const iconActionBtn: React.CSSProperties = {
  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: '10px', textDecoration: 'none', background: '#fff', border: '1px solid #f2f2f2',
  fontSize: '18px', transition: 'all 0.2s'
}

const emptyStateStyle: React.CSSProperties = {
  padding: '60px', textAlign: 'center', border: '1px dashed #eee', borderRadius: '24px'
}
