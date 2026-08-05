import React from 'react'

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    zIndex: 200,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '28px 26px',
    width: 340,
    position: 'relative',
    animation: 'fade-up 0.25s ease',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 24, height: 24,
    borderRadius: '50%',
    background: 'var(--red)',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '0.75rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--accent)',
    marginBottom: 18,
    letterSpacing: '0.08em',
  },
}

export default function Modal({ id, activeModal, onClose, title, children }) {
  if (activeModal !== id) return null
  return (
    <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        {title && <div style={styles.title}>{title}</div>}
        {children}
      </div>
    </div>
  )
}

// Sub-components for reuse inside modals
export function FieldGroup({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Space Mono', monospace" }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export function FieldInput({ type = 'text', placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        background: 'var(--panel2)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '7px 10px',
        color: 'var(--text)',
        fontFamily: "'Sora', sans-serif",
        fontSize: '0.78rem',
        outline: 'none',
      }}
    />
  )
}

export function SolidBtn({ children, onClick, style: s }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '10px',
      background: 'var(--green)', color: '#0a0f0d',
      fontFamily: "'Space Mono', monospace", fontSize: '0.82rem',
      fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
      transition: 'background 0.2s',
      ...s,
    }}>
      {children}
    </button>
  )
}
