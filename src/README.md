# ATLAS — Hazard Monitoring Philippines
### React + Vite Frontend

---

## Project Structure

```
atlas-react/
├── index.html                  # Entry HTML (Vite root)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Root component — layout + state
    ├── index.css               # Global styles, CSS variables, keyframes
    │
    ├── assets/
    │   └── ph.svg              # Philippines map (simplemaps)
    │
    ├── data/
    │   └── alerts.js           # All app data: alerts, markers, filters, settings
    │
    ├── hooks/
    │   ├── useModal.js         # Modal open/close + Escape key handler
    │   └── useMapPanZoom.js    # Pan, zoom, pinch-to-zoom for the map
    │
    └── components/
        ├── Navbar.jsx          # Top navigation bar
        ├── Sidebar.jsx         # Left filter panel (hazard types, view mode)
        ├── MapView.jsx         # Center map with markers + controls
        ├── RightPanel.jsx      # Alerts list + Search tab
        ├── StatusBar.jsx       # Bottom live status bar (real clock)
        ├── Modal.jsx           # Reusable modal wrapper + shared form elements
        ├── LoginModal.jsx      # Login form (email, password, Google, Facebook)
        ├── AboutModal.jsx      # App info
        ├── ProfileModal.jsx    # User profile editor
        └── SettingsModal.jsx   # Toggle settings (notifications, display, map)
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Build for Production

```bash
npm run build
# Output goes to /dist — deploy to any static host (Vercel, Netlify, GitHub Pages)
```

---

## Architecture Decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | React 18 | Component model fits the multi-panel UI perfectly |
| Build tool | Vite | Instant HMR, fast builds, zero config |
| Styling | Inline styles + CSS vars | No extra dependency, full design control, co-located with components |
| State | useState + prop drilling | App is small; no need for Redux/Zustand yet |
| Map | SVG img + CSS transform | Works offline, no tile server needed |
| Pan/Zoom | Custom hook (useMapPanZoom) | Mouse, wheel, touch, pinch all handled cleanly |
| Modals | useModal hook | Single source of truth for which modal is open |

---

## Next Steps (Backend Integration)

When you're ready to connect real data:

1. **Replace `src/data/alerts.js`** with API calls to PHIVOLCS / NDRRMC
2. **Add TanStack Query** (`npm i @tanstack/react-query`) for caching + polling
3. **Add React Router** (`npm i react-router-dom`) for `/dashboard`, `/login`, `/profile` pages
4. **Replace ph.svg markers** with React-Leaflet for full geo-accurate map tiles
5. **Add Zustand** (`npm i zustand`) if state gets complex (user auth, notifications)

---

## Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool
- **Space Mono** — Monospace display font (labels, codes)
- **Sora** — Body font (readable, modern)
