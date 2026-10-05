import path from 'path'
import { createRequire } from 'module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// The pdf.js worker that matches react-pdf's own pdfjs-dist version
// (the top-level pdfjs-dist is an older, unrelated version).
const require = createRequire(import.meta.url)
const pdfjsWorker = createRequire(require.resolve('react-pdf')).resolve(
  'pdfjs-dist/build/pdf.worker.min.mjs'
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      // `import url from 'pdfjs-worker?url'` (regex so the ?url query is kept)
      { find: /^pdfjs-worker(?=\?|$)/, replacement: pdfjsWorker.split(path.sep).join('/') },
    ],
  },
})
