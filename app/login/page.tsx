'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setError('Cek email kamu untuk konfirmasi akun.')
    }

    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f8fafc', padding: '24px',
      fontFamily: '"Inter", sans-serif'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-1px', color: '#0f172a' }}>
              Undangan<span style={{ color: '#3b82f6' }}>Digital</span>
            </div>
          </Link>
        </div>

        <div style={{
          background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0',
          padding: '40px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#0f172a', textAlign: 'center' }}>
            {mode === 'login' ? 'Selamat Datang' : 'Buat Akun'}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px', textAlign: 'center' }}>
            {mode === 'login' ? 'Silakan masuk untuk mengelola undangan kamu.' : 'Mulai buat undangan digital premium kamu hari ini.'}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                placeholder="nama@email.com"
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                style={inputStyle}
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px',
                padding: '12px', fontSize: '13px', color: '#ef4444', marginBottom: '20px', fontWeight: 500
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: '#0f172a', color: '#fff', border: 'none',
                borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
              }}
            >
              {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun')}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
            {' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '14px', fontWeight: 600, padding: '4px' }}
            >
              {mode === 'login' ? 'Daftar Sekarang' : 'Login'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#94a3b8' }}>
          &copy; 2026 Undangan Digital Admin. All rights reserved.
        </p>
      </div>
    </main>
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
  padding: '12px 16px',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
}
