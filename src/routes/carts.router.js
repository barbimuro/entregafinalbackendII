import {Router} from 'express';
import mongoose from 'mongoose'

import {productsService, cartsService} from '../managers/index.js';
import cartsController from '../controllers/carts.controller.js';
import { passportCall } from '../middlewares/passportCall.js';
import { executePolicies } from '../middlewares/policies.js';


const router = Router()

router.get('/', async (req, res) => {
res.send("everything is working")
})

router.post('/', passportCall('current'),executePolicies(['USER']), cartsController.getNewCart );

router.get('/:cid',passportCall('current'),executePolicies(['USER']), cartsController.getCartById )

router.post('/:cid/product/:pid', passportCall('current'),executePolicies(['USER']), cartsController.addProductToCart)

router.put('/:cid', passportCall('current'), executePolicies(["USER"]), cartsController.updateProductsInCart);

router.delete('/:cid/product/:pid', passportCall('current'), executePolicies(["USER"]), cartsController.deleteProductById);

router.delete('/:cid', passportCall('current'), executePolicies(["USER"]), cartsController.clear);

router.post('/:cid/purchase', passportCall('current'),executePolicies(["USER"], "Purchase"), cartsController.purchase);

export default router