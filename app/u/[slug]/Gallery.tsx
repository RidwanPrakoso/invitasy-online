'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  accentColor: string
  mutedColor: string
  cardBg: string
  borderColor: string
}

export default function Gallery({ images, accentColor, mutedColor, cardBg, borderColor }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <>
      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px',
      }}>
        {images.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelected(src)}
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${borderColor}`,
              cursor: 'pointer',
              aspectRatio: '1',
              position: 'relative',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
            }}
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'pointer',
            padding: '16px',
            boxSizing: 'border-box',
          }}
        >
          <img
            src={selected}
            alt="Gallery preview"
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '900px',
              maxHeight: '85vh',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              objectFit: 'contain',
            }}
          />
          <button
            onClick={() => setSelected(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
