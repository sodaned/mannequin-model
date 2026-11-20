import { useRef } from 'react'
import useMannequinStore from '../../store/useMannequinStore'

const DEG = Math.PI / 180
const WOOD = '#C4A882'
const JOINT_COLOR = '#8B6040'
const SELECTED_EMISSIVE = '#E8940A'

function woodMat(selected) {
  return {
    color: WOOD,
    roughness: 0.85,
    metalness: 0.0,
    emissive: selected ? SELECTED_EMISSIVE : '#000000',
    emissiveIntensity: selected ? 0.45 : 0,
  }
}

// Small ball joint indicator placed at pivot origin
function BallJoint({ r = 0.028 }) {
  return (
    <mesh>
      <sphereGeometry args={[r, 12, 8]} />
      <meshStandardMaterial color={JOINT_COLOR} roughness={0.6} />
    </mesh>
  )
}

export default function Mannequin() {
  const { rotations, selectedJoint, setSelectedJoint } = useMannequinStore()

  const r = (id) => rotations[id].map(v => v * DEG)
  const sel = (id) => selectedJoint === id

  const click = (id) => (e) => {
    e.stopPropagation()
    setSelectedJoint(sel(id) ? null : id)
  }

  return (
    // Root: hips/pelvis, seated at world y=0.85
    <group position={[0, 0.85, 0]} rotation={r('hips')}>
      {/* ── PELVIS ── */}
      <mesh onClick={click('hips')} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.16, 20]} />
        <meshStandardMaterial {...woodMat(sel('hips'))} />
      </mesh>

      {/* ── SPINE ── (pivot at top of pelvis) */}
      <group position={[0, 0.13, 0]} rotation={r('spine')}>
        <BallJoint />
        <mesh position={[0, 0.12, 0]} onClick={click('spine')} castShadow>
          <cylinderGeometry args={[0.085, 0.10, 0.24, 20]} />
          <meshStandardMaterial {...woodMat(sel('spine'))} />
        </mesh>

        {/* ── CHEST ── (pivot at top of spine) */}
        <group position={[0, 0.24, 0]} rotation={r('chest')}>
          <BallJoint />
          <mesh position={[0, 0.11, 0]} onClick={click('chest')} castShadow>
            <cylinderGeometry args={[0.125, 0.085, 0.22, 20]} />
            <meshStandardMaterial {...woodMat(sel('chest'))} />
          </mesh>

          {/* ── NECK ── */}
          <group position={[0, 0.22, 0]} rotation={r('neck')}>
            <BallJoint r={0.022} />
            <mesh position={[0, 0.05, 0]} onClick={click('neck')} castShadow>
              <cylinderGeometry args={[0.038, 0.042, 0.10, 16]} />
              <meshStandardMaterial {...woodMat(sel('neck'))} />
            </mesh>

            {/* ── HEAD ── */}
            <group position={[0, 0.10, 0]} rotation={r('head')}>
              <BallJoint r={0.022} />
              <mesh position={[0, 0.12, 0]} onClick={click('head')} castShadow>
                <sphereGeometry args={[0.12, 20, 16]} />
                <meshStandardMaterial {...woodMat(sel('head'))} />
              </mesh>
              {/* ── FACE FEATURES — all positions relative to head group,
                   sphere center is at [0, 0.12, 0], radius 0.12, front = +Z ── */}
              {/* Left eye */}
              <mesh position={[-0.042, 0.155, 0.107]} castShadow>
                <sphereGeometry args={[0.013, 10, 8]} />
                <meshStandardMaterial color="#2a1a0a" roughness={0.4} />
              </mesh>
              {/* Right eye */}
              <mesh position={[0.042, 0.155, 0.107]} castShadow>
                <sphereGeometry args={[0.013, 10, 8]} />
                <meshStandardMaterial color="#2a1a0a" roughness={0.4} />
              </mesh>
              {/* Nose — slight protrusion at mid-face */}
              <mesh position={[0, 0.108, 0.124]} castShadow>
                <sphereGeometry args={[0.016, 10, 8]} />
                <meshStandardMaterial color="#b07848" roughness={0.9} />
              </mesh>
            </group>
          </group>

          {/* ── LEFT SHOULDER ── (pivot on left side of chest top) */}
          <group position={[-0.165, 0.16, 0]} rotation={r('leftShoulder')}>
            <BallJoint r={0.032} />
            {/* ── LEFT UPPER ARM ── */}
            <group rotation={r('leftUpperArm')}>
              <mesh position={[0, -0.13, 0]} onClick={click('leftUpperArm')} castShadow>
                <cylinderGeometry args={[0.036, 0.040, 0.26, 16]} />
                <meshStandardMaterial {...woodMat(sel('leftUpperArm'))} />
              </mesh>

              {/* ── LEFT FOREARM ── (elbow, pivot at bottom of upper arm) */}
              <group position={[0, -0.26, 0]} rotation={r('leftForearm')}>
                <BallJoint r={0.026} />
                <mesh position={[0, -0.11, 0]} onClick={click('leftForearm')} castShadow>
                  <cylinderGeometry args={[0.030, 0.034, 0.22, 16]} />
                  <meshStandardMaterial {...woodMat(sel('leftForearm'))} />
                </mesh>

                {/* ── LEFT HAND ── (wrist, extensionPoint for future fingers) */}
                <group position={[0, -0.22, 0]} rotation={r('leftHand')}>
                  <BallJoint r={0.022} />
                  <mesh position={[0, -0.055, 0]} onClick={click('leftHand')} castShadow>
                    <boxGeometry args={[0.075, 0.11, 0.022]} />
                    <meshStandardMaterial {...woodMat(sel('leftHand'))} />
                  </mesh>
                  {/* FUTURE: finger joints parented here */}
                </group>
              </group>
            </group>
          </group>

          {/* ── RIGHT SHOULDER ── */}
          <group position={[0.165, 0.16, 0]} rotation={r('rightShoulder')}>
            <BallJoint r={0.032} />
            <group rotation={r('rightUpperArm')}>
              <mesh position={[0, -0.13, 0]} onClick={click('rightUpperArm')} castShadow>
                <cylinderGeometry args={[0.036, 0.040, 0.26, 16]} />
                <meshStandardMaterial {...woodMat(sel('rightUpperArm'))} />
              </mesh>

              <group position={[0, -0.26, 0]} rotation={r('rightForearm')}>
                <BallJoint r={0.026} />
                <mesh position={[0, -0.11, 0]} onClick={click('rightForearm')} castShadow>
                  <cylinderGeometry args={[0.030, 0.034, 0.22, 16]} />
                  <meshStandardMaterial {...woodMat(sel('rightForearm'))} />
                </mesh>

                {/* RIGHT HAND — extensionPoint for fingers */}
                <group position={[0, -0.22, 0]} rotation={r('rightHand')}>
                  <BallJoint r={0.022} />
                  <mesh position={[0, -0.055, 0]} onClick={click('rightHand')} castShadow>
                    <boxGeometry args={[0.075, 0.11, 0.022]} />
                    <meshStandardMaterial {...woodMat(sel('rightHand'))} />
                  </mesh>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* ── LEFT HIP ── (pivot on lower-left of pelvis) */}
      <group position={[-0.085, -0.09, 0]} rotation={r('leftHip')}>
        <BallJoint r={0.030} />
        <mesh position={[0, -0.19, 0]} onClick={click('leftHip')} castShadow>
          <cylinderGeometry args={[0.050, 0.056, 0.38, 16]} />
          <meshStandardMaterial {...woodMat(sel('leftHip'))} />
        </mesh>

        {/* ── LEFT SHIN (KNEE) ── */}
        <group position={[0, -0.38, 0]} rotation={r('leftShin')}>
          <BallJoint r={0.026} />
          <mesh position={[0, -0.18, 0]} onClick={click('leftShin')} castShadow>
            <cylinderGeometry args={[0.035, 0.046, 0.36, 16]} />
            <meshStandardMaterial {...woodMat(sel('leftShin'))} />
          </mesh>

          {/* ── LEFT FOOT (ANKLE) ── */}
          <group position={[0, -0.36, 0]} rotation={r('leftFoot')}>
            <BallJoint r={0.022} />
            <mesh position={[0.01, -0.022, 0.045]} onClick={click('leftFoot')} castShadow>
              <boxGeometry args={[0.055, 0.044, 0.13]} />
              <meshStandardMaterial {...woodMat(sel('leftFoot'))} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── RIGHT HIP ── */}
      <group position={[0.085, -0.09, 0]} rotation={r('rightHip')}>
        <BallJoint r={0.030} />
        <mesh position={[0, -0.19, 0]} onClick={click('rightHip')} castShadow>
          <cylinderGeometry args={[0.050, 0.056, 0.38, 16]} />
          <meshStandardMaterial {...woodMat(sel('rightHip'))} />
        </mesh>

        <group position={[0, -0.38, 0]} rotation={r('rightShin')}>
          <BallJoint r={0.026} />
          <mesh position={[0, -0.18, 0]} onClick={click('rightShin')} castShadow>
            <cylinderGeometry args={[0.035, 0.046, 0.36, 16]} />
            <meshStandardMaterial {...woodMat(sel('rightShin'))} />
          </mesh>

          <group position={[0, -0.36, 0]} rotation={r('rightFoot')}>
            <BallJoint r={0.022} />
            <mesh position={[0.01, -0.022, 0.045]} onClick={click('rightFoot')} castShadow>
              <boxGeometry args={[0.055, 0.044, 0.13]} />
              <meshStandardMaterial {...woodMat(sel('rightFoot'))} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}
