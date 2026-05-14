import React from 'react'
import { Note as NoteModel } from '../model/note'
import { formatDate } from '../util/dateformat'
import ShowNoteDialog from './shownotedialog'

interface NoteCardProps {
  note: NoteModel
  color: string
}

const chipColors: Record<string, { bg: string; dot: string; border: string }> = {
  red:    { bg: 'rgba(239, 68, 68, 0.15)', dot: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
  blue:   { bg: 'rgba(59, 130, 246, 0.15)', dot: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
  yellow: { bg: 'rgba(253, 224, 71, 0.15)', dot: '#fde047', border: 'rgba(253, 224, 71, 0.3)' },
}

const NoteCard: React.FC<NoteCardProps> = ({ note, color }: NoteCardProps) => {
  const { text, title, createdAt, updatedAt } = note
  const [clicked, setClicked] = React.useState<boolean>(false)

  const chip = chipColors[color] ?? chipColors.blue

  let createdUpdated: string
  if (updatedAt > createdAt) {
    createdUpdated = `Updated ${formatDate(updatedAt)}`
  } else {
    createdUpdated = `Created ${formatDate(createdAt)}`
  }

  return (
    <>
      <div
        className='note-card'
        onClick={() => setClicked(true)}
        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '200px' }}
      >
        {/* Color accent chip at top */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.25rem 0.65rem',
          background: chip.bg,
          border: `1px solid ${chip.border}`,
          borderRadius: '4px',
          width: 'fit-content',
        }}>
          <span style={{ width: '8px', height: '8px', background: chip.dot, flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: chip.dot, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            note
          </span>
        </div>

        {/* Title */}
        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text)', lineHeight: 1.3, wordBreak: 'break-word' }}>
          {title}
        </div>

        {/* Preview text */}
        {text && (
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          } as React.CSSProperties}>
            {text}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '2px solid var(--color-border)',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{createdUpdated}</span>
          <div style={{
            width: '28px', height: '28px',
            background: 'var(--color-surface-2)',
            borderRadius: '4px',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {clicked && <ShowNoteDialog stat={clicked} note={note} clicked={setClicked} />}
    </>
  )
}

export default NoteCard
