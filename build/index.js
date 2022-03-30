/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs')
const { build } = require('vite')
const { config } = require('dotenv')

const mode = process.env.APP_MODE || 'dev'
// 环境变量
console.log('===== APP_MODE ====', mode)

config({
    path: `.env`,
})
if (['pre', 'pub'].indexOf(mode) !== -1) {
    config({
        override: true,
        path: `.env.${mode}`,
    })
}

const distDir = path.resolve(process.cwd(), 'dist', process.env.outDir)

const serverBuildOptions = {
    publicDir: false, // No need to copy public files to SSR directory
    mode,
    build: {
        outDir: path.resolve(distDir, 'server'),
        // The plugin is already changing the vite-ssr alias to point to the server-entry.
        // Therefore, here we can just use the same entry point as in the index.html
        ssr: 'src/entry-server.js',
        emptyOutDir: false,
    },
}

const clientBuildOptions = {
    mode,
    build: {
        outDir: path.resolve(distDir, 'client'),
        ssrManifest: true,
        emptyOutDir: false,
    },
}

const appServerBuildOptions = {
    configFile: './vite.config.server.js',
    build: {
        outDir: path.resolve(distDir),
    },
}

function copyDeployFile() {
    fs.copyFileSync(
        './build/deploy/index.js',
        path.resolve(distDir, 'index.js'),
    )
    fs.copyFileSync('.env', path.resolve(distDir, '.env'))
    fs.copyFileSync('.env.pre', path.resolve(distDir, '.env.pre'))
    fs.copyFileSync('.env.pub', path.resolve(distDir, '.env.pub'))
}

async function run() {
    await build(appServerBuildOptions)
    await build(clientBuildOptions)
    await build(serverBuildOptions)
    copyDeployFile()
}

run()
