import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: '"Outfit", sans-serif', overflowX: 'hidden' }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />

      {/* Navigation */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 5%', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)', zIndex: 1000
      }}>
        <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Undangan<span style={{ color: '#0070f3' }}>Digital</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {user ? (
            <Link href="/dashboard" style={btnPrimary}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: 'none', color: '#111', fontSize: '15px', fontWeight: 500 }}>Masuk</Link>
              <Link href="/login" style={btnPrimary}>Mulai Gratis</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        padding: '100px 5% 140px', textAlign: 'center', position: 'relative',
        background: 'radial-gradient(circle at 50% 50%, #f0f7ff 0%, #fff 70%)'
      }}>
        <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{
            background: '#eef6ff', color: '#0070f3', padding: '6px 16px',
            borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '24px', display: 'inline-block'
          }}>
            #1 Digital Invitation Builder in Indonesia
          </span>
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 700, lineHeight: 1.1,
            letterSpacing: '-2px', marginBottom: '24px'
          }}>
            Buat Undangan Pernikahan <br />
            <span style={{
              background: 'linear-gradient(90deg, #0070f3, #00d1ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Digital Premium</span> Dalam Menit.
          </h1>
          <p style={{ fontSize: '19px', color: '#555', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Cara paling modern, hemat, dan elegan untuk mengundang orang-orang tersayang. Lengkap dengan Musik, Galeri, RSVP, dan WA Blast.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ ...btnPrimary, padding: '16px 32px', fontSize: '16px' }}>Buat Sekarang — Gratis</Link>
            <a href="#features" style={{ ...btnSecondary, padding: '16px 32px', fontSize: '16px' }}>Lihat Fitur</a>
          </div>
        </div>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '200px', background: 'rgba(0,112,243,0.05)', filter: 'blur(100px)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
      </header>

      {/* Features Grid */}
      <section id="features" style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>Fitur Tanpa Batas</h2>
          <p style={{ color: '#666' }}>Semua yang kamu butuhkan untuk undangan yang berkesan ada di sini.</p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px', maxWidth: '1200px', margin: '0 auto'
        }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={featureCardStyle}>
              <div style={{
                width: '50px', height: '50px', background: f.bg, borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
                fontSize: '24px'
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>{f.title}</h3>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '15px' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preview Section */}
      <section style={{ padding: '100px 5%', background: '#fafafa' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '80px', flexWrap: 'wrap-reverse' }}>
          <div style={{ position: 'relative', width: '300px', height: '600px', background: '#111', borderRadius: '40px', border: '8px solid #333', overflow: 'hidden', boxShadow: '0 50px 100px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '100%', height: '100%', background: '#fff', padding: '20px', textAlign: 'center' }}>
               <div style={{ fontSize: '10px', color: '#ccc', marginBottom: '20px' }}>undangan-kita.com/u/budi-siti</div>
               <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', marginTop: '40px' }}>Budi & Siti</div>
               <p style={{ fontSize: '10px', marginTop: '10px' }}>12 Desember 2026</p>
               <div style={{ width: '100%', height: '200px', background: '#eee', borderRadius: '10px', marginTop: '30px' }} />
               <button style={{ marginTop: '30px', width: '100%', padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '10px' }}>BUKA UNDANGAN</button>
            </div>
          </div>
          <div style={{ maxWidth: '500px' }}>
             <h2 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2 }}>Desain Yang Hidup <br/> & Responsif.</h2>
             <p style={{ fontSize: '18px', color: '#666', lineHeight: 1.6, marginBottom: '32px' }}>
                Undangan kamu akan terlihat cantik di semua perangkat. Dari iPhone terbaru hingga laptop, tamu kamu akan merasakan pengalaman yang sama mewahnya.
             </p>
             <ul style={{ listStyle: 'none', padding: 0 }}>
               {['Musik Latar Otomatis', 'Galeri Foto Lightbox', 'Countdown Timer Real-time'].map((item, i) => (
                 <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontWeight: 500 }}>
                    <div style={{ color: '#27ae60' }}>✓</div> {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 5% 40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
         <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Undangan Digital</div>
         <p style={{ color: '#888', fontSize: '14px' }}>&copy; 2026 Undangan Digital. Made with ❤️ for your big day.</p>
      </footer>

      <style>{`
        body { margin: 0; }
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          border-color: #0070f3 !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 1s ease-out; }
      `}</style>
    </div>
  )
}

const btnPrimary: React.CSSProperties = {
  background: '#111',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  transition: 'all 0.2s',
  border: 'none',
  cursor: 'pointer'
}

const btnSecondary: React.CSSProperties = {
  background: '#fff',
  color: '#111',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  transition: 'all 0.2s',
  border: '1px solid #e0e0e0',
  cursor: 'pointer'
}

const featureCardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '40px',
  borderRadius: '24px',
  border: '1px solid #f0f0f0',
  transition: 'all 0.3s ease',
}

const features = [
  { icon: '🎵', title: 'Musik Latar', desc: 'Putar lagu favorit kamu secara otomatis saat undangan dibuka.', bg: '#fff0f6' },
  { icon: '📸', title: 'Galeri Foto', desc: 'Tampilkan momen indah kamu dalam galeri foto interaktif yang cantik.', bg: '#f0f5ff' },
  { icon: '⏱️', title: 'Live Countdown', desc: 'Hitung mundur waktu menuju hari bahagia kamu secara real-time.', bg: '#fff7e6' },
  { icon: '✅', title: 'Konfirmasi RSVP', desc: 'Terima konfirmasi kehadiran tamu secara langsung di dashboard kamu.', bg: '#f6ffed' },
  { icon: '🚀', title: 'WA Blast', desc: 'Kirim ratusan undangan ke WhatsApp tamu dalam satu klik saja.', bg: '#e6fffb' },
  { icon: '🗺️', title: 'Google Maps', desc: 'Memudahkan tamu menemukan lokasi acara dengan integrasi peta.', bg: '#fff1f0' },
]
