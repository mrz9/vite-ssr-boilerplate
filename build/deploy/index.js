/**
 * nodejs用supervisor执行守护
 * 运维入口： node index --node-args="env=dev port=30000"
 */
const { execSync, spawn } = require('child_process')
const path = require('path')
const APP_PATH = path.resolve(__dirname)

// 默认配置
let NODE_ARGS = {
    port: 30000,
    env: 'dev',
}
try {
    let args = process.argv.find((arg) => arg.startsWith('--node-args='))
    let NODE_ARG_ARRAY = []
    if (args) {
        let varsString = args.split('--node-args=').pop()
        NODE_ARG_ARRAY = varsString.split(' ')
        NODE_ARG_ARRAY.forEach((item) => {
            let arr = item.split('=')
            NODE_ARGS[arr[0]] = arr[1]
        })
    }
    console.log('\n1. 运行配置====>', NODE_ARGS)
    console.log('2. 运行时间====>', new Date().toLocaleString())
} catch (e) {
    console.log(e)
}

// npx可以执行项目下node_modules的命令，不用安装全局
execSync(
    `npx cross-env NODE_ENV=production APP_MODE=${NODE_ARGS.env} PORT=${NODE_ARGS.port} node app.js`,
    { cwd: APP_PATH, stdio: 'inherit' },
)
