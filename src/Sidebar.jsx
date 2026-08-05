import React, { useState } from 'react'
import { FILTERS, VIEW_MODES } from '../data/alerts.js'

const DOT_COLORS = { eq: '#f59e0b', fl: '#3b82f6', ls: '#a78bfa' }

function FilterBtn({ item, active, onToggle }) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 7,
        border: `1px solid ${active ? 'var(--green-dim)' : 'var(--border)'}`,
        background: active ? 'var(--green-glow)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text)',
        fontFamily: "'Sora', sans-serif", fontSize: '0.78rem',
        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: DOT_COLORS[item.id], flexShrink: 0, boxShadow: active ? `0 0 6px ${DOT_COLORS[item.id]}` : 'none' }} />
      {item.label}
    </button>
  )
}

function ViewBtn({ item, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 7,
        border: `1px solid ${active ? 'var(--green-dim)' : 'var(--border)'}`,
        background: active ? 'var(--green-glow)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text)',
        fontFamily: "'Sora', sans-serif", fontSize: '0.78rem',
        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
      }}
    >
      <span style={{ fontSize: '0.8rem' }}>{item.icon}</span>
      {item.label}
    </button>
  )
}

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: '0.6rem', color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.12em',
    fontFamily: "'Space Mono', monospace", padding: '0 4px', marginBottom: 4,
  }}>
    {children}
  </div>
)

export default function Sidebar({ activeFilters, onToggleFilter }) {
  const [viewMode, setViewMode] = useState('myarea')

  return (
    <aside style={{
      width: 160, background: 'var(--panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '14px 10px', gap: 6, flexShrink: 0,
    }}>
      <SectionLabel>Hazard Layers</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {FILTERS.map(f => (
          <FilterBtn key={f.id} item={f} active={activeFilters.includes(f.id)} onToggle={onToggleFilter} />
        ))}
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

      <SectionLabel>View Mode</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {VIEW_MODES.map(v => (
          <ViewBtn key={v.id} item={v} active={viewMode === v.id} onSelect={setViewMode} />
        ))}
      </div>
    </aside>
  )
}
