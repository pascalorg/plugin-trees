import type { AnyNodeDefinition, NodeDefinition } from '@pascal-app/core'

/**
 * The editing half of a plant kind: placement, inspector, gizmos and snapping.
 * Read-only viewers load the render halves without it. `snapProfile` is not in
 * every supported `@pascal-app/core` release's `NodeDefinition` type, so it is
 * declared here.
 */
export type PlantEditContribution<S extends AnyNodeDefinition['schema']> = Partial<
  Pick<NodeDefinition<S>, 'parametrics' | 'handles' | 'preview' | 'tool' | 'toolHints'>
> & { snapProfile?: 'item' }
