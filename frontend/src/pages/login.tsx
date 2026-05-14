import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import * as NotesApi from './api/fetch'
import { useRouter } from 'next/router'

const Login: React.FC = () => {
  const router = useRouter()
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [errMessage, setErrMessage] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)

  const loginClicked = () => {
    async function login() {
      try {
        if (!email && !password) {
          setErrMessage(true)
          setTimeout(() => setErrMessage(false), 3000)
        } else {
          setLoading(true)
          const user = await NotesApi.loginUser({ email, password })
          if (user) {
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.log(error)
        alert(error)
      } finally {
        setLoading(false)
      }
    }
    login()
  }

  return (
    <div>
      <Head>
        <title>NotesApp | Log In</title>
        <meta name="description" content="Log in to your NotesApp account." />
      </Head>

      {/* Page layout */}
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background Graphic */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("/homepage.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
          zIndex: 0
        }} />

        {/* Card */}
        <div className='glass-strong modal-panel' style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '420px',
          padding: '2.5rem',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              width: '48px', height: '48px',
              background: 'var(--color-accent-blue)',
              borderRadius: '4px',
              border: '2px solid var(--color-bg)',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M15 3H19a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h4M12 17v-6m0 0V9m0 2H9m3 0h3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Welcome back</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Log in to continue to your notes</p>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                className='input-base'
                type='email'
                placeholder='you@example.com'
                onChange={e => setEmail(e.target.value)}
                id='login-email'
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '0.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                className='input-base'
                type='password'
                placeholder='••••••••'
                onChange={e => setPassword(e.target.value)}
                id='login-password'
              />
            </div>

            {errMessage && (
              <div style={{
                padding: '0.65rem 1rem',
                background: 'var(--color-surface-2)',
                border: '2px solid var(--color-accent-red)',
                borderRadius: '4px',
                color: 'var(--color-accent-red)',
                fontWeight: 700,
                fontSize: '0.83rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '3px 3px 0px var(--color-accent-red)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Please fill in all fields
              </div>
            )}

            <button
              className='btn-primary'
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.25rem' }}
              onClick={loginClicked}
              id='login-submit'
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log In →'}
            </button>
          </div>

          {/* Divider */}
          <div className='divider' />

          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
            Don&apos;t have an account?{' '}
            <Link href='/register' style={{ color: 'var(--color-accent-blue)', fontWeight: 800, textDecoration: 'none' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
