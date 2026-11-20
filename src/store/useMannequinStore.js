import { create } from 'zustand'
import { INITIAL_ROTATIONS } from '../constants/joints'

const AXES = ['x', 'y', 'z']

const useMannequinStore = create((set, get) => ({
  rotations: { ...INITIAL_ROTATIONS },
  selectedJoint: null,
  savedPoses: [],

  setRotation: (joint, axis, valueDeg) =>
    set(state => ({
      rotations: {
        ...state.rotations,
        [joint]: state.rotations[joint].map(
          (v, i) => i === AXES.indexOf(axis) ? valueDeg : v
        ),
      },
    })),

  setSelectedJoint: (joint) => set({ selectedJoint: joint }),

  setPose: (rotations) => set({ rotations: JSON.parse(JSON.stringify(rotations)) }),

  resetPose: () => set({ rotations: { ...INITIAL_ROTATIONS } }),

  savePose: (name) => {
    const { rotations, savedPoses } = get()
    const trimmed = name.trim() || `Pose ${savedPoses.length + 1}`
    set({ savedPoses: [...savedPoses, { name: trimmed, rotations: JSON.parse(JSON.stringify(rotations)) }] })
  },

  loadPose: (index) => {
    const { savedPoses } = get()
    if (savedPoses[index]) {
      set({ rotations: JSON.parse(JSON.stringify(savedPoses[index].rotations)) })
    }
  },

  deletePose: (index) => {
    const { savedPoses } = get()
    set({ savedPoses: savedPoses.filter((_, i) => i !== index) })
  },
}))

export default useMannequinStore
