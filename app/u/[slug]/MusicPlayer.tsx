'use client'

import { useRef, useState, useEffect } from 'react'

interface Props {
  musicUrl?: string
  accentColor: string
  cardBg: string
  borderColor: string
}

export default function MusicPlayer({ musicUrl, accentColor, cardBg, borderColor }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  
  const src = musicUrl || '/music.mp3'

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [src])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        setHasInteracted(true)
      }).catch(() => {})
    }
  }

  useEffect(() => {
    if (!hasInteracted && audioRef.current) {
      const timer = setTimeout(() => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true)
          setHasInteracted(true)
        }).catch(() => {})
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [hasInteracted])

  return (
    <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 999 }}>
      <button
        onClick={togglePlay}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${borderColor}`,
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {isPlaying ? (
          <div className="music-icon-playing" style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '14px' }}>
            <div className="bar" style={{ width: '3px', height: '100%', background: accentColor, borderRadius: '2px' }} />
            <div className="bar" style={{ width: '3px', height: '60%', background: accentColor, borderRadius: '2px' }} />
            <div className="bar" style={{ width: '3px', height: '80%', background: accentColor, borderRadius: '2px' }} />
          </div>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}

        {isPlaying && (
          <span style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${accentColor}`,
            animation: 'musicPulse 2s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </button>

      <style>{`
        @keyframes musicPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .music-icon-playing .bar {
          animation: musicBar 0.8s ease-in-out infinite alternate;
        }
        .music-icon-playing .bar:nth-child(2) { animation-delay: 0.2s; }
        .music-icon-playing .bar:nth-child(3) { animation-delay: 0.4s; }
        @keyframes musicBar {
          0% { height: 30%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  )
}
