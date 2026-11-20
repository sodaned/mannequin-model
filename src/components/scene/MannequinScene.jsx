import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Suspense } from 'react'
import Mannequin from './Mannequin'
import useMannequinStore from '../../store/useMannequinStore'

export default function MannequinScene({ onCanvasReady }) {
  const setSelectedJoint = useMannequinStore(s => s.setSelectedJoint)

  return (
    <Canvas
      camera={{ position: [0, 1.4, 3.2], fov: 45 }}
      shadows
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      onCreated={({ gl }) => onCanvasReady?.(gl.domElement)}
      onPointerMissed={() => setSelectedJoint(null)}
    >
      <color attach="background" args={['#18181f']} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-3, 3, -2]} intensity={0.3} />

      <Suspense fallback={null}>
        <Mannequin />
      </Suspense>

      {/* Shadow-receiving ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.25} />
      </mesh>

      <Grid
        position={[0, 0.001, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.4}
        cellColor="#38384a"
        sectionSize={2}
        sectionThickness={0.8}
        sectionColor="#505068"
        fadeDistance={14}
        fadeStrength={1.5}
        infiniteGrid
      />

      <OrbitControls makeDefault target={[0, 1.0, 0]} minDistance={0.8} maxDistance={8} />
    </Canvas>
  )
}
