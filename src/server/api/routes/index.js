import express from 'express'
import productsRoutes from './products'
import variantsRoutes from './variants'
import purchasesRoutes from './purchases'

const router = express.Router()

router.use('/products', productsRoutes)
router.use('/products/:id/variants', variantsRoutes)
router.use('/variants', variantsRoutes)
router.use('/purchases', purchasesRoutes)

export default router
