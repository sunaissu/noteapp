import React, { useContext } from 'react'
import * as NotesApi from '../pages/api/fetch'
import { Note } from '../model/note'
import NoteContext from '../context/noteContext'

interface Props {
  showdelete: boolean
  note: Note
  clicked: (value: boolean) => void
}

const ConfirmDelete: React.FC<Props> = ({ showdelete, note, clicked }: Props) => {
  const [deleteDialog, setDeleteDialog] = React.useState<boolean>(showdelete)
  const [loading, setLoading] = React.useState<boolean>(false)
  const context = useContext(NoteContext)

  function confirmClicked() {
    async function deleteNote() {
      try {
        setLoading(true)
        await NotesApi.deleteNotes(note._id)
        context.setNotes(context.notes.filter(val => val._id !== note._id))
        clicked(false)
      } catch (error) {
        console.error(error)
        alert(error)
      } finally {
        setLoading(false)
      }
    }
    deleteNote()
  }

  return (
    <div>
      {deleteDialog && (
        <div className='modal-backdrop' style={{ zIndex: 200 }} onClick={e => { if (e.target === e.currentTarget) { setDeleteDialog(false); clicked(false) } }}>
          <div className='glass-strong modal-panel' style={{
            width: '100%', maxWidth: '380px',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Icon + text */}
            <div style={{ padding: '2rem 2rem 1.25rem', textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                width: '52px', height: '52px',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '50%',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polyline points="3,6 5,6 21,6" stroke="#f87171" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#e8eaf6', marginBottom: '0.5rem' }}>Delete Note?</h2>
              <p style={{ color: '#8892b0', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Are you sure you want to delete <strong style={{ color: '#e8eaf6' }}>&ldquo;{note.title}&rdquo;</strong>? This action cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className='btn-ghost'
                onClick={() => { setDeleteDialog(false); clicked(false) }}
                id='delete-cancel'
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className='btn-danger'
                onClick={() => confirmClicked()}
                id='delete-confirm'
                disabled={loading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfirmDelete
