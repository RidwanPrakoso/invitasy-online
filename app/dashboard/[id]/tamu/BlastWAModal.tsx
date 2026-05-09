'use client'

import { useState } from 'react'
import { sendBlastFonnte } from './tambah/actions'
import type { Tamu, Undangan } from '@/lib/supabase/types'

interface Props {
  undangan: Undangan
  tamuList: Tamu[]
}

export default function BlastWAModal({ undangan, tamuList }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [template, setTemplate] = useState(
    `Halo *[nama]*, kami mengundang Anda untuk hadir di pernikahan kami.\n\nKlik link di bawah ini untuk melihat undangan digital kami:\n[link]\n\nTerima kasih.`
  )

  const pendingTamu = tamuList.filter(t => t.blast_status !== 'sent')

  const handleBlastAll = async () => {
    if (pendingTamu.length === 0) return
    if (!confirm(`Kirim undangan ke ${pendingTamu.length} tamu via Fonnte?`)) return

    setLoading(true)
    setMessage('Sedang mengirim ke Fonnte...')

    const result = await sendBlastFonnte(undangan.id, template, pendingTamu)

    if (result.success) {
      setMessage(`Berhasil mengirim ${result.count} pesan!`)
      setTimeout(() => window.location.reload(), 2000)
    } else {
      setMessage(`Gagal: ${result.error}`)
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '10px 18px',
          background: '#25D366',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        🚀 Blast WA Fonnte ({pendingTamu.length})
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 2000, padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>WhatsApp Blast (Fonnte)</h2>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Template Pesan</label>
            <textarea
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              disabled={loading}
              style={{
                width: '100%', height: '120px', padding: '12px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'none'
              }}
            />
            <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
              Gunakan <b>[nama]</b> dan <b>[link]</b> untuk data otomatis.
            </p>
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>
            Tamu yang akan menerima pesan ({pendingTamu.length})
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
            {pendingTamu.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '14px' }}>Semua tamu sudah dikirimi pesan! 🎉</p>
            ) : (
              pendingTamu.map(t => (
                <div key={t.id} style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                   <span>{t.nama}</span>
                   <span style={{ color: '#888' }}>{t.no_wa}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <p style={{ fontSize: '12px', color: '#c0392b' }}>{message}</p>
           <button
            onClick={handleBlastAll}
            disabled={loading || pendingTamu.length === 0}
            style={{
              padding: '12px 24px',
              background: loading ? '#ccc' : '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Mengirim...' : `Kirim ke ${pendingTamu.length} Tamu`}
          </button>
        </div>
      </div>
    </div>
  )
}
