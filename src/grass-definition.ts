import { grassEditContribution } from './grass-definition.edit'
import { grassRenderDefinition } from './grass-definition.render'

/** The full grass definition for editing hosts: render half + edit half. */
export const grassDefinition = {
  ...grassRenderDefinition,
  ...grassEditContribution,
}
