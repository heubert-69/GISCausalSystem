import React from 'react'
import Modal from './Modal.jsx'

export default function AboutModal({ activeModal, onClose }) {
  return (
    <Modal id="about" activeModal={activeModal} onClose={onClose} title="About ATLAS">
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.65 }}>
        <strong style={{ color: 'var(--accent)' }}>ATLAS</strong> is a web app designed to monitor
        and predict potential hazardous areas across the Philippines. The system alerts users to
        possible dangers that may occur in specific areas.
      </p>
      <br />
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.65 }}>
        With Atlas, users can track areas that have high-risk occurrences during natural disasters
        and see the probability of surviving within a certain region of their location.
      </p>
      <br />
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.65 }}>
        Data is sourced from PHIVOLCS, NDRRMC, and real-time sensor networks across all Philippine regions.
      </p>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--green)', color: 'var(--green)', borderRadius: 7, fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', cursor: 'pointer' }}>
          Documentation
        </button>
        <button style={{ flex: 1, padding: '8px', background: 'var(--green)', border: 'none', color: '#0a0f0d', borderRadius: 7, fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
          Contact Us
        </button>
      </div>
    </Modal>
  )
}
