import React, { useState } from 'react'
import { ALERTS, HAZARD_TYPES } from '../data/alerts.js'

const RISK_COLORS = { high: '#ef4444', med: '#f59e0b', low: '#22c55e' }

function AlertCard({ alert, visible }) {
  if (!visible) return null
  const hazard = HAZARD_TYPES[alert.type]
  const riskColor = RISK_COLORS[alert.risk]

  return (
    <div style={{
      background: 'var(--panel2)',
      border: '1px solid var(--border)',
      borderRadius: 9, padding: 11,
      display: 'flex', flexDirection: 'column', gap: 6,
      transition: 'border-color 0.2s', cursor: 'default',
      animation: 'fade-up 0.3s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green-dim)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '0.65rem', fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '2px 7px', borderRadius: 4, fontWeight: 700,
          background: `${hazard.color}22`, color: hazard.color,
        }}>
          {hazard.label}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: "'Space Mono', monospace" }}>
          {alert.time}
        </span>
      </div>
      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{alert.location}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{alert.detail}</div>
      <div style={{ height: 3, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, background: riskColor, width: `${alert.riskPct}%`, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

function SearchPanel() {
  const [query, setQuery]         = useState('')
  const [municipality, setMun]    = useState('')
  const [city, setCity]           = useState('')

  const inputStyle = {
    width: '100%', background: 'var(--panel2)',
    border: '1px solid var(--border)', borderRadius: 6,
    padding: '7px 10px', color: 'var(--text)',
    fontFamily: "'Sora', sans-serif", fontSize: '0.78rem', outline: 'none',
  }
  const labelStyle = {
    fontSize: '0.65rem', color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    fontFamily: "'Space Mono', monospace", marginBottom: 3,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'var(--panel2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 11px' }}>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>🔍</span>
        <input
          type="text" placeholder="Search location…" value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: "'Sora', sans-serif", fontSize: '0.78rem', flex: 1 }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={labelStyle}>Municipality</div>
        <input style={inputStyle} type="text" placeholder="e.g. Naga City" value={municipality} onChange={e => setMun(e.target.value)} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={labelStyle}>City / Province</div>
        <input style={inputStyle} type="text" placeholder="e.g. Camarines Sur" value={city} onChange={e => setCity(e.target.value)} />
      </div>
      <button style={{
        width: '100%', padding: 9, background: 'var(--green)', color: '#0a0f0d',
        fontFamily: "'Space Mono', monospace", fontSize: '0.78rem', fontWeight: 700,
        borderRadius: 7, border: 'none', cursor: 'pointer',
      }}>
        Search Area
      </button>
    </div>
  )
}

export default function RightPanel({ activeFilters }) {
  const [tab, setTab] = useState('alerts')

  const visibleAlerts = ALERTS.filter(a => activeFilters.includes(a.type))

  return (
    <div style={{
      width: 270, background: 'var(--panel)',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {['alerts', 'search'].map(t => (
          <div
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: 10,
              fontSize: '0.7rem', fontFamily: "'Space Mono', monospace",
              textTransform: 'uppercase', letterSpacing: '0.08em',
              textAlign: 'center', cursor: 'pointer',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
              background: tab === t ? 'var(--green-glow)' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            {t === 'alerts' ? `Alerts (${visibleAlerts.length})` : 'Search'}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: 12,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {tab === 'alerts' ? (
          visibleAlerts.length > 0
            ? visibleAlerts.map(a => <AlertCard key={a.id} alert={a} visible />)
            : (
              <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.75rem', marginTop: 40, fontFamily: "'Space Mono', monospace" }}>
                No alerts for selected filters
              </div>
            )
        ) : (
          <SearchPanel />
        )}
      </div>
    </div>
  )
}
