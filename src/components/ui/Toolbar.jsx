import { useState } from 'react'
import { downloadScreenshot } from '../../utils/screenshot'
import './Toolbar.css'

export default function Toolbar({ canvasRef }) {
  const [capturing, setCapturing] = useState(false)

  const handleScreenshot = () => {
    if (!canvasRef.current) return
    setCapturing(true)
    setTimeout(() => {
      downloadScreenshot(canvasRef.current)
      setCapturing(false)
    }, 50)
  }

  return (
    <header className="toolbar">
      <div className="toolbar-brand">Mannequin Model</div>
      <div className="toolbar-actions">
        <button
          className={`btn-capture ${capturing ? 'capturing' : ''}`}
          onClick={handleScreenshot}
          title="Save scene as PNG"
        >
          {capturing ? 'Capturing…' : '⬛ Snapshot'}
        </button>
      </div>
    </header>
  )
}
