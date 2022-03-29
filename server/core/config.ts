import { config } from 'dotenv'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
export const root = process.cwd()

// 环境变量
console.log('===== APP_MODE ====', process.env.APP_MODE)

config({
    path: `.env`,
})
if (['pre', 'pub'].indexOf(process.env.APP_MODE ?? '') !== -1) {
    config({
        override: true,
        path: `.env.${process.env.APP_MODE}`,
    })
}
