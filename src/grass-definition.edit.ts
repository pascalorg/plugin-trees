import type { PlantEditContribution } from './edit-contribution'
import { grassParametrics } from './grass-parametrics'
import type { GrassNode } from './grass-schema'

/** The grass's edit half: inspector and placement (`tool`/`preview`). */
export const grassEditContribution: PlantEditContribution<typeof GrassNode> = {
  snapProfile: 'item',
  parametrics: grassParametrics,
  preview: () => import('./grass-preview'),
  tool: () => import('./grass-tool'),
  toolHints: [
    { key: 'Left click', label: 'Plant grass' },
    { key: 'Esc', label: 'Stop' },
  ],
}
