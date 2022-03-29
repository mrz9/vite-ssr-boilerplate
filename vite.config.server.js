// eslint-disable-next-line @typescript-eslint/no-var-requires
const ViteSSRPlugin = require('./plugin/viteSSR.js')
// https://vitejs.dev/config/
module.exports = {
    build: {
        outDir: 'dist/web_agc',
    },
    plugins: [
        ViteSSRPlugin({
            appPath: './server/app.ts',
            exportName: 'createAppServer',
        }),
    ],
}
