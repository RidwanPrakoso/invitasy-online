'use client'

import * as XLSX from 'xlsx'

interface RSVPWithNama {
  id: string
  nama: string
  status: 'hadir' | 'tidak' | 'ragu'
  jumlah_tamu: number
  ucapan: string | null
  created_at: string
}

interface Props {
  data: RSVPWithNama[]
}

export function RSVPTable({ data }: Props) {
  const downloadExcel = () => {
    const formattedData = data.map((r, i) => ({
      No: i + 1,
      Nama: r.nama,
      Status: r.status === 'hadir' ? 'Hadir' : r.status === 'tidak' ? 'Tidak Hadir' : 'Ragu-ragu',
      'Jumlah Tamu': r.jumlah_tamu || 1,
      Ucapan: r.ucapan || '-',
      Tanggal: new Date(r.created_at).toLocaleString('id-ID'),
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar RSVP')
    XLSX.writeFile(workbook, 'laporan_rsvp_undangan.xlsx')
  }

  return (
    <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Daftar Kehadiran</h3>
        <button
          onClick={downloadExcel}
          disabled={data.length === 0}
          style={{
            padding: '10px 18px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#475569',
            cursor: data.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Unduh Laporan (Excel)
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle}>TAMU</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>PAX</th>
              <th style={thStyle}>UCAPAN</th>
              <th style={thStyle}>WAKTU</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '15px' }}>
                  Belum ada konfirmasi kehadiran dari tamu.
                </td>
              </tr>
            ) : (
              data.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.nama}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: r.status === 'hadir' ? '#e6f7ed' : r.status === 'tidak' ? '#fff1f0' : '#fef9e7',
                      color: r.status === 'hadir' ? '#10b981' : r.status === 'tidak' ? '#f43f5e' : '#f59e0b'
                    }}>
                      {r.status === 'hadir' ? 'Hadir' : r.status === 'tidak' ? 'Absen' : 'Ragu'}
                    </span>
                  </td>
                  <td style={tdStyle}>{r.jumlah_tamu || 1}</td>
                  <td style={{ ...tdStyle, maxWidth: '300px', whiteSpace: 'normal', fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                    {r.ucapan || '-'}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '18px 24px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748b',
  letterSpacing: '0.05em'
}

const tdStyle: React.CSSProperties = {
  padding: '20px 24px',
  fontSize: '14px',
  color: '#334155'
}
