import type { AnyNodeDefinition, Plugin } from '@pascal-app/core'
import { treeRenderDefinition } from './definition.render'
import { flowerRenderDefinition } from './flower-definition.render'
import { grassRenderDefinition } from './grass-definition.render'

/**
 * Render-only entry (`@pascal-app/plugin-trees/render`) for read-only viewers.
 * Same plugin id, contract version, kinds, schemas, defaults and bake policy as
 * `treesPlugin`, without placement, inspector, gizmos, the Nature panel or
 * anything that imports `@pascal-app/editor`. `bun run check:render` holds that
 * boundary.
 */
export const treesRenderPlugin: Plugin = {
  id: 'pascal:trees',
  apiVersion: 1,
  nodes: [
    treeRenderDefinition as unknown as AnyNodeDefinition,
    flowerRenderDefinition as unknown as AnyNodeDefinition,
    grassRenderDefinition as unknown as AnyNodeDefinition,
  ],
}

// No re-export from './geometry': ez-tree touches `document` at module scope.
export { treeRenderDefinition } from './definition.render'
export { flowerRenderDefinition } from './flower-definition.render'
export { FlowerNode, FlowerPreset } from './flower-schema'
export { grassRenderDefinition } from './grass-definition.render'
export { GrassNode, GrassPreset } from './grass-schema'
export { TreeNode, TreePreset } from './schema'
