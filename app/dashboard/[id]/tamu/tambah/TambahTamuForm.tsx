'use client'

import { useActionState } from 'react'
import { addTamu } from './actions'

interface Props {
  undanganId: string
}

export default function TambahTamuForm({ undanganId }: Props) {
  const [state, formAction, isPending] = useActionState(addTamu, null)

  return (
    <form action={formAction}>
      <input type="hidden" name="undangan_id" value={undanganId} />
      
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Nama Tamu</label>
        <input
          name="nama"
          placeholder="Contoh: Budi Santoso"
          required
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Nomor WhatsApp</label>
        <input
          name="no_wa"
          placeholder="628123456789"
          required
          style={inputStyle}
        />
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
           Gunakan format <b>62</b> (tanpa tanda +)
        </p>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <label style={labelStyle}>Kategori</label>
        <select name="kategori" style={inputStyle}>
          <option value="Umum">Umum</option>
          <option value="Keluarga">Keluarga</option>
          <option value="Teman Kerja">Teman Kerja</option>
          <option value="Sahabat">Sahabat</option>
        </select>
      </div>

      {state?.error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px',
          padding: '14px', fontSize: '14px', color: '#ef4444', marginBottom: '24px', fontWeight: 500
        }}>
          ⚠️ {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%', background: '#0f172a', color: '#fff', border: 'none',
          borderRadius: '10px', padding: '16px', fontSize: '15px',
          fontWeight: 600, cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1, transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
        }}
      >
        {isPending ? 'Sedang Menyimpan...' : 'Simpan & Tambah Tamu'}
      </button>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: '#475569',
  marginBottom: '8px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
}
