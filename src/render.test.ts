import { describe, expect, test } from 'bun:test'
import { treesPlugin } from './index'
import { treesRenderPlugin } from './render'

// Definition fields only an editing host reads (the editor's edit-contribution
// field list); none may appear on a render definition.
const EDIT_FIELDS = [
  'extensions',
  'facingIndicator',
  'drafting',
  'connectedMove',
  'parametrics',
  'placementNotice',
  'quickActions',
  'quickActionNodeScope',
  'tool',
  'affordanceTools',
  'affordances',
  'toolHints',
  'affordanceHints',
  'toolOptions',
  'snapProfile',
  'snapDraftDirectional',
  'preview',
  'keyboardActions',
  'handles',
  'floorplanDependencies',
  'floorplanDependsOnSiblings',
  'floorplanAffectedIds',
  'floorplanSiblingOverrides',
  'floorplanAffordances',
  'floorplanMoveTarget',
]

describe('render-only plugin', () => {
  const renderNodes = treesRenderPlugin.nodes ?? []
  const fullNodes = treesPlugin.nodes ?? []

  test('keeps the root plugin identity and registers the same kinds', () => {
    expect(treesRenderPlugin.id).toBe(treesPlugin.id)
    expect(treesRenderPlugin.apiVersion).toBe(treesPlugin.apiVersion)
    expect(renderNodes.map((def) => def.kind)).toEqual(fullNodes.map((def) => def.kind))
  })

  test('each kind loads the same documents as in the editor', () => {
    for (const [i, render] of renderNodes.entries()) {
      const full = fullNodes[i] as unknown as Record<string, unknown>
      const def = render as unknown as Record<string, unknown>
      for (const key of ['schema', 'schemaVersion', 'migrations', 'bake', 'category'] as const) {
        expect(def[key]).toBe(full[key])
      }
      expect(render.defaults?.()).toEqual(fullNodes[i]?.defaults?.() as never)
      for (const key of ['renderer', 'system', 'bakeReplaceRenderer', 'floorplan']) {
        expect(def[key]).toBeDefined()
        expect(def[key]).toBe(full[key])
      }
    }
  })

  test('render definitions carry no editing fields; the root definitions still do', () => {
    for (const [i, render] of renderNodes.entries()) {
      expect(EDIT_FIELDS.filter((field) => field in render)).toEqual([])
      const full = fullNodes[i] as unknown as Record<string, unknown>
      for (const field of ['parametrics', 'tool', 'preview', 'toolHints', 'snapProfile']) {
        expect(full[field]).toBeDefined()
      }
    }
  })
})
