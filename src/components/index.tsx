import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return <h1>Hello vte.cx!!</h1>
}
createRoot(document.getElementById('content')!).render(<App />)
