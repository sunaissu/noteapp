import React, { useState } from 'react';
import { Note, NoteType } from '../model/note';
// Import your board package (adjust based on actual package exports)
import { Noteboard } from '@sunaissu/noteboard';

interface ActiveNoteEditorProps {
    note: Note;
}

const ActiveNoteEditor: React.FC<ActiveNoteEditorProps> = ({ note }) => {
    // State for toggling between View and Edit modes (for documents)
    const [isEditing, setIsEditing] = useState(false);

    if (note.type === NoteType.Document) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Toggle Switch */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            padding: '0.4rem 0.75rem',
                            fontWeight: 700,
                            border: '2px solid var(--color-border)',
                            borderRadius: '8px',
                            background: isEditing ? 'var(--color-accent-blue)' : 'var(--color-surface)',
                            color: isEditing ? '#fff' : 'var(--color-text)',
                            cursor: 'pointer',
                            boxShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                        }}
                    >
                        {isEditing ? 'Editing' : 'View Mode'}
                    </button>
                </div>

                {/* Markdown Content */}
                {isEditing ? (
                    <textarea
                        defaultValue={note.content}
                        style={{
                            flex: 1,
                            width: '100%',
                            padding: '0.75rem',
                            border: '2px dashed var(--color-border)',
                            borderRadius: '8px',
                            resize: 'none',
                            fontFamily: 'monospace'
                        }}
                        placeholder="Write your markdown here..."
                    />
                ) : (
                    <div style={{ padding: '0.5rem', lineHeight: '1.6' }}>
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                            {note.content || "Empty document..."}
                        </pre>
                    </div>
                )}
            </div>
        );
    }

    // 2. Render the Whiteboard Canvas
    if (note.type === NoteType.Whiteboard) {
        return (
            <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                <Noteboard />
            </div>
        );
    }

    return <div>Unknown note type</div>;
}

export default ActiveNoteEditor;
