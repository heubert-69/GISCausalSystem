import React, { useState, useEffect } from 'react'

export default function StatusBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '5px 18px',
      background: 'var(--panel)',
      borderTop: '1px solid var(--border)',
      fontSize: '0.62rem', color: 'var(--muted)',
      fontFamily: "'Space Mono', monospace",
      flexShrink: 0,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--green)', display: 'inline-block',
          animation: 'status-blink 2s infinite',
        }} />
        Live
      </span>
      <span>
        {time.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span style={{ marginLeft: 'auto' }}>
        © 2026 ATLAS · Philippines Hazard Monitoring
      </span>
    </div>
  )
}
