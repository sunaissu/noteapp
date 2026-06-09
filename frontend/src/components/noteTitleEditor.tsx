import React, { useState, useRef, useEffect } from "react";
import { Note } from "../model/note";

interface NoteTitleEditorProps {
  note: Note;
  onUpdateTitle: (noteId: string, newTitle: string) => Promise<void>;
}

const NoteTitleEditor: React.FC<NoteTitleEditorProps> = ({ note, onUpdateTitle }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(note.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [editingTitle]);

  const commitTitleEdit = async () => {
    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === note.title) {
      setEditingTitle(false);
      setTitleDraft(note.title);
      return;
    }
    await onUpdateTitle(note._id, trimmed);
    setEditingTitle(false);
  };

  if (editingTitle) {
    return (
      <input
        ref={titleInputRef}
        value={titleDraft}
        onChange={(e) => setTitleDraft(e.target.value)}
        onBlur={commitTitleEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitTitleEdit();
          }
          if (e.key === "Escape") {
            setEditingTitle(false);
            setTitleDraft(note.title);
          }
        }}
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: "1rem",
          fontWeight: 700,
          background: "var(--color-surface-2)",
          color: "var(--color-text)",
          border: "2px solid var(--color-accent-blue)",
          borderRadius: "6px",
          padding: "0.2rem 0.5rem",
          outline: "none",
          fontFamily: "var(--font-sans)",
        }}
      />
    );
  }

  return (
    <span
      title="Click to rename"
      onClick={() => {
        setTitleDraft(note.title);
        setEditingTitle(true);
      }}
      style={{
        fontSize: "1rem",
        fontWeight: 700,
        color: "var(--color-text)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: 1,
        minWidth: 0,
        cursor: "text",
        borderBottom: "1px dashed transparent",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderBottomColor = "var(--color-text-muted)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderBottomColor = "transparent")
      }
    >
      {note.title}
    </span>
  );
};

export default NoteTitleEditor;
