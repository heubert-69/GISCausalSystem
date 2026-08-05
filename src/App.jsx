import React, { useState, useEffect } from 'react'
import Navbar        from './components/Navbar.jsx'
import Sidebar       from './components/Sidebar.jsx'
import MapView       from './components/MapView.jsx'
import RightPanel    from './components/RightPanel.jsx'
import StatusBar     from './components/StatusBar.jsx'
import LoginModal    from './components/LoginModal.jsx'
import AboutModal    from './components/AboutModal.jsx'
import ProfileModal  from './components/ProfileModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import { useModal }  from './hooks/useModal.js'

// All hazard types active by default
const ALL_FILTERS = ['eq', 'fl', 'ls']

export default function App() {
  const { activeModal, open, close } = useModal()
  const [activeFilters, setActiveFilters] = useState(ALL_FILTERS)

  // Show login on mount
  useEffect(() => {
    const timer = setTimeout(() => open('login'), 400)
    return () => clearTimeout(timer)
  }, [])

  const toggleFilter = id =>
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )

  const modalProps = { activeModal, onClose: close }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Navbar onOpenModal={open} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeFilters={activeFilters} onToggleFilter={toggleFilter} />
        <MapView  activeFilters={activeFilters} />
        <RightPanel activeFilters={activeFilters} />
      </div>

      <StatusBar />

      {/* Modals */}
      <LoginModal    {...modalProps} />
      <AboutModal    {...modalProps} />
      <ProfileModal  {...modalProps} />
      <SettingsModal {...modalProps} />
    </div>
  )
}
