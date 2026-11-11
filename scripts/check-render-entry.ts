/**
 * Render-entry boundary gate: bundles `./render` (every static and lazy import,
 * peer dependencies included) and fails if anything in the graph resolves to
 * `@pascal-app/editor` or `next`. A negative probe bundles the root entry and
 * expects the gate to catch its editor imports, so a silently blind check fails.
 */
import { fileURLToPath } from 'node:url'
import type { BunPlugin } from 'bun'

const FORBIDDEN = /^(@pascal-app\/editor|next)(\/|$)/
const root = fileURLToPath(new URL('..', import.meta.url))
const pkg = await Bun.file(`${root}package.json`).json()

type Hit = { specifier: string; importer: string }

async function forbiddenImports(entry: string): Promise<Hit[]> {
  const hits: Hit[] = []
  const gate: BunPlugin = {
    name: 'render-entry-gate',
    setup(build) {
      build.onResolve({ filter: FORBIDDEN }, (args) => {
        hits.push({ specifier: args.path, importer: args.importer.replace(root, '') })
        return { path: args.path, external: true }
      })
    },
  }
  const result = await Bun.build({
    entrypoints: [`${root}${entry.replace(/^\.\//, '')}`],
    target: 'browser',
    format: 'esm',
    splitting: true,
    loader: { '.webp': 'file' },
    plugins: [gate],
    throw: false,
  })
  if (!result.success) {
    for (const log of result.logs) console.error(log)
    throw new Error(`bundling ${entry} failed`)
  }
  return hits
}

const renderEntry = pkg.exports['./render'].default as string
const rootEntry = pkg.exports['.'].default as string

const renderHits = await forbiddenImports(renderEntry)
if (renderHits.length > 0) {
  console.error(`./render (${renderEntry}) reaches editor-only modules:`)
  for (const hit of renderHits) console.error(`  ${hit.importer} -> ${hit.specifier}`)
  process.exit(1)
}

const probeHits = await forbiddenImports(rootEntry)
if (!probeHits.some((hit) => hit.specifier.startsWith('@pascal-app/editor'))) {
  console.error(`negative probe: the root entry (${rootEntry}) should reach @pascal-app/editor`)
  process.exit(1)
}

console.log(
  `./render is editor-free (negative probe caught ${probeHits.length} editor import(s) from the root entry).`,
)
