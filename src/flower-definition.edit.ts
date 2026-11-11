import type { PlantEditContribution } from './edit-contribution'
import { flowerParametrics } from './flower-parametrics'
import type { FlowerNode } from './flower-schema'

/** The flower's edit half: inspector and placement (`tool`/`preview`). */
export const flowerEditContribution: PlantEditContribution<typeof FlowerNode> = {
  snapProfile: 'item',
  parametrics: flowerParametrics,
  preview: () => import('./flower-preview'),
  tool: () => import('./flower-tool'),
  toolHints: [
    { key: 'Left click', label: 'Plant flower' },
    { key: 'Esc', label: 'Stop' },
  ],
}
