import { useRef, useCallback } from 'react'
import MannequinScene from './components/scene/MannequinScene'
import JointPanel from './components/ui/JointPanel'
import Toolbar from './components/ui/Toolbar'
import './App.css'

export default function App() {
  const canvasRef = useRef(null)

  const handleCanvasReady = useCallback((canvas) => {
    canvasRef.current = canvas
  }, [])

  return (
    <div className="app">
      <Toolbar canvasRef={canvasRef} />
      <div className="app-body">
        <JointPanel />
        <div className="canvas-wrapper">
          <MannequinScene onCanvasReady={handleCanvasReady} />
        </div>
      </div>
    </div>
  )
}
