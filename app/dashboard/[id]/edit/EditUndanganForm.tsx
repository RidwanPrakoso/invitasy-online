'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateUndangan } from './actions'
import type { Undangan } from '@/lib/supabase/types'
import Swal from 'sweetalert2'

interface Props {
  undangan: Undangan
}

export default function EditUndanganForm({ undangan: u }: Props) {
  const [state, formAction, isPending] = useActionState(updateUndangan, null)
  const [removedFields, setRemovedFields] = useState<string[]>([])
  const [galleryUrls, setGalleryUrls] = useState<string[]>(u.gallery_urls || [])

  const isRemoved = (field: string) => removedFields.includes(field)
  const handleRemove = (field: string) => setRemovedFields([...removedFields, field])
  const handleRemoveGallery = (urlToRemove: string) => setGalleryUrls(galleryUrls.filter(url => url !== urlToRemove))

  useEffect(() => {
    if ((state as any)?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: (state as any).error,
        confirmButtonColor: '#0f172a'
      })
    }
  }, [state])

  const formatDT = (d: string | null) => {
    if (!d) return ''
    return new Date(d).toISOString().slice(0, 16)
  }

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
    <form action={formAction} onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <style>{`
        input[type="file"]::file-selector-button {
          background: #e2e8f0;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          color: #475569;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 12px;
        }
        input[type="file"]::file-selector-button:hover {
          background: #0f172a;
          color: #fff;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #0f172a !important;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05);
        }
        section:hover {
          border-color: #e2e8f0 !important;
          background: #fcfcfc;
        }
      `}</style>
      <input type="hidden" name="id" value={u.id} />
      <input type="hidden" name="foto_url_existing" value={isRemoved('foto_url') ? '' : (u.foto_url || '')} />
      <input type="hidden" name="music_url" value={isRemoved('music_url') ? '' : (u.music_url || '')} />
      <input type="hidden" name="foto_mempelai_1_existing" value={isRemoved('foto_mempelai_1') ? '' : (u.foto_mempelai_1 || '')} />
      <input type="hidden" name="foto_mempelai_2_existing" value={isRemoved('foto_mempelai_2') ? '' : (u.foto_mempelai_2 || '')} />
      <input type="hidden" name="gallery_urls_existing" value={galleryUrls.join(',')} />

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
              <input name="slug" defaultValue={u.slug} required style={{ ...inputStyle, borderRadius: '0 8px 8px 0' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nama Mempelai 1</label>
              <input name="mempelai_1" defaultValue={u.mempelai_1} required style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nama Ayah Mempelai 1</label>
              <input name="ayah_1" defaultValue={u.ortu_mempelai_1?.split('&')[0]?.trim() || ''} placeholder="Nama Ayah" style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nama Ibu Mempelai 1</label>
              <input name="ibu_1" defaultValue={u.ortu_mempelai_1?.split('&')[1]?.trim() || ''} placeholder="Nama Ibu" style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Foto Mempelai 1</label>
              <FileField name="foto_mempelai_1_file" accept="image/*" existing={u.foto_mempelai_1 && !isRemoved('foto_mempelai_1')} />
              {u.foto_mempelai_1 && !isRemoved('foto_mempelai_1') && (
                <button type="button" onClick={() => handleRemove('foto_mempelai_1')} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', marginTop: '4px', cursor: 'pointer' }}>Hapus Foto</button>
              )}
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Instagram Mempelai 1</label>
              <input name="ig_mempelai_1" defaultValue={u.ig_mempelai_1 || ''} placeholder="@username" style={inputStyle} />
            </div>

            <div style={{ ...inputGroupStyle, gridColumn: 'span 2', height: '1px', background: '#f1f5f9', margin: '10px 0' }}></div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nama Mempelai 2</label>
              <input name="mempelai_2" defaultValue={u.mempelai_2} required style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nama Ayah Mempelai 2</label>
              <input name="ayah_2" defaultValue={u.ortu_mempelai_2?.split('&')[0]?.trim() || ''} placeholder="Nama Ayah" style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Nama Ibu Mempelai 2</label>
              <input name="ibu_2" defaultValue={u.ortu_mempelai_2?.split('&')[1]?.trim() || ''} placeholder="Nama Ibu" style={inputStyle} />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Foto Mempelai 2</label>
              <FileField name="foto_mempelai_2_file" accept="image/*" existing={u.foto_mempelai_2 && !isRemoved('foto_mempelai_2')} />
              {u.foto_mempelai_2 && !isRemoved('foto_mempelai_2') && (
                <button type="button" onClick={() => handleRemove('foto_mempelai_2')} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', marginTop: '4px', cursor: 'pointer' }}>Hapus Foto</button>
              )}
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Instagram Mempelai 2</label>
              <input name="ig_mempelai_2" defaultValue={u.ig_mempelai_2 || ''} placeholder="@username" style={inputStyle} />
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
              {u.foto_url && !isRemoved('foto_url') ? (
                <img src={u.foto_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
              ) : (
                <span style={{ fontSize: '32px' }}>💍</span>
              )}
            </div>
            <div style={{ flex: 1, padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <FileField name="foto_file" accept="image/*" existing={u.foto_url && !isRemoved('foto_url')} />
              {u.foto_url && !isRemoved('foto_url') && (
                <button type="button" onClick={() => handleRemove('foto_url')} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, marginTop: '8px', cursor: 'pointer' }}>Hapus Foto Sekarang</button>
              )}
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>Maksimum file 2MB. Format JPG, PNG.</p>
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
                   <input type="datetime-local" name="tanggal_akad" defaultValue={formatDT(u.tanggal_akad)} required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                   <label style={labelStyle}>Nama Lokasi (Gedung/Rumah)</label>
                   <input name="lokasi_akad" defaultValue={u.lokasi_akad || ''} placeholder="Masjid Agung / Kediaman Mempelai" style={inputStyle} />
                </div>
             </div>
             <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
               <label style={labelStyle}>Alamat Lengkap Akad</label>
               <textarea name="alamat_akad" defaultValue={u.alamat_akad || ''} required style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
             </div>
             <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
               <label style={labelStyle}>Link Google Maps Akad</label>
               <input name="maps_url_akad" defaultValue={(u as any).maps_url_akad || ''} placeholder="https://goo.gl/maps/..." style={inputStyle} />
             </div>
           </div>

           {/* Resepsi */}
           <div style={{ marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
             <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>💍 RESEPSI</h3>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={inputGroupStyle}>
                   <label style={labelStyle}>Tanggal & Jam Resepsi</label>
                   <input type="datetime-local" name="tanggal_resepsi" defaultValue={formatDT(u.tanggal_resepsi)} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                   <label style={labelStyle}>Nama Lokasi (Gedung/Rumah)</label>
                   <input name="lokasi_resepsi" defaultValue={u.lokasi_resepsi || ''} placeholder="Ballroom Hotel ABC" style={inputStyle} />
                </div>
             </div>
             <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
               <label style={labelStyle}>Alamat Lengkap Resepsi</label>
               <textarea name="alamat_resepsi" defaultValue={u.alamat_resepsi || ''} required style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
             </div>
             <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
               <label style={labelStyle}>Link Google Maps Resepsi</label>
               <input name="maps_url_resepsi" defaultValue={(u as any).maps_url_resepsi || ''} placeholder="https://goo.gl/maps/..." style={inputStyle} />
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
            <select name="tema" defaultValue={u.tema || 'mono'} style={inputStyle}>
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
            <textarea name="quote" defaultValue={u.quote || ''} placeholder="Maka terikatlah dua hati..." style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          </div>

          {/* Wedding Gift Section */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
            <label style={labelStyle}>🎁 Wedding Gift / Angpao Digital</label>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Tambahkan informasi rekening bank untuk kado digital.</p>
            
            {/* Bank Slot 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input name="bank_name_1" placeholder="Nama Bank (BCA/BNI)" defaultValue={(u.wedding_gift as any)?.[0]?.bank || ''} style={inputStyle} />
              <input name="bank_acc_1" placeholder="Nomor Rekening" defaultValue={(u.wedding_gift as any)?.[0]?.acc || ''} style={inputStyle} />
              <input name="bank_owner_1" placeholder="Atas Nama" defaultValue={(u.wedding_gift as any)?.[0]?.owner || ''} style={inputStyle} />
            </div>

            {/* Bank Slot 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <input name="bank_name_2" placeholder="Nama Bank (Mandiri/QRIS)" defaultValue={(u.wedding_gift as any)?.[1]?.bank || ''} style={inputStyle} />
              <input name="bank_acc_2" placeholder="Nomor Rekening" defaultValue={(u.wedding_gift as any)?.[1]?.acc || ''} style={inputStyle} />
              <input name="bank_owner_2" placeholder="Atas Nama" defaultValue={(u.wedding_gift as any)?.[1]?.owner || ''} style={inputStyle} />
            </div>
          </div>
          <div style={{ ...inputGroupStyle, marginTop: '20px' }}>
            <label style={labelStyle}>Musik Latar (.mp3)</label>
            <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
              <FileField name="music_file" accept=".mp3,audio/mpeg" existing={u.music_url && !isRemoved('music_url')} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                  {u.music_url && !isRemoved('music_url') ? '🎵 Musik sudah terpasang.' : '❌ Belum ada musik.'}
                </p>
                {u.music_url && !isRemoved('music_url') && (
                  <button type="button" onClick={() => handleRemove('music_url')} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Hapus</button>
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Pilih file MP3 baru untuk mengganti (Maksimal 10MB).</p>
            </div>
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
            <select name="background_type" defaultValue={u.background_type || 'polos'} style={inputStyle}>
              <option value="polos">Polos (Tanpa Tekstur)</option>
              <option value="paper">Tekstur Kertas (Luxury)</option>
              <option value="floral">Subtle Floral</option>
              <option value="custom">Kustom Per Seksi (Gunakan Pilihan Di Bawah)</option>
            </select>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Efek Animasi Global</label>
            <select name="animation_type" defaultValue={u.animation_type || 'none'} style={inputStyle}>
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
                <FileField name={`bg_${item.id}_file`} accept="image/*" existing={(u as any)[`bg_${item.id}`] && !isRemoved(`bg_${item.id}`)} />
                <input type="hidden" name={`current_bg_${item.id}`} value={isRemoved(`bg_${item.id}`) ? '' : ((u as any)[`bg_${item.id}`] || '')} />
                {(u as any)[`bg_${item.id}`] && !isRemoved(`bg_${item.id}`) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <p style={{ fontSize: '10px', color: 'green', margin: 0 }}>✓ File terpasang</p>
                    <button type="button" onClick={() => handleRemove(`bg_${item.id}`)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '10px', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Hapus</button>
                  </div>
                )}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {galleryUrls.map((url, i) => (
              <div key={i} style={{ aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Gallery" />
                <button type="button" onClick={() => handleRemoveGallery(url)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', padding: 0, backdropFilter: 'blur(4px)' }}>✕</button>
              </div>
            ))}
          </div>
          <div style={{ padding: '30px', border: '2px dashed #e2e8f0', borderRadius: '16px', background: '#f8fafc', textAlign: 'center' }}>
            <FileField name="gallery_files" accept="image/*" multiple existing={false} />
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>Tambah foto galeri baru (bisa pilih banyak).</p>
          </div>
        </div>
      </section>

      {/* --- ACTIONS --- */}
      <div style={{
        paddingTop: '32px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px'
      }}>
         {(state as any)?.error && <span style={{ color: '#ef4444', fontSize: '14px', alignSelf: 'center', marginRight: 'auto' }}>⚠️ {(state as any).error}</span>}
         <button type="submit" disabled={isPending} style={btnPrimaryStyle}>
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
         </button>
      </div>
    </form>
  )
}

// STYLES
const formSectionStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '220px 1fr',
  gap: '40px',
  paddingBottom: '60px',
  borderBottom: '1px solid #f1f5f9',
  transition: 'all 0.3s ease'
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

const sectionTitleStyle: React.CSSProperties = {} // dummy for consistency

function FileField({ name, accept, multiple = false, existing = false }: { name: string, accept: string, multiple?: boolean, existing?: any }) {
  const [file, setFile] = useState<File | null>(null)
  const [count, setCount] = useState(0)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <label style={{
        background: '#e2e8f0', color: '#475569', padding: '8px 16px', 
        borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
        display: 'inline-block', transition: 'all 0.2s'
      }}>
        {multiple ? 'Pilih Files' : (existing || file ? 'Ganti File' : 'Pilih File')}
        <input 
          type="file" 
          name={name} 
          accept={accept} 
          multiple={multiple} 
          style={{ display: 'none' }} 
          onChange={(e) => {
            const files = e.target.files
            if (files && files.length > 0) {
              setFile(files[0])
              setCount(files.length)
            }
          }}
        />
      </label>
      <span style={{ fontSize: '12px', color: (file || existing) ? '#0f172a' : '#94a3b8', fontWeight: (file || existing) ? 500 : 400 }}>
        {file ? (multiple ? `${count} file terpilih` : file.name) : (existing ? (typeof existing === 'string' ? '✓ File Terpasang' : '✓ File Terpasang') : 'Belum ada file dipilih')}
      </span>
    </div>
  )
}
