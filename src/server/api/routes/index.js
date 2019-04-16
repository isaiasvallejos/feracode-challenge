import express from 'express'
import productsRoutes from './products'
import variantsRoutes from './variants'

const router = express.Router()

router.use('/products', productsRoutes)
router.use('/products/:id/variants', variantsRoutes)
router.use('/variants', variantsRoutes)

export default router
