// Joint constraint axes in degrees [min, max].
// extensionPoint marks joints where sub-joints can be added in future iterations
// (e.g. fingers parented to leftHand/rightHand).
export const JOINT_DEFS = {
  hips:          { label: 'Hips',         axes: { x: [-45,  45], y: [-180, 180], z: [-35,  35] } },
  spine:         { label: 'Spine',        axes: { x: [-30,  30], y: [-25,   25], z: [-20,  20] } },
  chest:         { label: 'Chest',        axes: { x: [-20,  20], y: [-20,   20], z: [-15,  15] } },
  neck:          { label: 'Neck',         axes: { x: [-45,  45], y: [-60,   60], z: [-20,  20] } },
  head:          { label: 'Head',         axes: { x: [-45,  45], y: [-90,   90], z: [-30,  30] } },

  leftShoulder:  { label: 'L Shoulder',   axes: { x: [-180, 60], y: [-30,   30], z: [-180, 90] } },
  leftUpperArm:  { label: 'L Upper Arm',  axes: { x: [-90,  90], y: [-90,   90], z: [-90,  90] } },
  leftForearm:   { label: 'L Forearm',    axes: { x: [-150,  0], y: [-90,    0], z: [-5,    5] } },
  leftHand:      { label: 'L Hand',       axes: { x: [-80,  80], y: [-20,   20], z: [-30,  30] }, extensionPoint: true },

  rightShoulder: { label: 'R Shoulder',   axes: { x: [-180, 60], y: [-30,   30], z: [-90, 180] } },
  rightUpperArm: { label: 'R Upper Arm',  axes: { x: [-90,  90], y: [-90,   90], z: [-90,  90] } },
  rightForearm:  { label: 'R Forearm',    axes: { x: [-150,  0], y: [0,     90], z: [-5,    5] } },
  rightHand:     { label: 'R Hand',       axes: { x: [-80,  80], y: [-20,   20], z: [-30,  30] }, extensionPoint: true },

  leftHip:       { label: 'L Hip',        axes: { x: [-120, 30], y: [-45,   45], z: [-45,  45] } },
  leftShin:      { label: 'L Knee',       axes: { x: [0,   140], y: [-10,   10], z: [-5,    5] } },
  leftFoot:      { label: 'L Ankle',      axes: { x: [-50,  30], y: [-30,   30], z: [-20,  20] } },

  rightHip:      { label: 'R Hip',        axes: { x: [-120, 30], y: [-45,   45], z: [-45,  45] } },
  rightShin:     { label: 'R Knee',       axes: { x: [0,   140], y: [-10,   10], z: [-5,    5] } },
  rightFoot:     { label: 'R Ankle',      axes: { x: [-50,  30], y: [-30,   30], z: [-20,  20] } },
}

export const JOINT_GROUPS = [
  { label: 'Torso',     ids: ['hips', 'spine', 'chest'] },
  { label: 'Head',      ids: ['neck', 'head'] },
  { label: 'Left Arm',  ids: ['leftShoulder', 'leftUpperArm', 'leftForearm', 'leftHand'] },
  { label: 'Right Arm', ids: ['rightShoulder', 'rightUpperArm', 'rightForearm', 'rightHand'] },
  { label: 'Left Leg',  ids: ['leftHip', 'leftShin', 'leftFoot'] },
  { label: 'Right Leg', ids: ['rightHip', 'rightShin', 'rightFoot'] },
]

export const INITIAL_ROTATIONS = Object.fromEntries(
  Object.keys(JOINT_DEFS).map(k => [k, [0, 0, 0]])
)
