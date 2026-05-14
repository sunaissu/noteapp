import React, { useContext, useRef } from 'react'
import * as NotesApi from '../pages/api/fetch'
import { Note } from '../model/note'
import NoteContext from '../context/noteContext'

interface Props {
  showupdate: boolean
  note: Note
  clicked: (value: boolean) => void
}

const UpdateNoteDialog: React.FC<Props> = ({ showupdate, note, clicked }: Props) => {
  const { _id: id, text, title } = note
  const [updateDialog, setUpdateDialog] = React.useState<boolean>(showupdate)
  const [newTitle, setNewTitle] = React.useState<string>(title)
  const [newText, setNewText] = React.useState<string>(text)
  const [isblank, setIsblank] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const context = useContext(NoteContext)

  const close = () => {
    setUpdateDialog(false)
    clicked(false)
  }

  const updateClicked = () => {
    async function updateNote() {
      try {
        if (newTitle) {
          setLoading(true)
          const newNote = await NotesApi.updateNotes(id, { title: newTitle, text: newText })
          context.setNotes(context.notes.map(prev => (prev._id === id ? newNote : prev)))
          clicked(false)
        } else {
          if (titleRef.current) {
            setIsblank(true)
            setTimeout(() => {
              setIsblank(false)
            }, 5000)
          }
        }
      } catch (error) {
        console.error(error)
        alert(error)
      } finally {
        setLoading(false)
      }
    }
    updateNote()
  }

  return (
    <div>
      {updateDialog && (
        <div className='modal-backdrop' style={{ zIndex: 100 }} onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div className='glass-strong modal-panel' style={{
            width: '100%', maxWidth: '500px',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Header */}
            <div style={{ padding: '1.75rem 2rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e8eaf6', letterSpacing: '-0.01em' }}>Edit Note</h2>
                  <p style={{ color: '#8892b0', fontSize: '0.8rem', marginTop: '0.2rem' }}>Update your note content</p>
                </div>
                <button
                  onClick={close}
                  style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#8892b0" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#8892b0', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Title <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  ref={titleRef}
                  className='input-base'
                  type='text'
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  id='update-note-title'
                  style={isblank ? { borderColor: 'rgba(239,68,68,0.5)', boxShadow: '0 0 0 3px rgba(239,68,68,0.15)' } : {}}
                />
                {isblank && (
                  <div style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Title is required
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#8892b0', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Content
                </label>
                <textarea
                  className='input-base'
                  value={newText}
                  placeholder='Write your note here…'
                  onChange={e => setNewText(e.target.value)}
                  id='update-note-text'
                  style={{ resize: 'vertical', minHeight: '160px', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 2rem 1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className='btn-ghost' onClick={close} id='update-note-cancel'>
                Cancel
              </button>
              <button className='btn-primary' onClick={() => updateClicked()} id='update-note-save' disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdateNoteDialog
