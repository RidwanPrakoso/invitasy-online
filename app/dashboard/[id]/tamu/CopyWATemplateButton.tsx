'use client'

import { useState } from 'react'

interface Props {
  namaTamu: string
  mempelai1: string
  mempelai2: string
  tanggal: string
  lokasi: string
  url: string
}

export default function CopyWATemplateButton({ namaTamu, mempelai1, mempelai2, tanggal, lokasi, url, noWa }: Props & { noWa?: string | null }) {
  const [copied, setCopied] = useState(false)

  const template = `Assalamualaikum Wr Wb
Yth. Bapak/Ibu/Saudara/i
*${namaTamu}*
Di Tempat
-----------
Dengan segala kerendahan hati, kami mengundang Bapak/Ibu/Saudara/i dan teman-teman untuk menghadiri acara,
===========
Resepsi Pernikahan _*${mempelai1} & ${mempelai2}*_

===========
Pada:
📅 Tanggal: ${tanggal}
📍 Lokasi: ${lokasi}

Link undangan bisa diakses lengkap di:
${url}
===========

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i *${namaTamu}* berkenan untuk hadir dan memberikan doa restu.
Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.
Wassalamualaikum Wr Wb
kami yang berbahagia
*${mempelai1} & ${mempelai2}*`

  const copyTemplate = () => {
    navigator.clipboard.writeText(template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendWA = () => {
    const phone = noWa ? noWa.replace(/\D/g, '') : ''
    const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(template)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        onClick={copyTemplate}
        title="Salin Template WA"
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: '1px solid #dcfce7',
          background: copied ? '#22c55e' : '#f0fdf4',
          color: copied ? '#fff' : '#16a34a',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {noWa && (
        <button 
          onClick={sendWA}
          title="Kirim ke WhatsApp"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: '1px solid #dcfce7',
            background: '#22c55e',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      )}
    </div>
  )
}
