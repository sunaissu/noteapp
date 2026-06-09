import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  NotepadIcon,
  UsersIcon,
  StarIcon,
  GearIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebar-collapsed") === "true";
    }
    return false;
  });

  const toggleSidebar = () => {
    const val = !isCollapsed;
    setIsCollapsed(val);
    localStorage.setItem("sidebar-collapsed", val.toString());
  };

  const workspaceItems = [
    {
      label: "My Notes",
      path: "/notes",
      icon: <NotepadIcon weight="bold" />,
      color: "var(--color-accent-blue)",
    },
    {
      label: "Shared with me",
      path: "/shared",
      icon: <UsersIcon weight="bold" />,
      color: "var(--color-accent-red)",
    },
    {
      label: "Favorites",
      path: "/favorites",
      icon: <StarIcon weight="bold" />,
      color: "var(--color-accent-yellow)",
    },
  ];

  const preferenceItems = [
    {
      label: "Settings",
      path: "/settings",
      icon: <GearIcon weight="bold" />,
      color: "var(--color-text)",
    },
  ];

  const renderNavItem = (item: any) => {
    const isActive =
      router.pathname.startsWith(item.path) ||
      (item.path === "/notes" && router.pathname === "/dashboard");

    return (
      <Link key={item.path} href={item.path} style={{ textDecoration: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: "0.75rem",
            padding: "0.4rem 0.75rem",
            borderRadius: "8px",
            border: "2px solid transparent",
            background: isActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
            boxShadow: "none",
            transform: "none",
            color: "var(--color-text)",
            fontWeight: isActive ? 800 : 600,
            transition: "all 0.15s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = "transparent";
            }
          }}
          title={isCollapsed ? item.label : undefined}
        >
          <span
            style={{
              fontSize: "16px",
              filter: isActive ? "none" : "grayscale(100%) opacity(0.7)",
            }}
          >
            {item.icon}
          </span>
          {!isCollapsed && <span>{item.label}</span>}
          {!isCollapsed && isActive && (
            <div
              style={{
                marginLeft: "auto",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: item.color,
              }}
            />
          )}
        </div>
      </Link>
    );
  };

  return (
    <aside
      style={{
        width: isCollapsed ? "64px" : "240px",
        borderRight: "2px solid var(--color-border)",
        background: "var(--color-surface)",
        padding: "0.75rem 0.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        transition: "width 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {!isCollapsed && (
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 800,
            color: "var(--color-text-muted)",
            letterSpacing: "0.1em",
            marginBottom: "0.25rem",
            textTransform: "uppercase",
            paddingLeft: "0.5rem",
          }}
        >
          Workspace
        </div>
      )}

      {workspaceItems.map(renderNavItem)}

      {!isCollapsed && (
        <div
          style={{
            marginTop: "0.75rem",
            fontSize: "0.85rem",
            fontWeight: 800,
            color: "var(--color-text-muted)",
            letterSpacing: "0.1em",
            marginBottom: "0.25rem",
            textTransform: "uppercase",
            paddingLeft: "0.5rem",
          }}
        >
          Preferences
        </div>
      )}

      {preferenceItems.map(renderNavItem)}

      {/* Collapse Toggle Button */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderRadius: "6px",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            padding: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: "0.5rem",
            transition: "background 0.2s ease, color 0.2s ease",
            fontWeight: 600,
            fontSize: "0.85rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text)";
            e.currentTarget.style.background = "var(--color-surface-2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.background = "transparent";
          }}
          title={isCollapsed ? "Expand Sidebar" : undefined}
        >
          {isCollapsed ? (
            <CaretRightIcon weight="bold" size={16} />
          ) : (
            <>
              <CaretLeftIcon weight="bold" size={16} />
              Collapse Sidebar
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
