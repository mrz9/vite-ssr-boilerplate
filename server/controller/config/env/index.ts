import express from 'express'
const router = express.Router()
/**
 * 添加
 */
router.get('/env', async (req, res) => {
    req.app.logger.info('CHILL WINSTON!', {
        msg: 'custom app logger',
        db_url: process.env.db_url,
    })
    res.json(process.env)
})

export default router
