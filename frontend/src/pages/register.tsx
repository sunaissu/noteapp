import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import * as NotesApi from './api/fetch'
import { useRouter } from 'next/router'

const SignUp: React.FC = () => {
  const router = useRouter()
  const [username, setUsername] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [checkPassword, setCheckPassword] = React.useState<string>('')
  const [checkErr, setCheckErr] = React.useState<boolean>(false)
  const [errMessage, setErrMessage] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)

  const registerClicked = () => {
    async function register() {
      if (!username || !password || !email) {
        setErrMessage('All fields are required')
        setCheckErr(true)
        setTimeout(() => { setCheckErr(false); setErrMessage('') }, 3000)
      } else if (password !== checkPassword) {
        setErrMessage('Passwords do not match')
        setCheckErr(true)
        setTimeout(() => { setCheckErr(false); setErrMessage('') }, 3000)
      } else {
        setLoading(true)
        const registerData = await NotesApi.registerUser({ username, email, password })
        alert(registerData)
        if (registerData) {
          router.push('/login')
        }
        setLoading(false)
      }
    }
    register()
  }

  return (
    <div>
      <Head>
        <title>NotesApp | Create Account</title>
        <meta name="description" content="Register for a new NotesApp account." />
      </Head>

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
          width: '100%', maxWidth: '440px',
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
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>Create account</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Join NotesApp and start capturing ideas</p>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {[
              { label: 'Username', type: 'text', placeholder: 'johndoe', setter: setUsername, id: 'reg-username' },
              { label: 'Email', type: 'email', placeholder: 'you@example.com', setter: setEmail, id: 'reg-email' },
              { label: 'Password', type: 'password', placeholder: '••••••••', setter: setPassword, id: 'reg-password' },
              { label: 'Confirm Password', type: 'password', placeholder: '••••••••', setter: setCheckPassword, id: 'reg-confirm' },
            ].map((field) => (
              <div key={field.label}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '0.45rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {field.label}
                </label>
                <input
                  id={field.id}
                  className='input-base'
                  type={field.type}
                  placeholder={field.placeholder}
                  onChange={e => field.setter(e.target.value)}
                />
              </div>
            ))}

            {checkErr && (
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
                {errMessage}
              </div>
            )}

            <button
              className='btn-primary'
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.25rem' }}
              onClick={registerClicked}
              id='register-submit'
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </div>

          {/* Divider */}
          <div className='divider' />

          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
            Already have an account?{' '}
            <Link href='/login' style={{ color: 'var(--color-accent-blue)', fontWeight: 800, textDecoration: 'none' }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
