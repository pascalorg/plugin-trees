import { flowerEditContribution } from './flower-definition.edit'
import { flowerRenderDefinition } from './flower-definition.render'

/** The full flower definition for editing hosts: render half + edit half. */
export const flowerDefinition = {
  ...flowerRenderDefinition,
  ...flowerEditContribution,
}
