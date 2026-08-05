import React, { useState } from 'react'
import Modal, { FieldGroup, FieldInput, SolidBtn } from './Modal.jsx'

export default function ProfileModal({ activeModal, onClose }) {
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')

  return (
    <Modal id="profile" activeModal={activeModal} onClose={onClose} title="Profile">
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'var(--panel2)', border: '2px solid var(--green-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem', marginBottom: 14,
      }}>
        👤
      </div>
      <FieldGroup label="Name">
        <FieldInput placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
      </FieldGroup>
      <FieldGroup label="Email Address">
        <FieldInput type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      </FieldGroup>
      <SolidBtn style={{ marginTop: 6 }}>Save Changes</SolidBtn>
    </Modal>
  )
}
