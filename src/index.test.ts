import { describe, expect, test } from 'bun:test'
import {
  treesCoreManifest,
  treesEditorManifest,
  treesHostPanel,
  treesViewerManifest,
} from './index'

const KINDS = ['trees:tree', 'trees:flower', 'trees:grass']

describe('Nature plugin manifests', () => {
  test('declares the stable plugin identity and node kinds', () => {
    expect(treesCoreManifest.id).toBe('pascal:trees')
    expect(treesCoreManifest.apiVersion).toBe(2)
    expect(treesCoreManifest.nodes?.map((definition) => definition.kind)).toEqual(KINDS)
  })

  test('every presentation contribution names a kind the core manifest declares', () => {
    const declared = new Set(treesCoreManifest.nodes?.map((definition) => definition.kind))
    for (const manifest of [treesViewerManifest, treesEditorManifest]) {
      expect(manifest.id).toBe(treesCoreManifest.id)
      for (const contribution of manifest.contributions ?? []) {
        expect({ kind: contribution.kind, declared: declared.has(contribution.kind) }).toEqual({
          kind: contribution.kind,
          declared: true,
        })
      }
    }
  })

  test('every kind contributes to both presentation surfaces', () => {
    expect(treesViewerManifest.contributions?.map((c) => c.kind)).toEqual(KINDS)
    expect(treesEditorManifest.contributions?.map((c) => c.kind)).toEqual(KINDS)
  })

  test('keeps semantics out of the presentation manifests', () => {
    // A field that belongs to the base definition appearing in a presentation
    // manifest would mean the split leaked, and the host would reject it.
    for (const contribution of [
      ...(treesViewerManifest.contributions ?? []),
      ...(treesEditorManifest.contributions ?? []),
    ]) {
      for (const semantic of ['schema', 'schemaVersion', 'defaults', 'capabilities', 'category']) {
        expect({ kind: contribution.kind, semantic, present: semantic in contribution }).toEqual({
          kind: contribution.kind,
          semantic,
          present: false,
        })
      }
    }
  })

  test('keeps presentation out of the base definitions', () => {
    for (const definition of treesCoreManifest.nodes ?? []) {
      for (const presentation of ['renderer', 'system', 'bake', 'parametrics', 'tool', 'floorplan']) {
        expect({
          kind: definition.kind,
          presentation,
          present: presentation in definition,
        }).toEqual({ kind: definition.kind, presentation, present: false })
      }
    }
  })

  test('associates the Nature panel with the plugin', () => {
    expect(treesHostPanel.pluginId).toBe(treesCoreManifest.id)
    expect(treesHostPanel.defaultInstalled).toBe(true)
    expect(treesHostPanel.pluginUrl).toBe('https://github.com/pascalorg/plugin-trees')
  })
})
