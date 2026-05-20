import Head from 'next/head'
import React from 'react'
import AppLayout from '../components/appLayout'

const Settings: React.FC = () => {

  return (
    <AppLayout>
      <div>
        <Head>
          <title>Settings | NotesApp</title>
        </Head>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.1em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>SETTINGS</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Preferences
          </h1>
        </div>

        {/* Settings Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>

          {/* Account Section */}
          <section style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
            padding: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Account</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Username</label>
                <input className="input-base" style={{ width: '100%', maxWidth: '400px' }} defaultValue="User" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Email</label>
                <input className="input-base" style={{ width: '100%', maxWidth: '400px' }} defaultValue="user@example.com" />
              </div>
              <div>
                <button className="btn-ghost" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>Change Password</button>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section style={{
            background: 'var(--color-surface)',
            border: '2px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: '6px 6px 0px rgba(0,0,0,0.3)',
            padding: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Appearance</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Theme</label>
                <select className="input-base" style={{ width: '100%', maxWidth: '400px', cursor: 'pointer' }}>
                  <option value="system">System Default</option>
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Default View</label>
                <select className="input-base" style={{ width: '100%', maxWidth: '400px', cursor: 'pointer' }}>
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                </select>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '2px solid var(--color-accent-red)',
            borderRadius: '8px',
            padding: '1.25rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-accent-red)', marginBottom: '1rem' }}>Danger Zone</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="btn-ghost" style={{
              color: 'var(--color-accent-red)',
              borderColor: 'var(--color-accent-red)',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem'
            }}>
              Delete Account
            </button>
          </section>

        </div>
      </div>
    </AppLayout>
  )
}

export default Settings
