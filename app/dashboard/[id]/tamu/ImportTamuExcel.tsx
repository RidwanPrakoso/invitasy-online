'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { importTamuBulk } from './tambah/actions'

interface Props {
  undanganId: string
}

export default function ImportTamuExcel({ undanganId }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setMessage('Membaca file...')

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        if (data.length === 0) {
          setMessage('File kosong atau format salah.')
          setLoading(false)
          return
        }

        setMessage(`Mengimport ${data.length} tamu...`)

        const mappedData = data.map((row: any) => ({
          nama: row.Nama || row.nama || row.NAMA || '',
          no_wa: row['No WA'] || row.no_wa || row.wa || row.WhatsApp || '',
          kategori: row.Kategori || row.kategori || 'Umum'
        })).filter(t => t.nama !== '')

        const result = await importTamuBulk(undanganId, mappedData)

        if (result.success) {
          setMessage(`Berhasil mengimport ${result.count} tamu!`)
          setTimeout(() => window.location.reload(), 1500)
        } else {
          setMessage(`Gagal: ${result.error}`)
        }
      } catch (err) {
        console.error(err)
        setMessage('Terjadi kesalahan saat membaca file.')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsBinaryString(file)
  }

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { Nama: 'Budi Santoso', 'No WA': '628123456789', Kategori: 'Teman SMA' },
      { Nama: 'Siti Aminah', 'No WA': '628987654321', Kategori: 'Keluarga' },
    ])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Tamu')
    XLSX.writeFile(workbook, 'template_tamu_undangan.xlsx')
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={downloadTemplate}
        style={btnSecondary}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Unduh Template
      </button>

      <label style={{ ...btnSecondary, cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? (
           <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M21 12a9 9 0 1 1-6.219-8.56" />
           </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
        {loading ? 'Memproses...' : 'Import Excel/CSV'}
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
          disabled={loading}
          style={{ display: 'none' }}
        />
      </label>
      
      {message && (
        <div style={toastStyle}>
          {message}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const btnSecondary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 16px',
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#475569',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap'
}

const toastStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  background: '#0f172a',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: 500,
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  animation: 'fadeIn 0.3s'
}
