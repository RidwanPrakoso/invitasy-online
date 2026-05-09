'use client'

// app/login/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
      else setError('Cek email lo untuk konfirmasi akun.')
    }

    setLoading(false)
  }

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f5f5', padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8',
        padding: '40px', width: '100%', maxWidth: '400px'
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '6px', color: '#111' }}>
          {mode === 'login' ? 'Masuk ke dashboard' : 'Buat akun baru'}
        </h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '28px' }}>
          Undangan Digital Admin
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#555', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fff5f5', border: '1px solid #ffd0d0', borderRadius: '8px',
              padding: '10px 12px', fontSize: '13px', color: '#c0392b', marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: '#111', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '12px', fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginTop: '20px' }}>
          {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
          {' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={{ background: 'none', border: 'none', color: '#111', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            {mode === 'login' ? 'Daftar' : 'Masuk'}
          </button>
        </p>
      </div>
    </main>
  )
}
