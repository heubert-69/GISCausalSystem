import React, { useState } from 'react'
import Modal, { SolidBtn } from './Modal.jsx'
import { DEFAULT_SETTINGS } from '../data/alerts.js'

function Toggle({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: on ? 'var(--green-dim)' : 'var(--border)',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        width: 14, height: 14, borderRadius: '50%',
        background: 'white', top: 3,
        left: on ? 19 : 3,
        transition: 'left 0.2s',
      }} />
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: '0.78rem',
    }}>
      <span>{label}</span>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.65rem', color: 'var(--muted)',
      textTransform: 'uppercase', letterSpacing: '0.1em',
      fontFamily: "'Space Mono', monospace",
      margin: '14px 0 8px',
    }}>
      {children}
    </div>
  )
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'var(--panel2)', border: '1px solid var(--border)',
        borderRadius: 5, color: 'var(--text)',
        fontFamily: "'Sora', sans-serif", fontSize: '0.72rem',
        padding: '3px 7px', outline: 'none',
      }}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

export default function SettingsModal({ activeModal, onClose }) {
  const [s, setS] = useState(DEFAULT_SETTINGS)
  const toggle = key => setS(prev => ({ ...prev, [key]: !prev[key] }))
  const set    = (key, val) => setS(prev => ({ ...prev, [key]: val }))

  return (
    <Modal id="settings" activeModal={activeModal} onClose={onClose} title="Settings">
      <SectionLabel>Notifications</SectionLabel>
      <Row label="Push alerts">  <Toggle on={s.pushAlerts}  onToggle={() => toggle('pushAlerts')} /></Row>
      <Row label="Email digest"> <Toggle on={s.emailDigest} onToggle={() => toggle('emailDigest')} /></Row>

      <SectionLabel>Display</SectionLabel>
      <Row label="Dark Mode">
        <Toggle on={s.darkMode} onToggle={() => toggle('darkMode')} />
      </Row>
      <Row label="Language">
        <SelectInput value={s.language} onChange={v => set('language', v)} options={['English', 'Filipino']} />
      </Row>
      <Row label="Units">
        <SelectInput value={s.units} onChange={v => set('units', v)} options={['Metric', 'Imperial']} />
      </Row>

      <SectionLabel>Map</SectionLabel>
      <Row label="Night Mode">
        <Toggle on={s.nightMap} onToggle={() => toggle('nightMap')} />
      </Row>
      <Row label="Opacity">
        <input
          type="range" min="10" max="100" value={s.mapOpacity}
          onChange={e => set('mapOpacity', Number(e.target.value))}
          style={{ width: 90, accentColor: 'var(--green)' }}
        />
      </Row>

      <SolidBtn style={{ marginTop: 16 }}>Save Settings</SolidBtn>
    </Modal>
  )
}
