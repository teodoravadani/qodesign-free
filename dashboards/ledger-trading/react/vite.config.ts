import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built demo also works from a sub-folder (GitHub Pages)
export default defineConfig({ plugins: [react()], base: './' });
