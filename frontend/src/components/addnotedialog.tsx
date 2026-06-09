import React, { useState } from "react";
import { NoteType } from "../model/note";

interface Props {
  onSave: (type: NoteType) => void;
  trigger?: React.ReactNode;
}

const AddNoteDialog: React.FC<Props> = ({ onSave, trigger }: Props) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onAdd = async (type: NoteType) => {
    setLoading(true);
    try {
      await onSave(type);
      setShowDialog(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div
          onClick={() => setShowDialog(true)}
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          {trigger}
        </div>
      ) : (
        <button
          className="fab"
          onClick={() => setShowDialog(true)}
          id="fab-add-note"
          title="New Note"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {showDialog && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDialog(false);
          }}
        >
          <div
            className="glass-strong modal-panel"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "1.25rem",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                padding: "1.75rem 2rem 1.25rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: "#e8eaf6",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    New Note
                  </h2>
                  <p
                    style={{
                      color: "#8892b0",
                      fontSize: "0.8rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    Choose note type
                  </p>
                </div>
                <button
                  onClick={() => setShowDialog(false)}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "none",
                    cursor: "pointer",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.06)")
                  }
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="#8892b0"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "1.5rem 2rem",
                display: "flex",
                gap: "1.25rem",
              }}
            >
              <button
                onClick={() => onAdd(NoteType.Document)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  border: "2px solid var(--color-border)",
                  borderRadius: "12px",
                  background: "var(--color-surface)",
                  cursor: loading ? "default" : "pointer",
                  transition: "transform 0.15s ease, opacity 0.2s ease",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) =>
                  !loading &&
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  !loading &&
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--color-text)",
                    }}
                  >
                    Document
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                      textAlign: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    Markdown text
                  </div>
                </div>
              </button>

              <button
                onClick={() => onAdd(NoteType.Whiteboard)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  border: "2px solid var(--color-border)",
                  borderRadius: "12px",
                  background: "var(--color-surface)",
                  cursor: loading ? "default" : "pointer",
                  transition: "transform 0.15s ease, opacity 0.2s ease",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) =>
                  !loading &&
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  !loading &&
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--color-text)",
                    }}
                  >
                    Whiteboard
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                      textAlign: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    Infinite canvas
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNoteDialog;
