import React from 'react'

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: "'Space Mono', monospace", fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)' }}>
    <div style={{ width: 30, height: 30, border: '2px solid var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* crosshair lines */}
      <div style={{ position: 'absolute', width: 2, height: '100%', background: 'var(--accent)' }} />
      <div style={{ position: 'absolute', width: '100%', height: 2, background: 'var(--accent)' }} />
      <div style={{ width: 10, height: 10, border: '2px solid var(--accent)', borderRadius: '50%', background: 'var(--panel)', zIndex: 1 }} />
    </div>
    ATLAS
  </div>
)

const IconBtn = ({ icon, title, onClick }) => (
  <button
    title={title}
    onClick={onClick}
    style={{
      background: 'var(--panel2)', border: '1px solid var(--border)',
      color: 'var(--muted)', width: 32, height: 32,
      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
  >
    {icon}
  </button>
)

export default function Navbar({ onOpenModal }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 18px',
      background: 'var(--panel)',
      borderBottom: '1px solid var(--border)',
      zIndex: 100, flexShrink: 0,
    }}>
      <Logo />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onOpenModal('login')}
          style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.72rem',
            padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--green)', color: 'var(--green)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--green-glow)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Login
        </button>
        <IconBtn icon="⚙" title="Settings" onClick={() => onOpenModal('settings')} />
        <IconBtn icon="?" title="About"    onClick={() => onOpenModal('about')} />
        <IconBtn icon="👤" title="Profile" onClick={() => onOpenModal('profile')} />
      </div>
    </nav>
  )
}
