import express from 'express';
import fs from 'fs'
import compression from 'compression'
import ServeStatic from 'serve-static'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const {createServer} = require('vite')
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const root = process.cwd()
const isProd = process.env.NODE_ENV === 'production'

// app.listen(3000, () => {
//   console.log('http://localhost:3000')
// }),
console.log('app start')

export const createAppServer = async () => {

  const resolve = (p:string) => path.resolve(__dirname, p)
  const manifest = isProd ? require('../web/ssr-manifest.json') : {}

  let app;
  let vite:any;
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
    app = express();
    app.use(vite.middlewares)
  } else {
    app = express();
    app.use(compression())
    app.use(
        ServeStatic(resolve('../web'), {
            index: false,
        }),
    )
  }

  // app.get('/info', (req, res) => {
  //   res.end('change me to see updates, express!!');
  // });

  // app.get('/admin', (req, res) => {
  //   console.log('in admin')
  //   res.end('admin page');
  // });

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template;
      let render
      if (!isProd) {
        template = fs.readFileSync(resolve('../index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule(resolve('../src/entry-server.js'))).render
      } else {
        template = fs.readFileSync(resolve('../web/index/index.html'), 'utf-8')
        render = require('../web/entry-server.js').render
      }

      const [appHead, appHtml, preloadLinks] = await render(url, manifest)

      const html = template
          .replace(`<!--head-meta-->`, appHead)
          .replace(`<!--preload-links-->`, preloadLinks)
          .replace(`<!--app-html-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e:any) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })


  console.log('use app')
  return app;
}