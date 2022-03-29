import express from 'express'
import fs from 'fs'
import compression from 'compression'
import ServeStatic from 'serve-static'
import { createRequire } from 'module'
import path from 'path'
import { root } from './config'
import router from '../controller'

const require = createRequire(import.meta.url)
const { createServer } = require('vite')

export const isProd = process.env.NODE_ENV === 'production'

console.log('app start', isProd)

const resolve = (p: string) => path.resolve(root, p)

export const createAppServer = async () => {
    const manifest = isProd ? require('./client/ssr-manifest.json') : {}

    let vite: any
    const app = express()
    app.use('/config', router)

    if (!isProd) {
        /**
         * @type {import('vite').ViteDevServer}
         */
        vite = await createServer({
            root,
            logLevel: 'error',
            server: {
                middlewareMode: 'ssr',
                watch: {
                    // During tests we edit the files too fast and sometimes chokidar
                    // misses change events, so enforce polling for consistency
                    usePolling: true,
                    interval: 100,
                },
            },
        })
        app.use(vite.middlewares)
    } else {
        app.use(compression())
        app.use(
            ServeStatic(resolve('./client'), {
                index: false,
            }),
        )
    }

    app.use('*', async (req, res) => {
        try {
            const url = req.originalUrl
            let template
            let render
            if (!isProd) {
                template = fs.readFileSync(resolve('index.html'), 'utf-8')
                template = await vite.transformIndexHtml(url, template)
                render = (
                    await vite.ssrLoadModule(resolve('src/entry-server.js'))
                ).render
            } else {
                template = fs.readFileSync(
                    resolve('./client/index.html'),
                    'utf-8',
                )
                render = require('./server/entry-server.js').render
            }

            const [appHead, appHtml, preloadLinks] = await render(url, manifest)

            const html = template
                .replace(`<!--head-meta-->`, appHead)
                .replace(`<!--preload-links-->`, preloadLinks)
                .replace(`<!--app-html-->`, appHtml)

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
        } catch (e: any) {
            vite && vite.ssrFixStacktrace(e)
            console.log(e.stack)
            res.status(500).end(e.stack)
        }
    })

    return app
}
