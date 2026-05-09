'use client'

import { useActionState, useEffect } from 'react'
import { createUndangan } from './actions'
import Link from 'next/link'
import Swal from 'sweetalert2'

export default function BuatUndanganPage() {
  const [state, formAction, isPending] = useActionState(createUndangan, null)

  useEffect(() => {
    if ((state as any)?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Membuat',
        text: (state as any).error,
        confirmButtonColor: '#0f172a'
      })
    }
  }, [state])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.preventDefault();
      const firstInvalid = form.querySelector(':invalid') as HTMLElement;
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }
  };

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

        <form action={formAction} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* --- SECTION 1: IDENTITAS --- */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>Informasi Dasar</h2>
              <p style={descStyle}>Atur alamat URL dan nama mempelai yang akan ditampilkan di undangan.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Alamat Undangan (Slug)</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={prefixStyle}>undangan.com/u/</span>
                  <input name="slug" required placeholder="budi-siti" style={{ ...inputStyle, borderRadius: '0 8px 8px 0' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Mempelai 1</label>
                  <input name="mempelai_1" required placeholder="Nama Panggilan 1" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Ayah Mempelai 1</label>
                  <input name="ayah_1" placeholder="Nama Ayah" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Ibu Mempelai 1</label>
                  <input name="ibu_1" placeholder="Nama Ibu" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Foto Mempelai 1</label>
                  <input type="file" name="foto_mempelai_1_file" accept="image/*" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Instagram Mempelai 1</label>
                  <input name="ig_mempelai_1" placeholder="@username" style={inputStyle} />
                </div>

                <div style={{ ...inputGroupStyle, gridColumn: 'span 2', height: '1px', background: '#f1f5f9', margin: '10px 0' }}></div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Mempelai 2</label>
                  <input name="mempelai_2" required placeholder="Nama Panggilan 2" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Ayah Mempelai 2</label>
                  <input name="ayah_2" placeholder="Nama Ayah" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Nama Ibu Mempelai 2</label>
                  <input name="ibu_2" placeholder="Nama Ibu" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Foto Mempelai 2</label>
                  <input type="file" name="foto_mempelai_2_file" accept="image/*" style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Instagram Mempelai 2</label>
                  <input name="ig_mempelai_2" placeholder="@username" style={inputStyle} />
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 2: FOTO UTAMA --- */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>Foto Sampul</h2>
              <p style={descStyle}>Gunakan foto terbaik kamu untuk halaman depan undangan.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{
                  width: '120px', height: '120px', borderRadius: '16px', background: '#f1f5f9',
                  overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '32px' }}>💍</span>
                </div>
                <div style={{ flex: 1 }}>
                  <input type="file" name="foto_file" accept="image/*" style={{ fontSize: '13px', color: '#64748b' }} />
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Maksimum file 2MB. Format JPG, PNG.</p>
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 3: JADWAL & LOKASI --- */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>Waktu & Tempat</h2>
              <p style={descStyle}>Informasi detail mengenai kapan dan di mana acara akan berlangsung.</p>
            </div>
            <div style={sectionContentStyle}>
              {/* Akad Nikah */}
              <div style={{ marginBottom: '32px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>🏛️ AKAD NIKAH</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Tanggal & Jam Akad</label>
                      <input type="datetime-local" name="tanggal_akad" required style={inputStyle} />
                    </div>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Nama Lokasi (Gedung/Rumah)</label>
                      <input name="lokasi_akad" placeholder="Masjid Agung / Kediaman Mempelai" style={inputStyle} />
                    </div>
                </div>
                <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                  <label style={labelStyle}>Alamat Lengkap Akad</label>
                  <textarea name="alamat_akad" required style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
                </div>
                <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                  <label style={labelStyle}>Link Google Maps Akad</label>
                  <input name="maps_url_akad" placeholder="https://goo.gl/maps/..." style={inputStyle} />
                </div>
              </div>

              {/* Resepsi */}
              <div style={{ marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>💍 RESEPSI</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Tanggal & Jam Resepsi</label>
                      <input type="datetime-local" name="tanggal_resepsi" style={inputStyle} />
                    </div>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>Nama Lokasi (Gedung/Rumah)</label>
                      <input name="lokasi_resepsi" placeholder="Ballroom Hotel ABC" style={inputStyle} />
                    </div>
                </div>
                <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                  <label style={labelStyle}>Alamat Lengkap Resepsi</label>
                  <textarea name="alamat_resepsi" required style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
                </div>
                <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                  <label style={labelStyle}>Link Google Maps Resepsi</label>
                  <input name="maps_url_resepsi" placeholder="https://goo.gl/maps/..." style={inputStyle} />
                </div>
              </div>
            </div>
          </section>

          {/* --- SECTION 4: MEDIA & TEMA --- */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>Desain & Musik</h2>
              <p style={descStyle}>Personalisasi tampilan undangan agar sesuai dengan karakter kamu.</p>
            </div>
            <div style={sectionContentStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Pilih Tema</label>
                <select name="tema" defaultValue="mono" style={inputStyle}>
                  <option value="mono">Minimalist Monochrome</option>
                  <option value="sage">Modern Sage Green</option>
                  <option value="midnight">Elegant Midnight Blue</option>
                  <option value="emerald">Emerald Gold (Luxury)</option>
                  <option value="maroon">Royal Maroon (Luxury)</option>
                  <option value="champagne">Champagne Luxury</option>
                  <option value="navy">Ocean Navy (Modern)</option>
                  <option value="lavender">Soft Lavender</option>
                </select>
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>Kata Mutiara / Quote</label>
                <textarea name="quote" placeholder="Maka terikatlah dua hati..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              </div>

              {/* Wedding Gift Section */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                <label style={labelStyle}>🎁 Wedding Gift / Angpao Digital</label>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Tambahkan informasi rekening bank untuk kado digital.</p>
                
                {/* Bank Slot 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input name="bank_name_1" placeholder="Nama Bank (BCA/BNI)" style={inputStyle} />
                  <input name="bank_acc_1" placeholder="Nomor Rekening" style={inputStyle} />
                  <input name="bank_owner_1" placeholder="Atas Nama" style={inputStyle} />
                </div>

                {/* Bank Slot 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <input name="bank_name_2" placeholder="Nama Bank (Mandiri/QRIS)" style={inputStyle} />
                  <input name="bank_acc_2" placeholder="Nomor Rekening" style={inputStyle} />
                  <input name="bank_owner_2" placeholder="Atas Nama" style={inputStyle} />
                </div>
              </div>
              <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
                <label style={labelStyle}>Musik Latar (.mp3)</label>
                <input type="file" name="music_file" accept=".mp3,audio/mpeg" style={{ ...inputStyle, padding: '8px' }} />
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Pilih file MP3 untuk musik latar (Maksimal 10MB).</p>
              </div>
            </div>
          </section>

          {/* --- SECTION 5: KUSTOMISASI VISUAL --- */}
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>Tema Visual & Animasi</h2>
              <p style={descStyle}>Pilih latar belakang dan efek animasi untuk undangan kamu.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Tipe Background Utama</label>
                <select name="background_type" defaultValue="polos" style={inputStyle}>
                  <option value="polos">Polos (Tanpa Tekstur)</option>
                  <option value="paper">Tekstur Kertas (Luxury)</option>
                  <option value="floral">Subtle Floral</option>
                  <option value="custom">Kustom Per Seksi (Gunakan Pilihan Di Bawah)</option>
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Efek Animasi Global</label>
                <select name="animation_type" defaultValue="none" style={inputStyle}>
                  <option value="none">Tanpa Animasi</option>
                  <option value="petals">Kelopak Bunga Berguguran</option>
                  <option value="sparkle">Kilauan Bintang (Sparkle)</option>
                  <option value="snow">Efek Salju (Snow)</option>
                  <option value="confetti">Konfeti Emas (Confetti)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Kustomisasi Background Per Seksi</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { id: 'hero', label: 'Background Cover (Hero)' },
                  { id: 'mempelai', label: 'Background Mempelai' },
                  { id: 'acara', label: 'Background Acara/Waktu' },
                  { id: 'galeri', label: 'Background Galeri' },
                  { id: 'ucapan', label: 'Background Ucapan/RSVP' },
                ].map((item) => (
                  <div key={item.id} style={inputGroupStyle}>
                    <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>{item.label}</label>
                    <input type="file" name={`bg_${item.id}_file`} accept="image/*" style={{ ...inputStyle, fontSize: '12px' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <section style={formSectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={h2Style}>Galeri Foto</h2>
              <p style={descStyle}>Tambahkan koleksi foto pre-wedding untuk dilihat para tamu.</p>
            </div>
            <div style={sectionContentStyle}>
              <input type="file" name="gallery_files" accept="image/*" multiple style={{ fontSize: '13px', color: '#64748b' }} />
            </div>
          </section>

          {/* --- ACTIONS --- */}
          <div style={{
            paddingTop: '32px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px'
          }}>
             {(state as any)?.error && <span style={{ color: '#ef4444', fontSize: '14px', alignSelf: 'center', marginRight: 'auto' }}>⚠️ {(state as any).error}</span>}
             <button type="submit" disabled={isPending} style={btnPrimaryStyle}>
                {isPending ? 'Menyimpan...' : 'Buat Undangan Sekarang'}
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
  gridTemplateColumns: '220px 1fr',
  gap: '40px',
  paddingBottom: '40px',
  borderBottom: '1px solid #f1f5f9'
}

const sectionHeaderStyle: React.CSSProperties = {
  paddingTop: '4px'
}

const h2Style: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#0f172a',
  marginBottom: '8px'
}

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  lineHeight: '1.5'
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
  fontWeight: 600,
  color: '#475569',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 0.2s'
}

const prefixStyle: React.CSSProperties = {
  padding: '10px 14px',
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRight: 'none',
  borderRadius: '8px 0 0 8px',
  fontSize: '14px',
  color: '#94a3b8'
}

const btnPrimaryStyle: React.CSSProperties = {
  padding: '12px 28px',
  background: '#0f172a',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
}
