'use client'

// app/u/[slug]/RSVPForm.tsx

import { useState } from 'react'
import Swal from 'sweetalert2'

interface Props {
  token: string
  undanganId: string
}

type Status = 'hadir' | 'tidak' | 'ragu'

export default function RSVPForm({ token, undanganId }: Props) {
  const [status, setStatus] = useState<Status>('hadir')
  const [jumlah, setJumlah] = useState(1)
  const [ucapan, setUcapan] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, status, jumlah_tamu: jumlah, ucapan })
      })

      const data = await res.json()

      if (!res.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Konfirmasi',
          text: data.error || 'Terjadi kesalahan.',
          confirmButtonColor: '#111'
        })
      } else {
        setSuccess(true)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Konfirmasi kehadiran kamu telah tersimpan.',
          confirmButtonColor: '#111'
        })
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Koneksi bermasalah.',
        confirmButtonColor: '#111'
      })
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div style={{
        background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px',
        padding: '40px 24px', textAlign: 'center', marginBottom: '24px'
      }}>
        <div style={{
          width: '48px', height: '48px', background: '#111', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M5 11l4 4 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#111', marginBottom: '6px' }}>
          Konfirmasi berhasil!
        </p>
        <p style={{ fontSize: '13px', color: '#888' }}>
          Kami menantikan kehadiran kamu.
        </p>
      </div>
    )
  }

  const optStyle = (val: Status) => ({
    flex: 1 as const,
    padding: '10px 8px',
    border: `1px solid ${status === val ? '#111' : '#e0e0e0'}`,
    borderRadius: '8px',
    background: status === val ? '#111' : '#fff',
    color: status === val ? '#fff' : '#555',
    fontSize: '13px',
    cursor: 'pointer' as const,
    textAlign: 'center' as const,
    transition: 'all .15s'
  })

  return (
    <div style={{
      background: '#fff', border: '1px solid #e8e8e8', borderRadius: '10px',
      padding: '24px', marginBottom: '24px'
    }}>
      <h2 style={{ fontSize: '12px', letterSpacing: '.2em', color: '#bbb', textTransform: 'uppercase', marginBottom: '20px' }}>
        Konfirmasi kehadiran
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Status */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Konfirmasi</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" style={optStyle('hadir')} onClick={() => setStatus('hadir')}>Hadir</button>
            <button type="button" style={optStyle('tidak')} onClick={() => setStatus('tidak')}>Tidak hadir</button>
            <button type="button" style={optStyle('ragu')} onClick={() => setStatus('ragu')}>Masih ragu</button>
          </div>
        </div>

        {/* Jumlah tamu */}
        {status === 'hadir' && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Jumlah tamu</p>
            <input
              type="number"
              min="1"
              max="10"
              value={jumlah}
              onChange={e => setJumlah(parseInt(e.target.value) || 1)}
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '13px', outline: 'none',
                boxSizing: 'border-box' as const
              }}
              placeholder="Masukkan jumlah tamu..."
            />
          </div>
        )}

        {/* Ucapan */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>Ucapan (opsional)</p>
          <textarea
            value={ucapan}
            onChange={e => setUcapan(e.target.value)}
            placeholder="Tulis doa & ucapan untuk pasangan..."
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0',
              borderRadius: '8px', fontSize: '13px', resize: 'none', outline: 'none',
              lineHeight: 1.5, boxSizing: 'border-box' as const
            }}
          />
        </div>

        {error && (
          <div style={{
            background: '#fff5f5', border: '1px solid #ffd0d0', borderRadius: '8px',
            padding: '10px 12px', fontSize: '13px', color: '#c0392b', marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', background: '#111', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '13px', fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            letterSpacing: '.04em'
          }}
        >
          {loading ? 'Mengirim...' : 'Kirim konfirmasi'}
        </button>
      </form>
    </div>
  )
}
