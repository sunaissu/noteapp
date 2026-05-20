import React from 'react'
import { Note as NoteModel } from '../model/note'
import { formatDate } from '../util/dateformat'

interface NoteCardProps {
  note: NoteModel
}
const NoteCard: React.FC<NoteCardProps> = ({ note }: NoteCardProps) => {
  const { content, title, createdAt, updatedAt } = note
  const [clicked, setClicked] = React.useState<boolean>(false)

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
        style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '100px' }}
      >
        {/* Title */}
        <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-text)', lineHeight: 1, wordBreak: 'break-word' }}>
          {title}
        </div>

        {/* Preview */}
        {content && (
          <div style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          } as React.CSSProperties}>
            {/* {text} */}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.35rem',
          borderTop: '2px solid var(--color-border)',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{createdUpdated}</span>
          <div style={{
            width: '24px', height: '24px',
            background: 'var(--color-surface-2)',
            borderRadius: '4px',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </>
  )
}

export default NoteCard
