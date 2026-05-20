import Head from 'next/head'
import React, { useState } from 'react'
import AppLayout from '../components/appLayout'
import { MagnifyingGlassIcon, StarIcon } from '@phosphor-icons/react'

const FavoriteNotes: React.FC = () => {
  const [search, setSearch] = useState<string>('')

  // Placeholder for favorite notes
  const favoriteNotes: any[] = []

  return (
    <AppLayout>
      <div>
        <Head>
          <title>Favorites | NotesApp</title>
        </Head>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-accent-yellow)', letterSpacing: '0.1em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>FAVORITES</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Favorite Notes
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', fontWeight: 500 }}>
              {favoriteNotes.length} {favoriteNotes.length === 1 ? 'favorite' : 'favorites'}
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <MagnifyingGlassIcon size={16} weight="bold" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              className='input-base'
              style={{ padding: '0.4rem 0.4rem 0.4rem 2.25rem' }}
              placeholder='Search favorites…'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Empty State */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: '4px',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderTop: '6px solid var(--color-accent-yellow)'
          }}>
            <StarIcon size={32} weight="bold" color="var(--color-text)" />
          </div>
          <div style={{ color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 700 }}>
            No favorite notes yet.
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Mark notes as favorite to see them here.</p>
        </div>
      </div>
    </AppLayout>
  )
}

export default FavoriteNotes
