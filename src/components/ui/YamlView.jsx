import { useState } from 'react'
import useMannequinStore from '../../store/useMannequinStore'
import { JOINT_DEFS, JOINT_GROUPS } from '../../constants/joints'
import './YamlView.css'

function buildYaml(rotations) {
  const lines = []
  lines.push('# x = pitch (fwd/back)  y = yaw (twist)  z = roll (side)')
  lines.push('')

  for (const group of JOINT_GROUPS) {
    lines.push(`${group.label.toLowerCase().replace(/ /g, '_')}:`)
    for (const id of group.ids) {
      const [x, y, z] = rotations[id].map(v => Math.round(v * 10) / 10)
      const label = JOINT_DEFS[id].label
      const nonZero = x !== 0 || y !== 0 || z !== 0
      const flag = nonZero ? '  ← modified' : ''
      lines.push(`  ${id}: [${x}, ${y}, ${z}]  # ${label}${flag}`)
    }
    lines.push('')
  }

  return lines.join('\n').trimEnd()
}

export default function YamlView() {
  const rotations = useMannequinStore(s => s.rotations)
  const [copied, setCopied] = useState(false)

  const yaml = buildYaml(rotations)

  const handleCopy = () => {
    navigator.clipboard.writeText(yaml).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="yaml-view">
      <div className="yaml-toolbar">
        <span className="yaml-info">
          {Object.values(rotations).filter(r => r[0] !== 0 || r[1] !== 0 || r[2] !== 0).length} joints modified
        </span>
        <button className="yaml-copy-btn" onClick={handleCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="yaml-pre">{yaml}</pre>
    </div>
  )
}
