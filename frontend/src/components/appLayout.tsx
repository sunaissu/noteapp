import React from 'react'
import Sidebar from './sidebar'

interface Props {
  children: React.ReactNode
}

const AppLayout: React.FC<Props> = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '8px', background: 'var(--color-bg)' }}>
        <div style={{ margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default AppLayout
