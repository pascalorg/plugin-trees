import { describe, expect, test } from 'bun:test'
import { DoubleSide, Vector3 } from 'three'
import { getGrassVariant } from './grass-geometry'
import { GrassNode } from './grass-schema'

const CASES = [
  { bladeCount: 10, preset: 'meadow' as const, seed: 1 },
  { bladeCount: 8, preset: 'fescue' as const, seed: 7 },
  { bladeCount: 6, preset: 'reed' as const, seed: 13 },
]

describe('grass geometry', () => {
  test.each(CASES)('$preset uses one flat two-triangle ribbon per blade', ({ bladeCount, preset, seed }) => {
    const variant = getGrassVariant(GrassNode.parse({ bladeColor: '#5a8f3c', preset, seed }))
    expect(variant.subMeshes).toHaveLength(1)

    const { geometry, material } = variant.subMeshes[0]!
    const position = geometry.attributes.position!
    if (Array.isArray(material)) throw new Error(`${preset} grass must use one shared material`)
    expect(material.side).toBe(DoubleSide)
    expect(position.count).toBe(bladeCount * 4)
    expect(geometry.attributes.normal?.count).toBe(position.count)
    expect(geometry.attributes.uv?.count).toBe(position.count)
    expect(geometry.index?.count).toBe(bladeCount * 6)

    for (let bladeIndex = 0; bladeIndex < bladeCount; bladeIndex++) {
      const offset = bladeIndex * 4
      const points = Array.from({ length: 4 }, (_, index) =>
        new Vector3().fromBufferAttribute(position, offset + index),
      )
      const [baseLeft, baseRight, tipRight, tipLeft] = points as [
        Vector3,
        Vector3,
        Vector3,
        Vector3,
      ]
      const planeNormal = new Vector3()
        .subVectors(baseRight, baseLeft)
        .cross(new Vector3().subVectors(tipRight, baseLeft))
        .normalize()
      const fourthPointDistance = Math.abs(
        new Vector3().subVectors(tipLeft, baseLeft).dot(planeNormal),
      )

      expect(baseLeft.distanceTo(baseRight)).toBeCloseTo(0.012, 5)
      expect(tipLeft.distanceTo(tipRight)).toBeCloseTo(0.0012, 5)
      expect(baseLeft.distanceTo(tipLeft)).toBeGreaterThan(0.2)
      expect(fourthPointDistance).toBeLessThan(0.000001)
    }
  })
})
