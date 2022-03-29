const path = require('path')
const { build } = require('vite')
const { config } = require('dotenv')


// 环境变量
console.log('===== APP_MODE ====', process.env.APP_MODE)

config({
    path: `.env`,
})
if (['pre', 'pub'].indexOf(process.env.APP_MODE ?? '') !== -1) {
  config({
      path: `.env.${process.env.APP_MODE}`,
  })
}

const distDir = path.resolve(process.cwd(), 'dist', process.env.outDir)

const serverBuildOptions = {
    publicDir: false, // No need to copy public files to SSR directory
    build: {
      outDir: path.resolve(distDir, 'server'),
      // The plugin is already changing the vite-ssr alias to point to the server-entry.
      // Therefore, here we can just use the same entry point as in the index.html
      ssr: 'src/entry-server.js',
      emptyOutDir: false,
    },
}

const clientBuildOptions = {
    build: {
      outDir: path.resolve(distDir, 'client'),
      ssrManifest: true,
      emptyOutDir: false,
    }
}

const appServerBuildOptions = {
  configFile: './vite.config.server.js'
}
async function run() {
  const appResult = await build(appServerBuildOptions);
  const clientResult = await build(clientBuildOptions)
  const serverResult = await build(serverBuildOptions)
}

run()