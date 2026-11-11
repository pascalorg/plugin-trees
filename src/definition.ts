import { treeEditContribution } from './definition.edit'
import { treeRenderDefinition } from './definition.render'

/** The full tree definition for editing hosts: render half + edit half. */
export const treeDefinition = {
  ...treeRenderDefinition,
  ...treeEditContribution,
}
