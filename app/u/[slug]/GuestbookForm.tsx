'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

interface Props {
  undanganId: string
  accentColor: string
}

export default function GuestbookForm({ undanganId, accentColor }: Props) {
  const [nama, setNama] = useState('')
  const [ucapan, setUcapan] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ undangan_id: undanganId, nama, ucapan })
      })

      if (res.ok) {
        setNama('')
        setUcapan('')
        setSuccess(true)
        Swal.fire({
          icon: 'success',
          title: 'Ucapan Terkirim!',
          text: 'Terima kasih atas doa dan ucapannya.',
          confirmButtonColor: accentColor
        }).then(() => {
          router.refresh(); // Refresh to show new comment without resetting state
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengirim ucapan.',
          confirmButtonColor: accentColor
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Koneksi bermasalah.',
        confirmButtonColor: accentColor
      })
    }
    setLoading(false)
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', border: `1px solid ${accentColor}33`,
      borderRadius: '16px', padding: '24px', marginTop: '40px'
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: accentColor }}>
        Kirim Ucapan & Doa
      </h3>
      
      {success ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ fontSize: '14px', color: accentColor }}>Terima kasih atas ucapannya! ✨</p>
          <button 
            onClick={() => setSuccess(false)}
            style={{ 
              background: 'none', border: 'none', color: accentColor, 
              textDecoration: 'underline', cursor: 'pointer', fontSize: '12px', marginTop: '8px' 
            }}
          >
            Kirim ucapan lagi
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            value={nama}
            onChange={e => setNama(e.target.value)}
            placeholder="Nama kamu"
            required
            style={{
              padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
              fontSize: '14px', outline: 'none', background: '#fff', color: '#111'
            }}
          />
          <textarea
            value={ucapan}
            onChange={e => setUcapan(e.target.value)}
            placeholder="Tulis ucapan..."
            required
            rows={3}
            style={{
              padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
              fontSize: '14px', outline: 'none', resize: 'none', background: '#fff', color: '#111'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: accentColor, color: '#fff', border: 'none',
              borderRadius: '8px', padding: '12px', fontSize: '14px',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </form>
      )}
    </div>
  )
}
