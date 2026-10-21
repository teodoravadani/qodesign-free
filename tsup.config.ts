import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/toast-stack.ts', 'src/pricing-switch.ts', 'src/upload-dropzone.ts', 'src/day-night-toggle.ts', 'src/orbit-dashboard.ts', 'src/ledger-dashboard.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  target: 'es2020',
  external: ['react', 'react-dom', 'framer-motion'],
});
