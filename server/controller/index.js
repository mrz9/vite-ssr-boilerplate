import express from 'express'
const router = express.Router()
/**
 * 添加
 */
router.get('/env', async (req, res) => {
    res.json(process.env)
})
export default router
