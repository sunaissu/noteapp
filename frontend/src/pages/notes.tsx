import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Note, NoteType } from '../model/note'
import NoteCard from '../components/note'
import * as NotesApi from './api/fetch'
import AddNoteDialog from '../components/addnotedialog'
import NoteContext from '../context/noteContext'
import AppLayout from '../components/appLayout'
import { MagnifyingGlassIcon, PlusIcon, XIcon, TrashIcon } from '@phosphor-icons/react'
import ActiveNoteEditor from '../components/activeNoteEditor'

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState<string>('')
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  const handleCreateNote = async (type: NoteType) => {
    try {
      const newNote = (await NotesApi.createNotes({
        title: 'Untitled Note',
        type: type,
      })) as Note
      setNotes([newNote, ...notes])
      setSelectedNoteId(newNote._id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await NotesApi.deleteNotes(noteId)
        setNotes(notes.filter(n => n._id !== noteId))
        if (selectedNoteId === noteId) {
          setSelectedNoteId(null)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    async function loadNotes() {
      try {
        const fetchedNotes = await NotesApi.fetchNotes()
        setNotes(fetchedNotes)
      } catch (error) {
        console.error(error)
      }
    }
    loadNotes()
  }, [])

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  const activeNote = notes.find(n => n._id === selectedNoteId) || null;

  return (
    <AppLayout>
      <NoteContext.Provider value={{ notes, setNotes }}>
        <Head>
          <title>My Notes | NotesApp</title>
          <meta name="description" content="Your personal notes." />
        </Head>
        <div style={{
          display: selectedNoteId ? 'flex' : 'block',
          gap: '1rem',
          height: selectedNoteId ? 'calc(100vh - 120px)' : 'auto',
          alignItems: 'flex-start'
        }}>

          <div style={{
            flex: selectedNoteId ? '0 0 320px' : 'none',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transition: 'all 0.3s ease'
          }}>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              flexDirection: selectedNoteId ? 'column' : 'row',
              gap: '0.75rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent-blue)', letterSpacing: '0.1em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  NOTES
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  My Notes
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.35rem', fontWeight: 500 }}>
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: selectedNoteId ? '100%' : '260px' }}>
                <AddNoteDialog
                  onSave={handleCreateNote}
                  trigger={
                    <button style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      width: '100%', padding: '0.4rem 0.6rem',
                      background: 'var(--color-text)', color: 'var(--color-bg)',
                      border: '2px solid var(--color-text)', borderRadius: '8px',
                      fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s ease',
                      boxShadow: '4px 4px 0px rgba(0,0,0,0.5)'
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translate(-2px, -2px)'
                        e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.5)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.5)'
                      }}>
                      <PlusIcon weight="bold" size={20} /> Add new note
                    </button>
                  }
                />
                <div style={{ position: 'relative', width: '100%' }}>
                  <MagnifyingGlassIcon size={16} weight="bold" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    className='input-base'
                    style={{
                      paddingLeft: '2.25rem',
                      width: '100%',
                      padding: '0.4rem 0.4rem 0.4rem 2.25rem',
                      border: '2px solid var(--color-border)',
                      borderRadius: '8px',
                      background: 'var(--color-surface)',
                    }}
                    placeholder='Search notes…'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    id='dashboard-search'
                  />
                </div>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                No notes found.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: selectedNoteId ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.75rem',
                overflowY: selectedNoteId ? 'auto' : 'visible',
                paddingRight: selectedNoteId ? '0.5rem' : '0',
                paddingBottom: '1rem'
              }}>
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => setSelectedNoteId(note._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <NoteCard
                      note={note}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {activeNote && (
            <div style={{
              flex: 1,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-border)',
              borderRadius: '12px',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '2px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--color-bg)'
              }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{activeNote.title}</h2>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handleDeleteNote(activeNote._id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-accent-red)', display: 'flex', alignItems: 'center', transition: 'transform 0.1s ease' }}
                    title="Delete Note"
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <TrashIcon size={24} weight="bold" />
                  </button>
                  <button
                    onClick={() => setSelectedNoteId(null)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', transition: 'transform 0.1s ease' }}
                    title="Close Note"
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <XIcon size={24} weight="bold" />
                  </button>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                <ActiveNoteEditor note={activeNote} />
              </div>
            </div>
          )}
        </div>

      </NoteContext.Provider>
    </AppLayout>
  )
}

export default Notes
