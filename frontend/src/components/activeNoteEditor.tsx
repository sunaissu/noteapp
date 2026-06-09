import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Note, NoteType, DocumentNote, WhiteboardNote } from "../model/note";
import { Noteboard, NoteboardRef } from "@sunaissu/noteboard";
import type { NoteboardSession } from "@sunaissu/noteboard";
import * as NotesApi from "../util/fetch";
import NoteContext from "../context/noteContext";

interface ActiveNoteEditorProps {
  note: Note;
  readOnly?: boolean;
  onSaveStatusChange?: (status: "saving" | "saved" | "idle") => void;
}

const AUTOSAVE_DEBOUNCE_MS = 1500;

const ActiveNoteEditor: React.FC<ActiveNoteEditorProps> = ({
  note,
  readOnly,
  onSaveStatusChange,
}) => {
  const initialDocContent =
    note.type === NoteType.Document ? (note as DocumentNote).content || "" : "";
  const initialWbContent =
    note.type === NoteType.Whiteboard
      ? (note as WhiteboardNote).content
      : undefined;
  const initialSerializedWbContent = initialWbContent
    ? JSON.stringify(initialWbContent)
    : "";

  const [content, setContent] = useState(initialDocContent);
  const { setNotes } = useContext(NoteContext);

  const boardRef = useRef<NoteboardRef>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContent = useRef<string>(
    note.type === NoteType.Document
      ? initialDocContent
      : initialSerializedWbContent,
  );

  const contentRef = useRef(content);
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    onSaveStatusChange?.("idle");
    const currentBoard = boardRef.current;

    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
        autosaveTimer.current = null;

        if (readOnly) return;

        if (note.type === NoteType.Document) {
          const latestContent = contentRef.current;
          if (latestContent !== lastSavedContent.current) {
            NotesApi.updateNotes(note._id, { text: latestContent }, true).catch(
              console.error,
            );
          }
        } else if (note.type === NoteType.Whiteboard) {
          const session = currentBoard?.getSession();
          if (session) {
            const serialized = JSON.stringify(session);
            if (serialized !== lastSavedContent.current) {
              NotesApi.updateNotes(note._id, { text: serialized }, true).catch(
                console.error,
              );
            }
          }
        }
      }
    };
  }, [note._id, note.type, readOnly, onSaveStatusChange]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (autosaveTimer.current) {
          clearTimeout(autosaveTimer.current);
          autosaveTimer.current = null;

          if (readOnly) return;

          if (note.type === NoteType.Document) {
            const latestContent = contentRef.current;
            if (latestContent !== lastSavedContent.current) {
              lastSavedContent.current = latestContent;
              NotesApi.updateNotes(
                note._id,
                { text: latestContent },
                true,
              ).catch(console.error);
            }
          } else if (note.type === NoteType.Whiteboard) {
            const session = boardRef.current?.getSession();
            if (session) {
              const serialized = JSON.stringify(session);
              if (serialized !== lastSavedContent.current) {
                lastSavedContent.current = serialized;
                NotesApi.updateNotes(
                  note._id,
                  { text: serialized },
                  true,
                ).catch(console.error);
              }
            }
          }
        }
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [note._id, note.type, readOnly]);

  const saveDocumentContent = useCallback(
    async (newContent: string) => {
      if (readOnly) return;
      if (newContent === lastSavedContent.current) return;
      lastSavedContent.current = newContent;
      try {
        onSaveStatusChange?.("saving");
        await NotesApi.updateNotes(note._id, { text: newContent });
        setNotes((prev) =>
          prev.map((n) =>
            n._id === note._id
              ? ({ ...n, content: newContent } as DocumentNote)
              : n,
          ),
        );
        onSaveStatusChange?.("saved");
        setTimeout(() => onSaveStatusChange?.("idle"), 2000);
      } catch (error) {
        console.error("Failed to autosave note", error);
      }
    },
    [note._id, setNotes, readOnly, onSaveStatusChange],
  );

  const handleDocumentContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (readOnly) return;
    const newContent = e.target.value;
    setContent(newContent);

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveDocumentContent(newContent);
    }, AUTOSAVE_DEBOUNCE_MS);
  };

  const saveWhiteboardSession = useCallback(
    async (session: NoteboardSession) => {
      if (readOnly) return;
      const serialized = JSON.stringify(session);
      if (serialized === lastSavedContent.current) return;
      lastSavedContent.current = serialized;
      try {
        onSaveStatusChange?.("saving");
        await NotesApi.updateNotes(note._id, { text: serialized });
        setNotes((prev) =>
          prev.map((n) =>
            n._id === note._id
              ? ({ ...n, content: session } as WhiteboardNote)
              : n,
          ),
        );
        onSaveStatusChange?.("saved");
        setTimeout(() => onSaveStatusChange?.("idle"), 2000);
      } catch (err) {
        console.error("Failed to autosave whiteboard", err);
      }
    },
    [note._id, setNotes, readOnly, onSaveStatusChange],
  );

  const handleWhiteboardElementsChange = useCallback(() => {
    if (readOnly) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      const session = boardRef.current?.getSession();
      if (session) saveWhiteboardSession(session);
    }, AUTOSAVE_DEBOUNCE_MS);
  }, [saveWhiteboardSession, readOnly]);

  const handleWhiteboardSave = useCallback(
    (session: NoteboardSession) => {
      if (readOnly) return;
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      saveWhiteboardSession(session);
    },
    [saveWhiteboardSession, readOnly],
  );

  const getInitialWhiteboardElements = () => {
    const wb = note as WhiteboardNote;
    if (!wb.content) return undefined;
    if (typeof wb.content === "string") {
      try {
        return JSON.parse(wb.content as unknown as string).elements;
      } catch {
        return undefined;
      }
    }
    return wb.content.elements;
  };

  const getInitialViewport = () => {
    const wb = note as WhiteboardNote;
    if (!wb.content) return undefined;
    if (typeof wb.content === "string") {
      try {
        return JSON.parse(wb.content as unknown as string).viewport;
      } catch {
        return undefined;
      }
    }
    return wb.content.viewport;
  };

  if (note.type === NoteType.Document) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "0.5rem",
        }}
      >
        {!readOnly ? (
          <textarea
            className="md-editor"
            value={content}
            onChange={handleDocumentContentChange}
            placeholder="Write your note here…"
          />
        ) : (
          <div className="md-preview">
            {/* TODO: replace with a markdown */}
            <pre
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "inherit",
                margin: 0,
              }}
            >
              {content || "Empty document…"}
            </pre>
          </div>
        )}
      </div>
    );
  }

  if (note.type === NoteType.Whiteboard) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Noteboard
            key={note._id}
            ref={boardRef}
            readOnly={!!readOnly}
            initialElements={getInitialWhiteboardElements()}
            initialViewport={getInitialViewport()}
            onElementsChange={handleWhiteboardElementsChange}
            onSave={handleWhiteboardSave}
          />
        </div>
      </div>
    );
  }

  return <div>Unknown note type</div>;
};

export default ActiveNoteEditor;
