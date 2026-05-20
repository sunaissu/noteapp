import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { NotepadIcon, UsersIcon, StarIcon, GearIcon } from '@phosphor-icons/react'

const Sidebar: React.FC = () => {
  const router = useRouter()

  const workspaceItems = [
    { label: 'My Notes', path: '/notes', icon: <NotepadIcon weight="bold" />, color: 'var(--color-accent-blue)' },
    { label: 'Shared with me', path: '/shared', icon: <UsersIcon weight="bold" />, color: 'var(--color-accent-red)' },
    { label: 'Favorites', path: '/favorites', icon: <StarIcon weight="bold" />, color: 'var(--color-accent-yellow)' },
  ]

  const preferenceItems = [
    { label: 'Settings', path: '/settings', icon: <GearIcon weight="bold" />, color: 'var(--color-text)' },
  ]

  const renderNavItem = (item: any) => {
    const isActive = router.pathname.startsWith(item.path) || (item.path === '/notes' && router.pathname === '/dashboard')

    return (
      <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.4rem 0.75rem',
          borderRadius: '8px',
          border: `2px solid ${isActive ? 'var(--color-border)' : 'transparent'}`,
          background: isActive ? 'var(--color-bg)' : 'transparent',
          boxShadow: isActive ? '4px 4px 0px rgba(0,0,0,0.5)' : 'none',
          transform: isActive ? 'translate(-2px, -2px)' : 'none',
          color: 'var(--color-text)',
          fontWeight: isActive ? 800 : 600,
          transition: 'all 0.15s ease',
          cursor: 'pointer',
        }}
          onMouseEnter={e => {
            if (!isActive) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            }
          }}
          onMouseLeave={e => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent'
            }
          }}
        >
          <span style={{ fontSize: '16px', filter: isActive ? 'none' : 'grayscale(100%) opacity(0.7)' }}>{item.icon}</span>
          <span>{item.label}</span>
          {isActive && (
            <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
          )}
        </div>
      </Link>
    )
  }

  return (
    <aside style={{
      width: '240px',
      borderRight: '2px solid var(--color-border)',
      background: 'var(--color-surface)',
      padding: '0.75rem 0.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: '0.25rem', textTransform: 'uppercase', paddingLeft: '0.5rem' }}>
        Workspace
      </div>

      {workspaceItems.map(renderNavItem)}

      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: '0.25rem', textTransform: 'uppercase', paddingLeft: '0.5rem' }}>
        Preferences
      </div>

      {preferenceItems.map(renderNavItem)}
    </aside>
  )
}

export default Sidebar
