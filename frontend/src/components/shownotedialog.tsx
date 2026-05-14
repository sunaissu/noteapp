import React from 'react'
import { Note } from '../model/note'
import ConfirmDelete from './deletenotedialog'
import UpdateNoteDialog from './updatenotedialog'
import { formatDate } from '../util/dateformat'

interface Props {
  stat: boolean
  note: Note
  clicked: (value: boolean) => void
}

const ShowNoteDialog: React.FC<Props> = ({ stat, note, clicked }: Props) => {
  const { text, title, createdAt, updatedAt } = note
  const [showDialog, setShowDialog] = React.useState<boolean>(stat)
  const [deleteClicked, setDeleteClicked] = React.useState<boolean>(false)
  const [updateClicked, setUpdateClicked] = React.useState<boolean>(false)

  const remove = (value: boolean) => {
    setDeleteClicked(value)
    clicked(false)
  }

  const update = (value: boolean) => {
    setUpdateClicked(value)
    clicked(false)
  }

  const close = () => {
    setShowDialog(false)
    clicked(false)
  }

  const dateLabel = updatedAt > createdAt
    ? `Updated ${formatDate(updatedAt)}`
    : `Created ${formatDate(createdAt)}`

  return (
    <div>
      {showDialog && (
        <div className='modal-backdrop' onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div className='glass-strong modal-panel' style={{
            width: '100%', maxWidth: '520px',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            position: 'relative',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{ padding: '1.75rem 2rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e8eaf6', lineHeight: 1.3, letterSpacing: '-0.01em', wordBreak: 'break-word' }}>
                    {title}
                  </h2>
                  <p style={{ color: '#4a5568', fontSize: '0.73rem', marginTop: '0.35rem', fontWeight: 500 }}>{dateLabel}</p>
                </div>
                <button
                  onClick={close}
                  style={{ background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#8892b0" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', flex: 1 }}>
              {text ? (
                <p style={{ color: '#c8cfe8', fontSize: '0.9rem', lineHeight: 1.75, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                  {text}
                </p>
              ) : (
                <p style={{ color: '#4a5568', fontSize: '0.875rem', fontStyle: 'italic' }}>No content in this note.</p>
              )}
            </div>

            {/* Footer actions */}
            <div style={{ padding: '1rem 2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button
                className='btn-danger'
                onClick={() => setDeleteClicked(true)}
                id='show-note-delete'
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.83rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.4rem' }}>
                  <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
              <button
                className='btn-primary'
                onClick={() => setUpdateClicked(true)}
                id='show-note-edit'
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.83rem' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.4rem' }}>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Edit
              </button>
            </div>
          </div>

          {deleteClicked && <ConfirmDelete showdelete={deleteClicked} note={note} clicked={remove} />}
          {updateClicked && <UpdateNoteDialog showupdate={updateClicked} note={note} clicked={update} />}
        </div>
      )}
    </div>
  )
}

export default ShowNoteDialog
