import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts', 'bin/cli.ts', 'src/testing.ts'],
  outdir: './dist',
  splitting: true,
  plugins: [dts()],
  target: 'node',
})
