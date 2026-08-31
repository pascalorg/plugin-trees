import { describe, expect, test } from 'bun:test'
import { getGrassVariant } from './grass-geometry'

const CASES = [
  { bladeCount: 10, preset: 'meadow' as const, seed: 1 },
  { bladeCount: 8, preset: 'fescue' as const, seed: 7 },
  { bladeCount: 6, preset: 'reed' as const, seed: 13 },
]

describe('grass geometry', () => {
  test.each(CASES)('$preset uses one flat two-triangle ribbon per blade', ({ bladeCount, preset, seed }) => {
    const variant = getGrassVariant({ bladeColor: '#5a8f3c', preset, seed } as never)
    expect(variant.subMeshes).toHaveLength(1)

    const geometry = variant.subMeshes[0]!.geometry
    expect(geometry.attributes.position!.count).toBe(bladeCount * 4)
    expect(geometry.index?.count).toBe(bladeCount * 6)
  })
})
