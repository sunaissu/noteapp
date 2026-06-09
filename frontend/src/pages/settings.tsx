import Head from "next/head";
import React from "react";
import AppLayout from "../components/appLayout";

const Settings: React.FC = () => {
  return (
    <AppLayout>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Head>
          <title>Settings | ThyncSpace</title>
        </Head>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              color: "var(--color-text-muted)",
              letterSpacing: "0.1em",
              marginBottom: "0.4rem",
              textTransform: "uppercase",
            }}
          >
            SETTINGS
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
            Preferences
          </h1>
        </div>

        {/* Settings Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "10vh",
          }}
        >
          <section
            style={{
              background: "var(--color-surface)",
              border: "2px dashed var(--color-border)",
              borderRadius: "8px",
              padding: "3rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <div style={{ fontSize: "3rem" }}>🚧</div>
            <div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--color-text)",
                  marginBottom: "0.5rem",
                }}
              >
                Settings Under Construction
              </h2>
              <p
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "0.95rem",
                  maxWidth: "400px",
                  margin: "0 auto",
                  lineHeight: 1.5,
                }}
              >
                We are currently building out the preferences dashboard. Check
                back later for themes, account management, and more!
              </p>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
