import Link from "next/link";
import React from "react";
import { User } from "../model/user";
import * as NotesApi from "../util/fetch";
import {
  NotebookIcon,
  CaretDownIcon,
  SquaresFourIcon,
  SignOutIcon,
} from "@phosphor-icons/react";

interface Props {
  loggedInUser: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<Props> = ({ loggedInUser, onLogout }: Props) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);

  async function logout() {
    onLogout();
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "rgba(7, 8, 15, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 16px rgba(108,99,255,0.5)",
              }}
            >
              <NotebookIcon weight="bold" color="#fff" size={16} />
            </div>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#e8eaf6",
                letterSpacing: "-0.01em",
              }}
            >
              Thync<span style={{ color: "#6c63ff" }}>Space</span>
            </span>
          </div>
        </Link>

        {/* Nav actions */}
        {loggedInUser && loggedInUser.username ? (
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1rem",
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.25)",
                borderRadius: "999px",
                color: "#a78bfa",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {loggedInUser?.username
                  ? loggedInUser.username.charAt(0).toUpperCase()
                  : "?"}
              </div>
              {loggedInUser?.username || "User"}
              <CaretDownIcon weight="bold" size={14} />
            </button>

            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  paddingTop: "8px",
                }}
              >
                <div
                  style={{
                    background: "rgba(15, 17, 23, 0.95)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    minWidth: "160px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                    animation: "fade-in 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 1.25rem",
                      color: "#f87171",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(239,68,68,0.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                    onClick={() => logout()}
                  >
                    <SignOutIcon weight="bold" size={16} />
                    Log Out
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button
                className="btn-ghost"
                style={{ padding: "0.45rem 1.25rem", fontSize: "0.875rem" }}
              >
                Log In
              </button>
            </Link>
            <Link href="/register" style={{ textDecoration: "none" }}>
              <button
                className="btn-primary"
                style={{ padding: "0.45rem 1.25rem", fontSize: "0.875rem" }}
              >
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
