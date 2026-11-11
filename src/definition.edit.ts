import type { HandleDescriptor } from '@pascal-app/core'
import type { PlantEditContribution } from './edit-contribution'
import { treeTrunkRadius } from './floorplan'
import { treeParametrics } from './parametrics'
import type { TreeNode } from './schema'

const ROTATE_RING_OFFSET = 0.35
/** Ring hugs the ground like the item gizmo — high enough to clear the grass,
 * low enough to read as a floor affordance. */
const ROTATE_RING_Y = 0.25

/** Whole-tree Y-rotation gizmo (same rig as shelf/item): a ring around the
 * trunk near the ground — not the canopy, which would put the handle meters
 * from the trunk on a large oak. */
function treeRotateHandle(): HandleDescriptor<TreeNode> {
  const ringRadius = (n: TreeNode) => treeTrunkRadius(n) + ROTATE_RING_OFFSET
  const ringY = () => ROTATE_RING_Y
  return {
    kind: 'arc-resize',
    axis: 'angular',
    shape: 'rotate',
    apply: (initial, delta) => {
      const r = initial.rotation ?? [0, 0, 0]
      // Negate to match three.js Y-rotation handedness (same as shelf).
      return { rotation: [r[0], (r[1] ?? 0) - delta, r[2]] as [number, number, number] }
    },
    placement: {
      position: (n) => {
        const r = ringRadius(n)
        return [r * Math.SQRT1_2, ringY(), r * Math.SQRT1_2]
      },
      rotationY: () => -Math.PI / 4,
    },
    decoration: {
      kind: 'ring',
      radius: ringRadius,
      y: ringY,
    },
  }
}

/** The tree's edit half: inspector, gizmo and placement (`tool`/`preview`). */
export const treeEditContribution: PlantEditContribution<typeof TreeNode> = {
  snapProfile: 'item',
  parametrics: treeParametrics,
  handles: [treeRotateHandle()],
  preview: () => import('./preview'),
  tool: () => import('./tool'),
  toolHints: [
    { key: 'Left click', label: 'Plant tree' },
    { key: 'Esc', label: 'Stop' },
  ],
}
