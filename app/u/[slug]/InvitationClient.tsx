'use client'

import { useState, useEffect } from 'react'
import RSVPForm from './RSVPForm'
import GuestbookForm from './GuestbookForm'
import Countdown from './Countdown'
import MusicPlayer from './MusicPlayer'
import Gallery from './Gallery'
import type { Undangan, Tamu } from '@/lib/supabase/types'
import Swal from 'sweetalert2'

export default function InvitationClient({
  undangan: u, tamu, guestbook, token
}: {
  undangan: Undangan
  tamu: Tamu | null
  guestbook: any[]
  token?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleReveal = () => {
     const reveals = document.querySelectorAll('.reveal')
     reveals.forEach(el => {
        const windowHeight = window.innerHeight
        const revealTop = el.getBoundingClientRect().top
        const revealPoint = 50 // Trigger point

        if (revealTop < windowHeight - revealPoint && revealTop > -el.clientHeight + revealPoint) {
           el.classList.add('active')
        } else {
           el.classList.remove('active')
        }
     })
  }

  useEffect(() => {
    if (!isOpen) return;
    
    // Trigger initially so the hero section appears without scrolling
    setTimeout(handleReveal, 50);
    
    window.addEventListener('scroll', handleReveal)
    return () => window.removeEventListener('scroll', handleReveal)
  }, [isOpen]);

  // Date Formatting
  const tglResepsi = u.tanggal_resepsi ? new Date(u.tanggal_resepsi) : null
  const tglFormatted = tglResepsi
    ? tglResepsi.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      })
    : ''

  const tglAkad = u.tanggal_akad ? new Date(u.tanggal_akad) : null
  const waktuAkad = tglAkad ? tglAkad.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''
  const waktuResepsi = tglResepsi ? tglResepsi.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''

  // Theme Config
  const tema = (u.tema || 'mono') as string
  interface ThemeConfig {
    bg: string; text: string; muted: string; accent: string; card: string; border: string; secondary: string; fontSerif: string;
  }
  const themeStyles: Record<string, ThemeConfig> = {
    mono: { bg: '#ffffff', text: '#111827', muted: '#6b7280', accent: '#111827', card: '#ffffff', border: '#e5e7eb', secondary: '#f9fafb', fontSerif: "'Cormorant Garamond', serif" },
    sage: { bg: '#fbfcfb', text: '#2d332a', muted: '#707a6d', accent: '#5a6b55', card: '#ffffff', border: '#e8ece7', secondary: '#f4f6f3', fontSerif: "'Cormorant Garamond', serif" },
    midnight: { bg: '#0f172a', text: '#f8fafc', muted: '#94a3b8', accent: '#fbbf24', card: '#1e293b', border: '#334155', secondary: '#1e293b', fontSerif: "'Cormorant Garamond', serif" },
    emerald: { bg: '#062c1e', text: '#ecfdf5', muted: '#a7f3d0', accent: '#fbbf24', card: 'rgba(6, 44, 30, 0.8)', border: '#064e3b', secondary: '#064e3b', fontSerif: "'Cormorant Garamond', serif" },
    maroon: { bg: '#2d0a0a', text: '#fff1f1', muted: '#fecaca', accent: '#d4af37', card: 'rgba(45, 10, 10, 0.8)', border: '#451a1a', secondary: '#451a1a', fontSerif: "'Cormorant Garamond', serif" },
    champagne: { bg: '#fdfcf0', text: '#4a3728', muted: '#8c7851', accent: '#c5a059', card: '#ffffff', border: '#e8e4c9', secondary: '#f9f7e8', fontSerif: "'Cormorant Garamond', serif" },
    navy: { bg: '#0a192f', text: '#e6f1ff', muted: '#8892b0', accent: '#64ffda', card: 'rgba(10, 25, 47, 0.8)', border: '#112240', secondary: '#112240', fontSerif: "'Cormorant Garamond', serif" },
    lavender: { bg: '#f3f0f5', text: '#3c2a4d', muted: '#7d6b8d', accent: '#9b7eb1', card: '#ffffff', border: '#e0d8e6', secondary: '#f9f7fa', fontSerif: "'Cormorant Garamond', serif" }
  }
  const s = themeStyles[tema] || themeStyles.mono

  // Utility Styles
  const btnStyle = (accent: string, tema: string): React.CSSProperties => ({
    background: accent, color: tema === 'midnight' || tema === 'emerald' || tema === 'maroon' || tema === 'navy' ? '#000' : '#fff', border: 'none', borderRadius: '12px', padding: '10px 24px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', display: 'inline-block'
  })

  const igBtnStyle = (borderColor: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: s.text, textDecoration: 'none', padding: '8px 24px', borderRadius: '24px', border: `1px solid ${borderColor}`, background: s.card, fontWeight: 600, transition: 'all 0.3s'
  })

  const getGoogleCalendarLink = (title: string, date: Date, location: string, address: string) => {
    const start = date.toISOString().replace(/-|:|\.\d\d\d/g, '')
    const end = new Date(date.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '')
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(`Pernikahan ${u.mempelai_1} & ${u.mempelai_2}`)}&location=${encodeURIComponent(address || location)}`
  }

  const galleryImages = (u.gallery_urls && u.gallery_urls.length > 0) ? u.gallery_urls : []

  // --- COVER / OPENING ---
  if (!isOpen) {
    return (
      <main style={{ height: '100vh', width: '100vw', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Cinzel:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
          :root {
            --font-script: 'Pinyon Script', cursive;
            --font-heading: 'Cinzel', serif;
            --font-body: 'Outfit', sans-serif;
          }
          * { font-family: var(--font-body); }
          h1, h2, h3 { font-family: var(--font-heading); letter-spacing: 2px; }
          .font-script { font-family: var(--font-script); }
        `}</style>
        
        <style>{`
          @keyframes zoomBackground {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatCard {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        <div style={{ position: 'absolute', inset: 0, zIndex: 1, animation: 'zoomBackground 20s linear infinite alternate' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${s.bg}CC, ${s.bg}88, ${s.bg}CC)`, zIndex: 2 }}></div>
          <img src={u.foto_url || ''} alt="Bg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '550px', width: '90%', padding: '60px 30px', animation: 'fadeInUp 1.5s ease-out' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.6em', color: s.muted, textTransform: 'uppercase', marginBottom: '24px', fontWeight: 500 }}>The Wedding Celebration Of</p>
          <h1 style={{ fontSize: '72px', color: s.text, fontWeight: 400, margin: '0 0 32px', lineHeight: 1.1 }} className="font-script">{u.mempelai_1} & {u.mempelai_2}</h1>
          
          {tamu && (
             <div style={{ 
               marginBottom: '48px', 
               padding: '40px 20px', 
               background: 'rgba(255, 255, 255, 0.03)', 
               borderRadius: '30px', 
               border: `1px solid rgba(255, 255, 255, 0.1)`, 
               backdropFilter: 'blur(15px)',
               boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
               position: 'relative',
               animation: 'floatCard 4s ease-in-out infinite'
             }}>
                <div style={{ position: 'absolute', inset: '10px', border: `1px solid ${s.accent}22`, borderRadius: '22px', pointerEvents: 'none' }}></div>
                <p style={{ fontSize: '11px', color: s.muted, marginBottom: '16px', letterSpacing: '0.4em', textTransform: 'uppercase' }}>Special Invitation To:</p>
                <p style={{ fontSize: '32px', fontWeight: 600, color: s.accent, margin: 0, fontFamily: 'var(--font-heading)', letterSpacing: '2px' }}>{tamu.nama}</p>
             </div>
          )}

          <button 
            onClick={() => setIsOpen(true)} 
            style={{ 
              background: s.accent, 
              color: tema === 'midnight' ? '#000' : '#fff', 
              border: 'none', 
              borderRadius: '50px', 
              padding: '22px 64px', 
              fontSize: '14px', 
              fontWeight: 700, 
              cursor: 'pointer', 
              boxShadow: `0 15px 35px ${s.accent}44`, 
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', 
              letterSpacing: '0.3em',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 20px 45px ${s.accent}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = `0 15px 35px ${s.accent}44`;
            }}
          >
            Open Invitation
          </button>
        </div>
      </main>
    )
  }

  // --- MAIN CONTENT ---
  return (
    <main style={{ background: s.bg, color: s.text, minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cinzel:wght@400;700;900&family=Pinyon+Script&family=Montserrat:wght@300;400;600&display=swap');

        h1, h2, h3 { font-family: 'Cinzel', serif !important; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; }
        .font-script { font-family: 'Pinyon Script', cursive !important; text-transform: none !important; letter-spacing: 0 !important; }
        body, p, span, div { font-family: 'Cormorant Garamond', serif; }
        
        .luxury-line {
          width: 80px;
          height: 1px;
          background: ${s.accent};
          margin: 15px auto;
          position: relative;
        }
        .luxury-line::before, .luxury-line::after {
          content: "";
          position: absolute;
          top: -2px;
          width: 5px;
          height: 5px;
          background: ${s.accent};
          border-radius: 50%;
        }
        .luxury-line::before { left: -10px; }
        .luxury-line::after { right: -10px; }

        .luxury-card {
          background: ${s.card};
          border: 1px solid ${s.border};
          position: relative;
          padding: 40px 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          backdrop-filter: blur(10px);
          transition: all 0.5s ease;
        }
        .luxury-card::after {
          content: "";
          position: absolute;
          inset: 5px;
          border: 1px solid ${s.border};
          pointer-events: none;
          opacity: 0.5;
        }

        .nav-link {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          color: ${s.accent};
          opacity: 0.6;
        }
        .nav-link:hover {
          transform: translateY(-8px) scale(1.3);
          opacity: 1;
          filter: drop-shadow(0 0 5px ${s.accent});
        }

        /* --- FLOATING PETALS ANIMATION --- */
        .petal {
          position: fixed;
          background-color: #ffb7c5;
          border-radius: 150% 0 150% 0;
          opacity: 0.3;
          pointer-events: none;
          z-index: 50;
          animation: floatPetal 10s linear infinite;
        }
        @keyframes floatPetal {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) translateX(100px) rotate(360deg); opacity: 0; }
        }

        /* --- SPARKLE ANIMATION --- */
        .sparkle {
          position: fixed;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 50;
          animation: sparkleAnim 4s ease-in-out infinite;
        }
        @keyframes sparkleAnim {
          0%, 100% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 0.8; }
        }

        /* --- SNOW ANIMATION --- */
        .snow {
          position: fixed;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          z-index: 50;
          animation: snowAnim 10s linear infinite;
        }
        @keyframes snowAnim {
          0% { transform: translateY(-10vh) translateX(0); opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(50px); opacity: 0.2; }
        }

        /* --- CONFETTI ANIMATION --- */
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          background: #d4af37;
          pointer-events: none;
          z-index: 50;
          animation: confettiAnim 7s linear infinite;
        }
        @keyframes confettiAnim {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        /* Background Pattern Logic */
        body {
          background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
          background-attachment: fixed;
          background-color: ${s.bg};
        }

        /* --- VARIED SCROLL ANIMATIONS --- */
        .reveal {
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal-up { transform: translateY(50px); }
        .reveal-left { transform: translateX(-50px); }
        .reveal-right { transform: translateX(50px); }
        .reveal-zoom { transform: scale(0.9); }

        .reveal.active {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 768px) {
          h1.hero-title { font-size: 56px !important; }
          .font-script { font-size: 42px !important; }
          h1 { font-size: 32px !important; }
          h2 { font-size: 28px !important; }
          p { font-size: 16px !important; }
          .luxury-card { padding: 30px 16px !important; }
          .floating-nav { 
            width: 90%; 
            padding: 10px 15px !important; 
            gap: 15px !important;
            bottom: 16px !important;
          }
          .nav-link svg { width: 20px; height: 20px; }
          section { padding: 60px 0 !important; }
        }
      `}} />
      
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      
      <MusicPlayer musicUrl={u.music_url || undefined} accentColor={s.accent} cardBg={s.card} borderColor={s.border} />

      {/* Floating Animation Effect */}
      {u.animation_type === 'petals' && (
        <div className="petals-container">
           {[...Array(12)].map((_, i) => (
              <div key={i} className="petal" style={{
                 left: `${Math.random() * 100}vw`,
                 width: `${Math.random() * 10 + 10}px`,
                 height: `${Math.random() * 10 + 10}px`,
                 animationDelay: `${Math.random() * 10}s`,
                 animationDuration: `${Math.random() * 5 + 10}s`
              }} />
           ))}
        </div>
      )}

      {u.animation_type === 'sparkle' && (
        <div className="sparkle-container">
           {[...Array(20)].map((_, i) => (
              <div key={i} className="sparkle" style={{
                 left: `${Math.random() * 100}vw`,
                 top: `${Math.random() * 100}vh`,
                 width: `${Math.random() * 4 + 2}px`,
                 height: `${Math.random() * 4 + 2}px`,
                 animationDelay: `${Math.random() * 4}s`,
                 boxShadow: `0 0 10px white`
              }} />
           ))}
        </div>
      )}

      {u.animation_type === 'snow' && (
        <div className="snow-container">
           {[...Array(30)].map((_, i) => (
              <div key={i} className="snow" style={{
                 left: `${Math.random() * 100}vw`,
                 width: `${Math.random() * 5 + 2}px`,
                 height: `${Math.random() * 5 + 2}px`,
                 animationDelay: `${Math.random() * 10}s`,
                 animationDuration: `${Math.random() * 5 + 5}s`
              }} />
           ))}
        </div>
      )}

      {u.animation_type === 'confetti' && (
        <div className="confetti-container">
           {[...Array(25)].map((_, i) => (
              <div key={i} className="confetti" style={{
                 left: `${Math.random() * 100}vw`,
                 background: i % 2 === 0 ? '#d4af37' : '#c5a059',
                 width: `${Math.random() * 8 + 4}px`,
                 height: `${Math.random() * 8 + 4}px`,
                 animationDelay: `${Math.random() * 7}s`,
                 borderRadius: i % 3 === 0 ? '50%' : '2px'
              }} />
           ))}
        </div>
      )}

        {/* --- HERO SECTION --- */}
        <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px', position: 'relative' }}>
           <div style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
              <img src={u.bg_hero || u.foto_url || ''} alt="Bg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           </div>
           <div className="reveal reveal-up" style={{ zIndex: 10 }}>
              <p style={{ fontSize: '12px', letterSpacing: '0.5em', color: s.muted, textTransform: 'uppercase', marginBottom: '24px' }}>The Wedding Celebration of</p>
              <h1 className="hero-title font-script" style={{ fontSize: '84px', fontWeight: 400, color: s.accent, margin: '0 0 24px', lineHeight: 1 }}>{u.mempelai_1} & {u.mempelai_2}</h1>
              <div style={{ width: '60px', height: '1px', background: s.accent, margin: '32px auto', opacity: 0.3 }}></div>
              <p style={{ fontSize: '18px', color: s.text, letterSpacing: '0.2em' }}>{tglFormatted}</p>
           </div>
           <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll Down</p>
              <div style={{ width: '1px', height: '40px', background: s.text, margin: '8px auto' }}></div>
           </div>
        </section>

          {/* --- AYAT SECTION --- */}
          <section className="reveal reveal-up" style={{ padding: '100px 0', textAlign: 'center' }}>
             <div className="luxury-line"></div>
             <p style={{ fontSize: '20px', lineHeight: 2.2, color: s.text, fontStyle: 'italic', marginBottom: '32px', fontWeight: 400, maxWidth: '500px', margin: '0 auto 32px' }}>
                "Dan diantara tanda-tanda kebesaran-Nya ialah diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapatkan ketenangan hati..."
             </p>
             <h3 style={{ fontSize: '14px', letterSpacing: '4px', color: s.accent, fontWeight: 700 }}>QS. AR-RUUM : 21</h3>
             <div className="luxury-line"></div>
          </section>

          {/* --- MEMPELAI SECTION --- */}
          <section id="mempelai" style={{ padding: '60px 0' }}>
             <div className="reveal reveal-zoom luxury-card" style={{ textAlign: 'center' }}>
                <div className="reveal reveal-left" style={{ marginBottom: '80px' }}>
                   <div style={{ width: '180px', height: '240px', borderRadius: '4px', overflow: 'hidden', margin: '0 auto 32px', border: `1px solid ${s.border}`, padding: '10px', background: '#fff' }}>
                      <img src={u.foto_mempelai_1 || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                   <h2 style={{ fontSize: '48px', margin: '0 0 8px', color: s.accent }} className="font-script">{u.mempelai_1}</h2>
                   <div className="luxury-line" style={{ width: '40px' }}></div>
                   <p style={{ fontSize: '16px', color: s.muted, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: 600 }}>Putra dari</p>
                   <p style={{ fontSize: '18px', color: s.text, fontWeight: 400 }}>Bapak {u.ortu_mempelai_1?.split('&')[0]} & Ibu {u.ortu_mempelai_1?.split('&')[1]}</p>
                   {u.ig_mempelai_1 && <a href={`https://instagram.com/${u.ig_mempelai_1}`} target="_blank" style={{ fontSize: '14px', color: s.accent, textDecoration: 'none', borderBottom: `1px solid ${s.accent}`, marginTop: '16px', display: 'inline-block' }}>@ {u.ig_mempelai_1}</a>}
                </div>
                
                <div style={{ fontSize: '32px', color: s.accent, margin: '40px 0' }} className="font-script">With</div>

                <div className="reveal reveal-right">
                   <div style={{ width: '180px', height: '240px', borderRadius: '4px', overflow: 'hidden', margin: '0 auto 32px', border: `1px solid ${s.border}`, padding: '10px', background: '#fff' }}>
                      <img src={u.foto_mempelai_2 || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                   <h2 style={{ fontSize: '48px', margin: '0 0 8px', color: s.accent }} className="font-script">{u.mempelai_2}</h2>
                   <div className="luxury-line" style={{ width: '40px' }}></div>
                   <p style={{ fontSize: '16px', color: s.muted, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: 600 }}>Putri dari</p>
                   <p style={{ fontSize: '18px', color: s.text, fontWeight: 400 }}>Bapak {u.ortu_mempelai_2?.split('&')[0]} & Ibu {u.ortu_mempelai_2?.split('&')[1]}</p>
                   {u.ig_mempelai_2 && <a href={`https://instagram.com/${u.ig_mempelai_2}`} target="_blank" style={{ fontSize: '14px', color: s.accent, textDecoration: 'none', borderBottom: `1px solid ${s.accent}`, marginTop: '16px', display: 'inline-block' }}>@ {u.ig_mempelai_2}</a>}
                </div>
             </div>
          </section>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
         {/* Quote Personal */}
         <section className="reveal" style={{ textAlign: 'center', padding: '60px 0', opacity: 0, transform: 'translateY(20px)', transition: 'all 0.8s' }}>
            <p style={{ fontSize: '20px', lineHeight: 1.8, color: s.muted, fontStyle: 'italic', fontWeight: 400 }}>
               "{u.quote || "Maka terikatlah dua hati dalam satu janji suci, melangkah bersama menuju Ridho Ilahi."}"
            </p>
         </section>

          {/* --- EVENT SECTION --- */}
          <section id="event" style={{ padding: '100px 0' }}>
             <div className="reveal reveal-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '32px', letterSpacing: '6px' }}>Wedding Event</h2>
                <div className="luxury-line"></div>
                <p style={{ color: s.muted, fontSize: '16px', marginTop: '12px' }}>Kami mengundang bapak/ibu untuk hadir pada:</p>
             </div>

             {(u.tanggal_resepsi || u.tanggal_akad) && (
               <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                 <Countdown 
                    targetDate={(u.tanggal_resepsi || u.tanggal_akad) as string} 
                    accentColor={s.accent} 
                    mutedColor={s.muted} 
                    cardBg={s.card} 
                    borderColor={s.border} 
                 />
               </div>
             )}

             <div className="reveal reveal-zoom luxury-card" style={{ display: 'grid', gap: '40px', background: 'rgba(255,255,255,0.6)' }}>
                {/* Akad */}
                <div style={{ textAlign: 'center', borderBottom: `1px solid ${s.border}`, paddingBottom: '40px' }}>
                   <h3 style={{ fontSize: '24px', letterSpacing: '4px', marginBottom: '24px', color: s.accent }}>AKAD NIKAH</h3>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
                      <div style={{ height: '1px', flex: 1, background: s.border }}></div>
                      <p style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>{waktuAkad} WIB</p>
                      <div style={{ height: '1px', flex: 1, background: s.border }}></div>
                   </div>
                   <p style={{ fontSize: '18px', color: s.text, fontWeight: 600, marginBottom: '8px' }}>{u.lokasi_akad}</p>
                   <p style={{ fontSize: '16px', color: s.muted, lineHeight: 1.8 }}>{u.alamat_akad}</p>
                   <a href={(u as any).maps_url_resepsi || (u as any).maps_url_akad || u.maps_url || '#'} target="_blank" style={{ display: 'inline-block', marginTop: '32px', padding: '14px 40px', background: s.accent, color: s.bg, borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, letterSpacing: '2px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>LIHAT LOKASI</a>
                </div>
                {/* Resepsi */}
                <div style={{ textAlign: 'center' }}>
                   <h3 style={{ fontSize: '24px', letterSpacing: '4px', marginBottom: '24px', color: s.accent }}>RESEPSI</h3>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
                      <div style={{ height: '1px', flex: 1, background: s.border }}></div>
                      <p style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>{waktuResepsi} WIB - Selesai</p>
                      <div style={{ height: '1px', flex: 1, background: s.border }}></div>
                   </div>
                   <p style={{ fontSize: '18px', color: s.text, fontWeight: 600, marginBottom: '8px' }}>{u.lokasi_resepsi}</p>
                   <p style={{ fontSize: '16px', color: s.muted, lineHeight: 1.8 }}>{u.alamat_resepsi}</p>
                   <a href={(u as any).maps_url_resepsi || (u as any).maps_url_akad || u.maps_url || '#'} target="_blank" style={{ display: 'inline-block', marginTop: '32px', padding: '14px 40px', background: s.accent, color: s.bg, borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, letterSpacing: '2px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>LIHAT LOKASI</a>
                </div>
             </div>
          </section>

         {/* Map Section */}
         {((u as any).maps_url_resepsi || (u as any).maps_url_akad || u.maps_url) && (
            <section style={{ padding: '80px 0', textAlign: 'center' }}>
               <h3 style={{ fontSize: '24px', letterSpacing: '4px' }}>Lokasi Acara</h3>
               <div className="luxury-line"></div>
               <div className="luxury-card" style={{ padding: '10px', height: '400px', marginBottom: '32px' }}>
                  <iframe src={(u.maps_url || '').includes('google.com/maps/embed') ? (u.maps_url as string) : `https://www.google.com/maps?q=${encodeURIComponent(u.alamat_resepsi || u.lokasi_resepsi || '')}&output=embed`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
               </div>
               <p style={{ fontSize: '18px', color: s.muted, lineHeight: 1.8, maxWidth: '500px', margin: '0 auto 32px' }}>
                  {u.alamat_resepsi || u.alamat_akad || 'Alamat belum diatur'}
               </p>
               <a href={(u as any).maps_url_resepsi || (u as any).maps_url_akad || u.maps_url || '#'} target="_blank" style={{ display: 'inline-block', padding: '14px 40px', background: s.accent, color: s.bg, borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, letterSpacing: '2px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>BUKA GOOGLE MAPS</a>
            </section>
         )}

          {/* --- GALLERY SECTION --- */}
          <section id="gallery" style={{ padding: '100px 0' }}>
             <div className="reveal reveal-up" style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '32px', letterSpacing: '6px' }}>Our Moments</h2>
                <div className="luxury-line"></div>
             </div>
             <div className="reveal reveal-zoom luxury-card" style={{ marginTop: '40px' }}>
                <Gallery images={galleryImages} accentColor={s.accent} mutedColor={s.muted} cardBg={s.card} borderColor={s.border} />
             </div>
          </section>

          {/* --- GIFT SECTION --- */}
          {u.wedding_gift && (u.wedding_gift as any[]).length > 0 && (
             <section id="gift" style={{ padding: '100px 0' }}>
                <div className="reveal reveal-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
                   <h2 style={{ fontSize: '32px', letterSpacing: '6px' }}>Wedding Gift</h2>
                   <div className="luxury-line"></div>
                   <p style={{ color: s.muted, fontSize: '18px', marginTop: '12px' }}>Tanda kasih untuk kedua mempelai:</p>
                </div>
                <div style={{ display: 'grid', gap: '20px' }}>
                   {(u.wedding_gift as any[]).map((bank, i) => {
                      const bankName = bank.bank?.toLowerCase() || '';
                      let logoUrl = "";
                      if (bankName.includes('bca')) logoUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg";
                      else if (bankName.includes('bri')) logoUrl = "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_Logo.svg";
                      else if (bankName.includes('bni')) logoUrl = "https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg";
                      else if (bankName.includes('mandiri')) logoUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg";

                      return (
                        <div key={i} className="reveal reveal-up luxury-card" style={{ textAlign: 'center' }}>
                           <div style={{ height: '35px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {logoUrl ? (
                                <img src={logoUrl} style={{ height: '100%', maxWidth: '140px', objectFit: 'contain', filter: tema === 'midnight' ? 'brightness(0) invert(1)' : 'none' }} alt={bank.bank} />
                              ) : (
                                <p style={{ fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: s.accent, margin: 0 }}>{bank.bank}</p>
                              )}
                           </div>
                           <p style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '2px', margin: '0 0 8px', color: s.accent }}>{bank.acc}</p>
                           <p style={{ fontSize: '18px', color: s.text, fontWeight: 600 }}>a.n {bank.owner}</p>
                           <button 
                              onClick={() => { 
                                 navigator.clipboard.writeText(bank.acc); 
                                 Swal.fire({
                                    title: 'Tersalin!',
                                    text: `Nomor rekening ${bank.acc} berhasil disalin.`,
                                    icon: 'success',
                                    confirmButtonColor: s.accent,
                                    timer: 2000,
                                    showConfirmButton: false
                                 });
                              }}
                              style={{ marginTop: '24px', background: 'none', border: `1px solid ${s.border}`, padding: '10px 24px', cursor: 'pointer', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: s.accent }}
                           >Salin Rekening</button>
                        </div>
                      );
                   })}
                </div>
             </section>
          )}

          {/* --- RSVP SECTION --- */}
          <section id="rsvp" style={{ padding: '100px 0' }}>
             <div className="reveal reveal-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '48px', color: s.accent }} className="font-script">Doa & Ucapan</h2>
                <div className="luxury-line"></div>
             </div>
             <div className="reveal reveal-up luxury-card">
                <RSVPForm token={token || ''} undanganId={u.id} namaTamu={tamu?.nama} />
             </div>
             <div style={{ marginTop: '40px' }}>
                <div className="reveal reveal-up">
                   <GuestbookForm undanganId={u.id} accentColor={s.accent} />
                </div>
                <div className="reveal reveal-up luxury-card" style={{ marginTop: '40px', padding: 0 }}>
                   {guestbook.map((g: any, index: number) => {
                      const date = new Date(g.created_at || Date.now());
                      const formattedDate = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      const formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                      return (
                         <div key={g.id} style={{ padding: '32px', borderBottom: `1px solid ${s.border}`, display: 'flex', gap: '24px' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: s.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, color: s.accent, border: `1px solid ${s.border}` }}>{g.nama?.charAt(0)}</div>
                            <div style={{ flex: 1 }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                  <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{g.nama}</p>
                                  <p style={{ fontSize: '12px', color: s.muted, margin: 0 }}>{formattedDate} • {formattedTime} WIB</p>
                               </div>
                               <p style={{ fontSize: '18px', color: s.text, marginTop: '8px', lineHeight: 1.6 }}>{g.ucapan}</p>
                            </div>
                         </div>
                      );
                   })}
                </div>
             </div>
          </section>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '60px 24px 120px', opacity: 0.8 }}>
         <h2 style={{ fontSize: '20px', fontWeight: 400, color: s.text }} className="font-script">{u.mempelai_1} & {u.mempelai_2}</h2>
         <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '12px', color: s.muted }}>Forever Starts Here • 2026</p>
      </footer>

      {/* Floating Nav */}
      <style>{`
        .floating-nav {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 12px 24px;
          border-radius: 50px;
          display: flex;
          gap: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          z-index: 1000;
          width: fit-content;
          max-width: 90vw;
          justify-content: center;
        }
      `}</style>
      <div className="floating-nav">
         <a href="#" className="nav-link" title="Opening">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
         </a>
         <a href="#event" className="nav-link" title="Acara">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
         </a>
         <a href="#gallery" className="nav-link" title="Galeri">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
         </a>
         <a href="#gift" className="nav-link" title="Hadiah">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
         </a>
         <a href="#rsvp" className="nav-link" title="Ucapan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
         </a>
      </div>
    </main>
  )
}
