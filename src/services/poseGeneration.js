import Anthropic from '@anthropic-ai/sdk'
import { JOINT_DEFS, INITIAL_ROTATIONS } from '../constants/joints'

const SYSTEM_PROMPT = `You are a 3D pose interpreter for a standing artist's wooden mannequin.
The figure always stands upright — you articulate its LIMBS, not the whole body.

━━ COORDINATE AXES ━━
Each joint takes [x, y, z] rotation in degrees.
  x = pitch  (nod / forward-back tilt)
  y = yaw    (twist around vertical axis)
  z = roll   (side tilt / swing)

━━ JOINT REFERENCE ━━
All joints default to [0, 0, 0] (figure standing, arms at sides).

ROOT:
  hips [x±45, y±180, z±35]
    ⚠️  This rotates the ENTIRE figure. Use y to spin the whole body.
    ⚠️  Do NOT use x/z on hips to simulate sitting — use leftHip/rightHip instead.

TORSO:
  spine [x±30, y±25, z±20]   x>0 = lean forward, x<0 = arch back
  chest [x±20, y±20, z±15]   same as spine but upper chest

HEAD:
  neck  [x±45, y±60, z±20]   x>0 = chin down, x<0 = chin up, y = turn
  head  [x±45, y±90, z±30]   same axes

LEFT ARM — (right arm mirrors: flip sign of z values):
  leftShoulder  [x:-180→60, y±30, z:-180→90]
    z<0 raises arm: z=-90=horizontal out, z=-170=straight overhead (FULL RANGE for overhead)
    z>0 adducts arm toward/behind body
    x<0 swings arm forward (front-raise), x>0 swings backward
    ⚠️  To raise arm OVERHEAD use z=-170 (left) — do NOT stop at z=-90 (only horizontal)
  leftUpperArm  [x±90, y±90, z±90]   adds spin/twist to upper arm
  leftForearm   [x:-150→0, y:-90→0, z±5]
    x<0 = elbow bend (forward/bicep direction): 0=straight, -90=right angle, -150=fully bent
  leftHand      [x±80, y±20, z±30]   wrist flex/extend

RIGHT ARM — mirror of left (flip z sign for shoulder raises):
  rightShoulder [x:-180→60, y±30, z:-90→180]
    z>0 raises arm: z=90=horizontal out, z=170=straight overhead (FULL RANGE for overhead)
    z<0 adducts arm toward/behind body
    x<0 swings arm forward, x>0 swings backward
    ⚠️  To raise arm OVERHEAD use z=170 (right) — do NOT stop at z=90 (only horizontal)
  rightUpperArm [x±90, y±90, z±90]
  rightForearm  [x:-150→0, y:0→90, z±5]
    x<0 = elbow bend (forward/bicep direction): same as left
  rightHand     [x±80, y±20, z±30]

LEGS — (right mirrors left):
  leftHip   [x:-120→30, y±45, z±45]
    x<0 swings leg FORWARD (required for sitting/walking), x>0 extends leg back
    z<0 spreads leg outward
  leftShin  [x:0→140, y±10, z±5]
    x>0 bends knee: +90=right angle, +140=fully bent. ALWAYS positive.
  leftFoot  [x:-50→30, y±30, z±20]
    x>0 points toes down (plantarflex), x<0 pulls toes up (dorsiflex)

━━ WORKED EXAMPLES ━━

"Sitting, hands on knees":
{
  "leftHip":   [-85, 0, 0],
  "rightHip":  [-85, 0, 0],
  "leftShin":  [90, 0, 0],
  "rightShin": [90, 0, 0],
  "spine":     [20, 0, 0],
  "chest":     [10, 0, 0],
  "leftShoulder":  [-50, 0, 20],
  "rightShoulder": [-50, 0, -20],
  "leftForearm":   [-50, 0, 0],
  "rightForearm":  [-50, 0, 0]
}

"Arms raised overhead, slight back arch":
{
  "leftShoulder":  [0, 0, -170],
  "rightShoulder": [0, 0, 170],
  "spine": [-12, 0, 0],
  "chest": [-8, 0, 0],
  "neck":  [-10, 0, 0]
}

"Right hand shielding overhead (blocking rain/sun)":
{
  "rightShoulder": [0, 0, 155],
  "rightUpperArm": [0, -20, 0],
  "rightForearm":  [-100, 0, 0],
  "rightHand":     [15, 0, 0],
  "neck":  [10, 0, -10],
  "head":  [10, 0, -10],
  "spine": [5, 0, 0]
}

"Walking — left leg forward, right arm forward":
{
  "leftHip":  [-38, 0, 0],
  "rightHip": [25, 0, 0],
  "leftShin": [15, 0, 0],
  "rightShin": [5, 0, 0],
  "leftShoulder":  [30, 0, 10],
  "rightShoulder": [-30, 0, -10],
  "leftForearm":   [-20, 0, 0],
  "rightForearm":  [-15, 0, 0],
  "spine": [5, 0, 0]
}

"T-pose — arms out horizontal":
{
  "leftShoulder":  [0, 0, -90],
  "rightShoulder": [0, 0, 90]
}

"Crouching — deep squat, arms forward for balance":
{
  "leftHip":  [-100, 0, 10],
  "rightHip": [-100, 0, -10],
  "leftShin": [130, 0, 0],
  "rightShin":[130, 0, 0],
  "leftFoot": [-30, 0, 0],
  "rightFoot":[-30, 0, 0],
  "spine":    [20, 0, 0],
  "leftShoulder":  [-40, 0, 15],
  "rightShoulder": [-40, 0, -15],
  "leftForearm":   [-30, 0, 0],
  "rightForearm":  [-30, 0, 0]
}

━━ OUTPUT FORMAT ━━
Respond ONLY with valid JSON — no preamble, no explanation:
{
  "pose": { "jointId": [xDeg, yDeg, zDeg] },
  "interpretation": "one sentence describing the pose"
}
Include only joints that differ from [0, 0, 0]. Clamp all values within stated ranges.`

function clampToDef(jointId, angles) {
  const { x, y, z } = JOINT_DEFS[jointId].axes
  return [
    Math.max(x[0], Math.min(x[1], angles[0])),
    Math.max(y[0], Math.min(y[1], angles[1])),
    Math.max(z[0], Math.min(z[1], angles[2])),
  ]
}

function extractJSON(text) {
  try { return JSON.parse(text.trim()) } catch {}
  const fenced = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
  if (fenced) try { return JSON.parse(fenced[1]) } catch {}
  const braced = text.match(/\{[\s\S]+\}/)
  if (braced) try { return JSON.parse(braced[0]) } catch {}
  throw new Error('Could not parse JSON from Claude response')
}

export async function generatePose(description) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'No API key found. Create a .env file with VITE_ANTHROPIC_API_KEY=sk-ant-...'
    )
  }

  // dangerouslyAllowBrowser is intentional — this is a local dev tool
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: `Generate a pose for: "${description}"` },
    ],
  })

  const textBlock = response.content.find(b => b.type === 'text')
  if (!textBlock) throw new Error('No text response received from Claude')

  const parsed = extractJSON(textBlock.text)

  const rotations = { ...INITIAL_ROTATIONS }
  if (parsed.pose && typeof parsed.pose === 'object') {
    for (const [id, angles] of Object.entries(parsed.pose)) {
      if (JOINT_DEFS[id] && Array.isArray(angles) && angles.length === 3) {
        rotations[id] = clampToDef(id, angles.map(Number))
      }
    }
  }

  return {
    rotations,
    interpretation: parsed.interpretation ?? 'Pose generated',
  }
}
