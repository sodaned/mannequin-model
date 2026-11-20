import { useState } from 'react'
import { generatePose } from '../../services/poseGeneration'
import useMannequinStore from '../../store/useMannequinStore'
import './PosePrompt.css'

const EXAMPLES = [
  'Arms raised overhead',
  'Walking, arms swinging',
  'Sitting, hands on knees',
  'Looking over left shoulder',
  'Crouching, ready to jump',
  'One hand on hip, slight lean',
]

export default function PosePrompt() {
  const [prompt, setPrompt] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [interpretation, setInterpretation] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const setPose = useMannequinStore(s => s.setPose)

  const handleGenerate = async () => {
    const text = prompt.trim()
    if (!text || status === 'loading') return
    setStatus('loading')
    setInterpretation('')
    setErrorMsg('')
    try {
      const result = await generatePose(text)
      setPose(result.rotations)
      setInterpretation(result.interpretation)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
  }

  return (
    <div className="pose-prompt">
      <div className="pose-prompt-header">
        <span className="pose-prompt-label">AI Pose</span>
        <span className="pose-prompt-model">claude-opus-4-7</span>
      </div>

      <textarea
        className="pose-prompt-textarea"
        placeholder={'Describe a pose…\ne.g. "arms raised overhead, slight lean back"'}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        onKeyDown={handleKey}
        rows={3}
        disabled={status === 'loading'}
      />

      <div className="pose-prompt-footer">
        <span className="pose-prompt-hint">⌘↵ to generate</span>
        <button
          className={`btn-generate ${status === 'loading' ? 'loading' : ''}`}
          onClick={handleGenerate}
          disabled={status === 'loading' || !prompt.trim()}
        >
          {status === 'loading' ? '…' : '✦ Generate'}
        </button>
      </div>

      {status === 'success' && interpretation && (
        <div className="pose-result">
          <span className="pose-result-icon">✓</span>
          <span className="pose-result-text">{interpretation}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="pose-error">{errorMsg}</div>
      )}

      <div className="pose-examples">
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            className="pose-example-chip"
            onClick={() => { setPrompt(ex); setStatus('idle') }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
