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
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999, /* increased z-index to be above music player */
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={selected}
              alt="Gallery preview"
              style={{
                maxWidth: '90vw',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
                objectFit: 'contain',
              }}
            />
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                background: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.8)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
