import Link from 'next/link'
import React from 'react'
import { User } from '../model/user'
import * as NotesApi from '../pages/api/fetch'

interface Props {
  loggedInUser: User | null
  onLogout: () => void
}

const Navbar: React.FC<Props> = ({ loggedInUser, onLogout }: Props) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false)

  async function logout() {
    try {
      await NotesApi.logout()
      onLogout()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 999,
        background: 'rgba(7, 8, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', height: '64px' }}>
        {/* Logo */}
        <Link href='/' style={{ textDecoration: 'none', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(108,99,255,0.5)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 3H5a2 2 0 00-2 2v4M9 3h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#e8eaf6', letterSpacing: '-0.01em' }}>
              Notes<span style={{ color: '#6c63ff' }}>App</span>
            </span>
          </div>
        </Link>

        {/* Nav actions */}
        {loggedInUser ? (
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.4rem 1rem',
              background: 'rgba(108,99,255,0.12)',
              border: '1px solid rgba(108,99,255,0.25)',
              borderRadius: '999px',
              color: '#a78bfa',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
              <div style={{
                width: '22px', height: '22px',
                background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#fff',
              }}>
                {loggedInUser.username.charAt(0).toUpperCase()}
              </div>
              {loggedInUser.username}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {isHovered && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                background: 'rgba(15, 17, 23, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                minWidth: '160px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                animation: 'fade-in 0.15s ease',
              }}>
                <Link href='/dashboard' style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '0.75rem 1.25rem',
                    color: '#e8eaf6',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'background 0.15s ease',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg>
                    Dashboard
                  </div>
                </Link>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0 1rem' }} />
                <div
                  style={{
                    padding: '0.75rem 1.25rem',
                    color: '#f87171',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => logout()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Log Out
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href='/login' style={{ textDecoration: 'none' }}>
              <button className='btn-ghost' style={{ padding: '0.45rem 1.25rem', fontSize: '0.875rem' }}>
                Log In
              </button>
            </Link>
            <Link href='/register' style={{ textDecoration: 'none' }}>
              <button className='btn-primary' style={{ padding: '0.45rem 1.25rem', fontSize: '0.875rem' }}>
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
