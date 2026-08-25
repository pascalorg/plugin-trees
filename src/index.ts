import type { CorePluginManifest } from '@pascal-app/core'
import { PLUGIN_API_VERSION } from '@pascal-app/core'
import type { EditorPluginManifest } from '@pascal-app/editor'
import type { ViewerPluginManifest } from '@pascal-app/viewer'
// Side-effect: subscribes the panel store to `selection:find-node` so the
// host's "find in catalog" lands on the right Nature section (see find-sync.ts).
import './find-sync'
import { NATURE_ICON } from './art'
import { treeCoreDefinition, treeEditorContribution, treeViewerContribution } from './definition'
import {
  flowerCoreDefinition,
  flowerEditorContribution,
  flowerViewerContribution,
} from './flower-definition'
import {
  grassCoreDefinition,
  grassEditorContribution,
  grassViewerContribution,
} from './grass-definition'

type PluginHostPanel = {
  id: string
  label: string
  icon: { kind: 'url'; src: string }
  component: () => Promise<{ default: React.ComponentType }>
  pluginId: string
  description: string
  creator: {
    name: string
    url?: string
  }
  pluginUrl: string
  defaultInstalled: boolean
}

const PLUGIN_ID = 'pascal:trees'

/**
 * The trees plugin manifests — the entire public surface of this package.
 *
 * v2 splits what v1 shipped as one `NodeDefinition` list into three manifests,
 * each naming only what its own package owns. A kind exists because
 * `treesCoreManifest` declares it; the viewer and editor manifests attach to
 * those kinds by `kind` and are rejected if no base definition was registered.
 *
 * Nothing here names `NodeDefinition` — that type is gone from the v2 contract,
 * which is what lets `@pascal-app/core` stop publishing React and Three.js
 * types to plugin authors.
 */
export const treesCoreManifest: CorePluginManifest = {
  id: PLUGIN_ID,
  apiVersion: PLUGIN_API_VERSION,
  nodes: [treeCoreDefinition, flowerCoreDefinition, grassCoreDefinition],
}

/** Geometry, renderers, and the instanced systems that batch every plant. */
export const treesViewerManifest: ViewerPluginManifest = {
  id: PLUGIN_ID,
  contributions: [
    { kind: treeCoreDefinition.kind, ...treeViewerContribution },
    { kind: flowerCoreDefinition.kind, ...flowerViewerContribution },
    { kind: grassCoreDefinition.kind, ...grassViewerContribution },
  ],
}

/** Inspector parametrics, plan symbols, placement tools, and palette entries. */
export const treesEditorManifest: EditorPluginManifest = {
  id: PLUGIN_ID,
  contributions: [
    { kind: treeCoreDefinition.kind, ...treeEditorContribution },
    { kind: flowerCoreDefinition.kind, ...flowerEditorContribution },
    { kind: grassCoreDefinition.kind, ...grassEditorContribution },
  ],
}

export const treesHostPanel: PluginHostPanel = {
  id: 'pascal:trees:trees',
  label: 'Nature',
  icon: { kind: 'url', src: NATURE_ICON },
  component: () => import('./presets-panel'),
  pluginId: PLUGIN_ID,
  description: 'Procedural trees, flowers, and grasses for outdoor scenes.',
  creator: {
    name: 'Pascal',
    url: 'https://github.com/pascalorg',
  },
  pluginUrl: 'https://github.com/pascalorg/plugin-trees',
  defaultInstalled: true,
}

// NOTE: no re-export from './geometry' — it imports ez-tree, which touches
// `document` at module scope and would crash SSR (this barrel is eagerly
// imported by host bootstraps). Lazy client modules import it directly.
export {
  treeCoreDefinition,
  treeEditorContribution,
  treeViewerContribution,
} from './definition'
export {
  flowerCoreDefinition,
  flowerEditorContribution,
  flowerViewerContribution,
} from './flower-definition'
export { FlowerNode, FlowerPreset } from './flower-schema'
export {
  grassCoreDefinition,
  grassEditorContribution,
  grassViewerContribution,
} from './grass-definition'
export { GrassNode, GrassPreset } from './grass-schema'
export { TreeNode, TreePreset } from './schema'
