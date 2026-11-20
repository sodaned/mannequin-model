import { useState } from 'react'
import useMannequinStore from '../../store/useMannequinStore'
import { JOINT_DEFS, JOINT_GROUPS } from '../../constants/joints'
import PosePrompt from './PosePrompt'
import YamlView from './YamlView'
import './JointPanel.css'

const AXIS_LABELS = { x: 'Pitch (X)', y: 'Yaw (Y)', z: 'Roll (Z)' }

function AxisSlider({ jointId, axis }) {
  const value = useMannequinStore(s => s.rotations[jointId][['x','y','z'].indexOf(axis)])
  const setRotation = useMannequinStore(s => s.setRotation)
  const [min, max] = JOINT_DEFS[jointId].axes[axis]

  return (
    <div className="axis-row">
      <span className="axis-label">{AXIS_LABELS[axis]}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={e => setRotation(jointId, axis, parseFloat(e.target.value))}
        className="axis-slider"
      />
      <span className="axis-value">{Math.round(value)}°</span>
    </div>
  )
}

function JointDetail() {
  const selectedJoint = useMannequinStore(s => s.selectedJoint)
  const setRotation = useMannequinStore(s => s.setRotation)

  if (!selectedJoint) {
    return (
      <div className="joint-hint">
        Click a body part in the scene to select a joint and adjust its rotation.
      </div>
    )
  }

  const def = JOINT_DEFS[selectedJoint]

  const resetJoint = () => {
    setRotation(selectedJoint, 'x', 0)
    setRotation(selectedJoint, 'y', 0)
    setRotation(selectedJoint, 'z', 0)
  }

  return (
    <div className="joint-detail">
      <div className="joint-detail-header">
        <span className="joint-detail-name">{def.label}</span>
        {def.extensionPoint && <span className="extension-badge">extensible</span>}
        <button className="btn-reset-joint" onClick={resetJoint}>Reset</button>
      </div>
      {['x', 'y', 'z'].map(axis => (
        <AxisSlider key={axis} jointId={selectedJoint} axis={axis} />
      ))}
    </div>
  )
}

function JointGroupSection({ group }) {
  const [open, setOpen] = useState(true)
  const selectedJoint = useMannequinStore(s => s.selectedJoint)
  const setSelectedJoint = useMannequinStore(s => s.setSelectedJoint)

  return (
    <div className="group-section">
      <button className="group-header" onClick={() => setOpen(o => !o)}>
        <span className="group-chevron">{open ? '▾' : '▸'}</span>
        {group.label}
      </button>
      {open && (
        <div className="group-joints">
          {group.ids.map(id => (
            <button
              key={id}
              className={`joint-chip ${selectedJoint === id ? 'selected' : ''}`}
              onClick={() => setSelectedJoint(selectedJoint === id ? null : id)}
            >
              {JOINT_DEFS[id].label}
              {JOINT_DEFS[id].extensionPoint && <span className="dot" title="Extension point" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PoseLibrary() {
  const [open, setOpen] = useState(false)
  const [poseName, setPoseName] = useState('')
  const { savedPoses, savePose, loadPose, deletePose } = useMannequinStore()

  return (
    <div className="group-section">
      <button className="group-header" onClick={() => setOpen(o => !o)}>
        <span className="group-chevron">{open ? '▾' : '▸'}</span>
        Poses ({savedPoses.length})
      </button>
      {open && (
        <div className="pose-library">
          <div className="pose-save-row">
            <input
              className="pose-name-input"
              placeholder="Pose name…"
              value={poseName}
              onChange={e => setPoseName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { savePose(poseName); setPoseName('') } }}
            />
            <button className="btn-save" onClick={() => { savePose(poseName); setPoseName('') }}>Save</button>
          </div>
          {savedPoses.map((p, i) => (
            <div key={i} className="pose-row">
              <button className="pose-load-btn" onClick={() => loadPose(i)}>{p.name}</button>
              <button className="pose-delete-btn" onClick={() => deletePose(i)}>✕</button>
            </div>
          ))}
          {savedPoses.length === 0 && <div className="pose-empty">No saved poses yet.</div>}
        </div>
      )}
    </div>
  )
}

export default function JointPanel() {
  const resetPose = useMannequinStore(s => s.resetPose)
  const [tab, setTab] = useState('controls') // 'controls' | 'yaml'

  return (
    <aside className="joint-panel">
      <div className="panel-header">
        <button
          className={`panel-tab ${tab === 'controls' ? 'active' : ''}`}
          onClick={() => setTab('controls')}
        >
          Controls
        </button>
        <button
          className={`panel-tab ${tab === 'yaml' ? 'active' : ''}`}
          onClick={() => setTab('yaml')}
        >
          YAML
        </button>
      </div>

      {tab === 'yaml' ? (
        <YamlView />
      ) : (
        <>
          <PosePrompt />

          <JointDetail />

          <div className="panel-divider" />

          <div className="panel-scroll">
            {JOINT_GROUPS.map(g => (
              <JointGroupSection key={g.label} group={g} />
            ))}
            <PoseLibrary />
          </div>

          <div className="panel-footer">
            <button className="btn-reset-all" onClick={resetPose}>Reset All Joints</button>
          </div>
        </>
      )}
    </aside>
  )
}
