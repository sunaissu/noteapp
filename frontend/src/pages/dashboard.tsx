import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Note } from '../model/note'
import NoteCard from '../components/note'
import * as NotesApi from './api/fetch'
import AddNoteDialog from '../components/addnotedialog'
import NoteContext from '../context/noteContext'

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await NotesApi.fetchNotes()
        setNotes(notes)
      } catch (error) {
        console.error(error)
        alert(error)
      }
    }
    loadNotes()
  }, [])

  const colorPicker = () => {
    const colorArr = ['red', 'blue', 'yellow']
    return colorArr[Math.floor(Math.random() * colorArr.length)]
  }

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.text.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <NoteContext.Provider value={{ notes, setNotes }}>
      <div>
        <Head>
          <title>NotesApp | Dashboard</title>
          <meta name="description" content="Your personal notes dashboard." />
        </Head>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 2rem', minHeight: 'calc(100vh - 64px)' }}>
          {/* Dashboard header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-accent-blue)', letterSpacing: '0.1em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>DASHBOARD</div>
              <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                My Notes
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', fontWeight: 500 }}>
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved
              </p>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <svg style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                className='input-base'
                style={{ paddingLeft: '2.5rem' }}
                placeholder='Search notes…'
                value={search}
                onChange={e => setSearch(e.target.value)}
                id='dashboard-search'
              />
            </div>
          </div>

          {/* Notes grid */}
          {filteredNotes.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
              <div style={{
                width: '64px', height: '64px',
                background: 'var(--color-surface)',
                border: '2px solid var(--color-border)',
                borderRadius: '4px',
                boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem',
              }}>📝</div>
              <div style={{ color: 'var(--color-text)', fontSize: '1.1rem', fontWeight: 700 }}>
                {search ? 'No notes match your search' : 'No notes yet. Create your first!'}
              </div>
              {!search && (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Click the + button below to add a note</p>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.1rem' }}>
              {filteredNotes.map((note, key) => (
                <NoteCard key={key} note={note} color={colorPicker()} />
              ))}
            </div>
          )}
        </div>

        {/* FAB */}
        <AddNoteDialog onSave={newNote => setNotes([...notes, newNote])} />
      </div>
    </NoteContext.Provider>
  )
}

export default Dashboard
