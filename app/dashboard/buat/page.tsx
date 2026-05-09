'use client'

import { useActionState } from 'react'
import { createUndangan } from './actions'
import Link from 'next/link'

export default function BuatUndanganPage() {
  const [state, formAction, isPending] = useActionState(createUndangan, null)

  return (
    <main style={{ minHeight: '100vh', background: '#fff', paddingBottom: '100px', fontFamily: '"Inter", sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Modern Navbar */}
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
          <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>Buat Undangan Baru</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '60px' }}>
           <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em' }}>Mulai Undangan Baru</h1>
           <p style={{ color: '#64748b', fontSize: '16px' }}>Isi informasi lengkap di bawah ini untuk membuat undangan digital kamu.</p>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Section: URL */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>🔗 Alamat Undangan</h2>
              <p style={descStyle}>Pilih alamat URL yang unik untuk undangan kamu.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>URL Undangan (Slug)</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={prefixStyle}>/u/</span>
                  <input
                    name="slug"
                    placeholder="budi-siti"
                    required
                    style={{ ...inputStyle, borderRadius: '0 8px 8px 0' }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Mempelai */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>👫 Nama Mempelai</h2>
              <p style={descStyle}>Lengkapi nama dan upload foto sampul terbaik kalian.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Mempelai Pria</label>
                  <input name="mempelai_1" placeholder="Nama Panggilan" required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Mempelai Wanita</label>
                  <input name="mempelai_2" placeholder="Nama Panggilan" required style={inputStyle} />
                </div>
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>Foto Sampul Utama</label>
                <input type="file" name="foto_file" accept="image/*" style={inputStyle} />
              </div>
            </div>
          </section>

          {/* Section: Waktu */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>📅 Waktu Acara</h2>
              <p style={descStyle}>Atur jadwal Akad dan Resepsi pernikahan kalian.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Tanggal & Waktu Akad</label>
                  <input type="datetime-local" name="tanggal_akad" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Tanggal & Waktu Resepsi</label>
                  <input type="datetime-local" name="tanggal_resepsi" style={inputStyle} />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Lokasi */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>📍 Lokasi & Alamat</h2>
              <p style={descStyle}>Detail lokasi dan alamat lengkap untuk memandu tamu hadir.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Lokasi Akad</label>
                  <input name="lokasi_akad" placeholder="Gedung/Masjid/Rumah" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Lokasi Resepsi</label>
                  <input name="lokasi_resepsi" placeholder="Gedung/Masjid/Rumah" style={inputStyle} />
                </div>
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>Alamat Lengkap Resepsi</label>
                <textarea name="alamat_resepsi" placeholder="Jl. Merdeka No. 123..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>URL Google Maps</label>
                <input name="maps_url" placeholder="https://goo.gl/maps/..." style={inputStyle} />
              </div>
            </div>
          </section>

          {/* Section: Media */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>🎨 Musik & Galeri</h2>
              <p style={descStyle}>Tambahkan suasana dengan musik dan koleksi foto pre-wedding.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Pilih Tema Tampilan</label>
                <select name="tema" style={inputStyle}>
                  <option value="mono">Minimalist Monochrome</option>
                  <option value="sage">Modern Sage Green</option>
                  <option value="midnight">Elegant Midnight Blue</option>
                </select>
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>Kata Mutiara / Quote</label>
                <textarea name="quote" placeholder="Contoh: Maka terikatlah dua hati..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>Musik Latar (.mp3)</label>
                <input type="file" name="music_file" accept="audio/mpeg" style={{ ...inputStyle, padding: '8px' }} />
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Pilih file MP3 untuk diputar otomatis saat undangan dibuka.</p>
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>Upload Galeri Foto (Banyak file)</label>
                <input type="file" name="gallery_files" accept="image/*" multiple style={inputStyle} />
              </div>
            </div>
          </section>

          {/* Error Message */}
          {state?.error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px',
              padding: '16px', fontSize: '14px', color: '#ef4444', fontWeight: 500, width: '100%'
            }}>
              ⚠️ {state.error}
            </div>
          )}

          {/* Actions */}
          <div style={{
            paddingTop: '32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '16px'
          }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                background: '#0f172a', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '14px 32px', fontSize: '15px',
                fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1, transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
              }}
            >
              {isPending ? 'Sedang Memproses...' : 'Buat Undangan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

// STYLES
const formSectionStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gap: '40px',
  paddingBottom: '40px',
  borderBottom: '1px solid #f1f5f9'
}

const sectionHeaderStyle: React.CSSProperties = {
  paddingTop: '4px'
}

const h2Style: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#0f172a',
  marginBottom: '8px'
}

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  lineHeight: '1.6'
}

const sectionContentStyle: React.CSSProperties = {
  background: '#fff',
  padding: '0'
}

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column'
}

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#475569',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 0.2s'
}

const prefixStyle: React.CSSProperties = {
  padding: '12px 14px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRight: 'none',
  borderRadius: '8px 0 0 8px',
  fontSize: '14px',
  color: '#94a3b8',
  fontWeight: 500
}
