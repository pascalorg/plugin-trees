import type { NodeDefinition } from '@pascal-app/core'
import { buildFlowerFloorplan } from './floorplan'
import { FlowerNode } from './flower-schema'

type FlowerDefinition = NodeDefinition<typeof FlowerNode> & Record<string, unknown>

const flowerFloorPlacement = {
  footprint: (node: unknown) => {
    const flower = node as FlowerNode
    const radius = Math.max(0.1, flower.height * 0.25)
    return {
      dimensions: [radius * 2, flower.height, radius * 2] as [number, number, number],
      rotation: flower.rotation,
    }
  },
  collides: false,
}

/**
 * The flower's render half, a sibling instanced kind to the tree. A
 * `def.system` batches every flower into InstancedMeshes and a featherweight
 * `def.renderer` proxy keeps selection working. Editing behavior lives in
 * `flower-definition.edit.ts`; `flower-definition.ts` composes both.
 */
export const flowerRenderDefinition: FlowerDefinition = {
  kind: 'trees:flower',
  bake: 'replace', // static in bake, live-rebuilt in our viewer — see plans → Part D
  schemaVersion: 1,
  schema: FlowerNode,
  category: 'furnish',

  defaults: () => ({
    object: 'node',
    parentId: null,
    visible: true,
    metadata: {},
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    preset: 'daisy',
    height: 0.5,
    seed: 1,
    petalColor: '#fcfcf2',
  }),

  capabilities: {
    movable: { axes: ['x', 'z'], gridSnap: true },
    rotatable: {
      axes: ['y'],
      snapAngles: Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4),
    },
    selectable: { hitVolume: 'bbox' },
    duplicable: true,
    deletable: true,
    groupable: true,
    snappable: {},
    floorPlaced: flowerFloorPlacement,
  },

  floorplan: buildFlowerFloorplan,

  renderer: { kind: 'parametric', module: () => import('./flower-proxy-renderer') },
  system: { module: () => import('./flower-system'), priority: 3 },
  bakeReplaceRenderer: { module: () => import('./flower-static-renderer') },

  presentation: {
    label: 'Flower',
    description: 'A procedural flower. Daisy, tulip, or lavender.',
    icon: { kind: 'iconify', name: 'lucide:flower-2' },
    paletteSection: 'furnish',
    hidden: true,
  },

  mcp: {
    description:
      'A procedural flower (example plugin node) — daisy, tulip, or lavender, instanced like the trees.',
  },
}
