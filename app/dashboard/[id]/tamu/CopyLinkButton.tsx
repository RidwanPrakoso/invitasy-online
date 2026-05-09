'use client'

import { useState } from 'react'

interface Props {
  url: string
}

export default function CopyLinkButton({ url }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? '#27ae60' : 'none',
        border: '1px solid #e0e0e0',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        color: copied ? '#fff' : '#555',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minWidth: '90px'
      }}
    >
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}
