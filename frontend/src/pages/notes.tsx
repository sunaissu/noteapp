import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import {
  Note,
  NoteType,
  isNoteFavorited,
  noteMatchesSearch,
} from "../model/note";
import { User } from "../model/user";
import NoteCard from "../components/note";
import * as NotesApi from "./api/fetch";
import AddNoteDialog from "../components/addnotedialog";
import NoteContext from "../context/noteContext";
import AppLayout from "../components/appLayout";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XIcon,
  TrashIcon,
  StarIcon,
  CheckIcon,
  SpinnerBallIcon,
} from "@phosphor-icons/react";
import ActiveNoteEditor from "../components/activeNoteEditor";

interface NotesPageProps {
  loggedInUser: User | null;
}

const Notes: React.FC<NotesPageProps> = ({ loggedInUser }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSwitchingNote, setIsSwitchingNote] = useState(false);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const closeOrSwitchNote = (newId: string | null) => {
    if (selectedNoteId) {
      const prevNote = notes.find((n) => n._id === selectedNoteId);
      if (prevNote && prevNote.title === "Untitled Note") {
        let isEmpty = false;
        if (prevNote.type === NoteType.Document) {
          const docNote = prevNote as any;
          isEmpty = !docNote.content || docNote.content.trim() === "";
        } else if (prevNote.type === NoteType.Whiteboard) {
          let elements = [];
          try {
            const wb = prevNote.content as any;
            if (typeof wb === "string") elements = JSON.parse(wb).elements;
            else if (wb && wb.elements) elements = wb.elements;
          } catch (e) {}
          isEmpty = elements.length === 0;
        }
        if (isEmpty) {
          NotesApi.deleteNotes(prevNote._id).catch(console.error);
          setNotes((prev) => prev.filter((n) => n._id !== prevNote._id));
        }
      }
    }

    if (newId === selectedNoteId) return;
    if (newId) {
      setIsSwitchingNote(true);
      setSelectedNoteId(newId);
      setTimeout(() => setIsSwitchingNote(false), 400);
    } else {
      setSelectedNoteId(null);
    }
  };

  const handleNoteSelect = (id: string) => closeOrSwitchNote(id);

  // Inline-editable title state
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNote = async (type: NoteType) => {
    try {
      const newNote = (await NotesApi.createNotes({
        title: "Untitled Note",
        type: type,
      })) as Note;
      setNotes([newNote, ...notes]);
      setSelectedNoteId(newNote._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await NotesApi.deleteNotes(noteId);
        setNotes(notes.filter((n) => n._id !== noteId));
        if (selectedNoteId === noteId) {
          closeOrSwitchNote(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleFavorite = async (noteId: string) => {
    try {
      const updatedNote = await NotesApi.toggleFavoriteNote(noteId);
      setNotes(
        notes.map((n) =>
          n._id === noteId ? { ...n, favoritedBy: updatedNote.favoritedBy } : n,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function loadNotes() {
      try {
        const fetchedNotes = await NotesApi.fetchNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        console.error(error);
      }
    }
    loadNotes();
  }, []);

  useEffect(() => {
    setEditingTitle(false);
    if (activeNote) setTitleDraft(activeNote.title);
  }, [selectedNoteId]);

  useEffect(() => {
    if (editingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [editingTitle]);

  const commitTitleEdit = async () => {
    if (!activeNote) return;
    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === activeNote.title) {
      setEditingTitle(false);
      setTitleDraft(activeNote.title);
      return;
    }
    try {
      await NotesApi.updateNotes(activeNote._id, { title: trimmed });
      setNotes((prev) =>
        prev.map((n) =>
          n._id === activeNote._id ? { ...n, title: trimmed } : n,
        ),
      );
    } catch (err) {
      console.error("Failed to update title", err);
    }
    setEditingTitle(false);
  };

  const filteredNotes = notes.filter((n) => noteMatchesSearch(n, search));

  const activeNote = notes.find((n) => n._id === selectedNoteId) || null;
  const isFav =
    activeNote && loggedInUser
      ? isNoteFavorited(activeNote, loggedInUser._id)
      : false;

  const isOwner =
    loggedInUser && activeNote ? activeNote.owner === loggedInUser._id : false;
  const isEditor =
    loggedInUser && activeNote
      ? activeNote.sharedWith?.some(
          (c) => c.userId === loggedInUser._id && c.permission === "editor",
        )
      : false;
  const canEdit = isOwner || isEditor;

  return (
    <AppLayout>
      <NoteContext.Provider value={{ notes, setNotes }}>
        <Head>
          <title>My Notes | ThyncSpace</title>
          <meta name="description" content="Your personal notes." />
        </Head>
        <div
          style={{
            display: selectedNoteId ? "flex" : "block",
            gap: "1rem",
            height: selectedNoteId ? "calc(100vh - 120px)" : "auto",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              flex: selectedNoteId ? "0 0 320px" : "none",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "1rem",
                flexDirection: selectedNoteId ? "column" : "row",
                gap: "0.75rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "var(--color-accent-blue)",
                    letterSpacing: "0.1em",
                    marginBottom: "0.4rem",
                    textTransform: "uppercase",
                  }}
                >
                  NOTES
                </div>
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: "var(--color-text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  My Notes
                </h1>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.875rem",
                    marginTop: "0.35rem",
                    fontWeight: 500,
                  }}
                >
                  {notes.length} {notes.length === 1 ? "note" : "notes"} saved
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  width: selectedNoteId ? "100%" : "260px",
                }}
              >
                {selectedNoteId && (
                  <AddNoteDialog
                    onSave={handleCreateNote}
                    trigger={
                      <button
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          width: "100%",
                          padding: "0.4rem 0.6rem",
                          background: "var(--color-text)",
                          color: "var(--color-bg)",
                          border: "2px solid var(--color-text)",
                          borderRadius: "8px",
                          fontWeight: 800,
                          cursor: "pointer",
                          transition: "background-color 0.15s ease",
                          boxShadow: "4px 4px 0px rgba(0,0,0,0.5)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#d1d5db";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--color-text)";
                        }}
                      >
                        <PlusIcon weight="bold" size={20} /> Add new note
                      </button>
                    }
                  />
                )}
                <div style={{ position: "relative", width: "100%" }}>
                  <MagnifyingGlassIcon
                    size={16}
                    weight="bold"
                    style={{
                      position: "absolute",
                      left: "0.9rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-text-muted)",
                    }}
                  />
                  <input
                    className="input-base"
                    style={{
                      paddingLeft: "2.25rem",
                      width: "100%",
                      padding: "0.4rem 0.4rem 0.4rem 2.25rem",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      background: "var(--color-surface)",
                    }}
                    placeholder="Search notes…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    id="dashboard-search"
                  />
                </div>
              </div>
            </div>

            {filteredNotes.length === 0 ? (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "var(--color-text-muted)",
                }}
              >
                No notes found.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: selectedNoteId
                    ? "1fr"
                    : "repeat(auto-fill, minmax(280px, 1fr))",
                  gridAutoRows: "220px",
                  gap: "0.75rem",
                  overflowY: selectedNoteId ? "auto" : "visible",
                  paddingRight: selectedNoteId ? "0.5rem" : "0",
                  paddingBottom: "1rem",
                }}
              >
                {!selectedNoteId && (
                  <AddNoteDialog
                    onSave={handleCreateNote}
                    trigger={
                      <div
                        style={{
                          cursor: "pointer",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.75rem",
                          borderRadius: "8px",
                          border: "2px dashed var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text-muted)",
                          transition:
                            "border-color 0.15s, color 0.15s, background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--color-accent-blue)";
                          e.currentTarget.style.color =
                            "var(--color-accent-blue)";
                          e.currentTarget.style.backgroundColor =
                            "rgba(96, 165, 250, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--color-border)";
                          e.currentTarget.style.color =
                            "var(--color-text-muted)";
                          e.currentTarget.style.backgroundColor =
                            "var(--color-surface)";
                        }}
                      >
                        <PlusIcon size={32} weight="bold" />
                        <span
                          style={{ fontWeight: 700, letterSpacing: "0.02em" }}
                        >
                          Add New Note
                        </span>
                      </div>
                    }
                  />
                )}
                {filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => handleNoteSelect(note._id)}
                    style={{ cursor: "pointer", height: "100%" }}
                  >
                    <NoteCard
                      note={note}
                      loggedInUserId={loggedInUser?._id}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {activeNote && (
            <div
              style={{
                flex: 1,
                background: "var(--color-surface)",
                border: "2px solid var(--color-border)",
                borderRadius: "12px",
                boxShadow: "4px 4px 0px rgba(0,0,0,0.5)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderBottom: "2px solid var(--color-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--color-bg)",
                  gap: "0.75rem",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {/* Inline-editable title */}
                  {editingTitle ? (
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
                          setTitleDraft(activeNote.title);
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
                  ) : (
                    <span
                      title="Click to rename"
                      onClick={() => {
                        setTitleDraft(activeNote.title);
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
                        (e.currentTarget.style.borderBottomColor =
                          "var(--color-text-muted)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderBottomColor =
                          "transparent")
                      }
                    >
                      {activeNote.title}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)",
                      background: "rgba(255,255,255,0.03)",
                      flexShrink: 0,
                    }}
                  >
                    {activeNote.type}
                  </span>
                  <div
                    style={{
                      width: "80px",
                      display: "flex",
                      justifyContent: "flex-end",
                      marginRight: "0.25rem",
                    }}
                  >
                    {saveStatus === "saving" && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "var(--color-text-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <SpinnerBallIcon className="spin" /> Saving...
                      </span>
                    )}
                    {saveStatus === "saved" && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "var(--color-accent-blue)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CheckIcon weight="bold" /> Saved
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(activeNote._id);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: isFav
                        ? "var(--color-accent-yellow)"
                        : "var(--color-text-muted)",
                      display: "flex",
                      alignItems: "center",
                      transition: "transform 0.1s ease, color 0.15s ease",
                    }}
                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(234, 179, 8, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <StarIcon size={24} weight={isFav ? "fill" : "bold"} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(activeNote._id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-accent-red)",
                      display: "flex",
                      alignItems: "center",
                      transition: "background-color 0.1s ease",
                      borderRadius: "4px",
                      padding: "4px",
                    }}
                    title="Delete Note"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(239, 68, 68, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <TrashIcon size={24} weight="bold" />
                  </button>
                  <button
                    onClick={() => closeOrSwitchNote(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-text)",
                      display: "flex",
                      alignItems: "center",
                      transition: "background-color 0.1s ease",
                      borderRadius: "4px",
                      padding: "4px",
                    }}
                    title="Close Note"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <XIcon size={24} weight="bold" />
                  </button>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {isSwitchingNote ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SpinnerBallIcon
                      className="spin"
                      size={48}
                      color="var(--color-text-muted)"
                    />
                  </div>
                ) : (
                  <ActiveNoteEditor
                    note={activeNote}
                    readOnly={!canEdit}
                    onSaveStatusChange={setSaveStatus}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </NoteContext.Provider>
    </AppLayout>
  );
};

export default Notes;
