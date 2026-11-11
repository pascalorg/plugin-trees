import type { NodeDefinition } from '@pascal-app/core'
import { buildTreeFloorplan, treeTrunkRadius } from './floorplan'
import { TreeNode } from './schema'

type TreeDefinition = NodeDefinition<typeof TreeNode> & Record<string, unknown>

const treeFloorPlacement = {
  footprint: (node: unknown) => {
    const tree = node as TreeNode
    const radius = treeTrunkRadius(tree)
    return {
      dimensions: [radius * 2, tree.height, radius * 2] as [number, number, number],
      rotation: tree.rotation,
    }
  },
  collides: false,
}

/**
 * The tree's render half: everything a read-only viewer needs to load and draw
 * `trees:tree` without `@pascal-app/editor`. Rendering uses the instanced path
 * rather than the per-node `def.geometry`: a collective `def.system` batches
 * every tree into `InstancedMesh`es (forest-scale draw calls), while a
 * featherweight `def.renderer` mounts an invisible per-node proxy so the host's
 * selection / outline / zone machinery works unchanged. Editing behavior lives
 * in `definition.edit.ts`; `definition.ts` composes both.
 */
export const treeRenderDefinition: TreeDefinition = {
  kind: 'trees:tree',
  // Static in the bake for portability; our viewer removes the baked meshes and
  // re-renders live (wind, LODs) via this def's own path. See plans → Part D.
  bake: 'replace',
  schemaVersion: 1,
  schema: TreeNode,
  category: 'furnish',

  defaults: () => ({
    object: 'node',
    parentId: null,
    visible: true,
    metadata: {},
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    preset: 'oak',
    size: 'medium',
    treeType: 'deciduous',
    height: 7,
    seed: 1,
    foliageDensity: 1,
    trunkThickness: 1,
    leafless: false,
    leafColor: '#ffffff',
    branchColor: '#ffffff',
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
    // The auto-measured drag box would wrap the whole canopy (the proxy shows
    // the real geometry while selected) — declare trunk-sized bounds instead.
    dragBounds: (node) => {
      const tree = node as unknown as TreeNode
      const radius = treeTrunkRadius(tree)
      return { size: [radius * 2, tree.height ?? 7, radius * 2] }
    },
    // Defined outside the contextually typed object so the optional `collides`
    // hint remains compatible with Pascal hosts released before that field.
    floorPlaced: treeFloorPlacement,
  },

  // 2D plan symbol: dashed canopy ring + trunk dot (see floorplan.ts).
  floorplan: buildTreeFloorplan,

  // Instanced rendering: an invisible per-node proxy for selection/outline...
  renderer: { kind: 'parametric', module: () => import('./proxy-renderer') },
  // ...and a collective system that batches every tree into InstancedMeshes.
  system: { module: () => import('./system'), priority: 3 },
  // Baked `/viewer` re-render for `bake: 'replace'` — collective, instanced.
  bakeReplaceRenderer: { module: () => import('./static-renderer') },

  presentation: {
    label: 'Tree',
    description: 'A procedural ez-tree. Oak, pine, aspen, ash, bush, or trellis.',
    icon: { kind: 'iconify', name: 'lucide:trees' },
    paletteSection: 'furnish',
    hidden: true,
  },

  mcp: {
    description:
      'A procedural ez-tree (example plugin node). Species presets (oak/pine/aspen/ash/bush/trellis) × size, deciduous/evergreen type, adjustable height, foliage/trunk, leaf & branch tint, and a seed for variation.',
  },
}
