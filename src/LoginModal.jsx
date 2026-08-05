import React, { useState } from 'react'
import Modal, { FieldGroup, FieldInput, SolidBtn } from './Modal.jsx'

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const socialBtn = (extra = {}) => ({
  width: '100%',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '9px',
  background: 'var(--panel2)',
  border: '1px solid var(--border)',
  borderRadius: 7,
  color: 'var(--text)',
  fontFamily: "'Sora', sans-serif", fontSize: '0.78rem',
  cursor: 'pointer', transition: 'all 0.2s',
  marginBottom: 8,
  ...extra,
})

export default function LoginModal({ activeModal, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Modal id="login" activeModal={activeModal} onClose={onClose} title="Login">
      <FieldGroup label="Email Address">
        <FieldInput type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
      </FieldGroup>
      <FieldGroup label="Password">
        <FieldInput type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
      </FieldGroup>

      <SolidBtn>Continue</SolidBtn>

      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center', margin: '10px 0' }}>
        <a href="#" style={{ color: 'var(--green)', textDecoration: 'none' }}>Forgot Password?</a>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--muted)', margin: '10px 0', position: 'relative' }}>
        <span style={{ background: 'var(--panel)', padding: '0 10px', position: 'relative', zIndex: 1 }}>or</span>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)' }} />
      </div>

      <button style={socialBtn()}>
        <GoogleIcon /> Log in with Google
      </button>
      <button style={socialBtn({ background: '#1877f2', borderColor: '#1877f2', color: 'white' })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Log in with Facebook
      </button>

      <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'center', marginTop: 10 }}>
        No account? <a href="#" style={{ color: 'var(--green)', textDecoration: 'none' }}>Sign up</a>
      </div>
    </Modal>
  )
}
