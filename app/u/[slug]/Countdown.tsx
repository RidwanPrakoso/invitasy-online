'use client'

import { useState, useEffect } from 'react'

interface Props {
  targetDate: string
  accentColor: string
  mutedColor: string
  cardBg: string
  borderColor: string
}

export default function Countdown({ targetDate, accentColor, mutedColor, cardBg, borderColor }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    function calculate() {
      const now = Date.now()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const items = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
      {items.map((item) => (
        <div key={item.label} style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: '16px',
          padding: '20px 24px',
          minWidth: '80px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          transition: 'transform 0.2s',
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: 600,
            color: accentColor,
            lineHeight: 1,
            marginBottom: '8px',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(item.value).padStart(2, '0')}
          </div>
          <div style={{
            fontSize: '11px',
            color: mutedColor,
            letterSpacing: '.15em',
            textTransform: 'uppercase',
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}
