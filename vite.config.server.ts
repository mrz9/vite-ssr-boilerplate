import { defineConfig } from 'vite'
import ViteSSRPlugin from './plugin/viteSSR'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist/web_agc'
  },
  plugins: [
    ViteSSRPlugin({
      appPath: './server/app.ts',
      exportName: 'createAppServer',
    }),
  ],
})
