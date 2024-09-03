import {Router} from 'express';
import mongoose from 'mongoose'

import {productsService} from '../managers/index.js';
import uploader from "../middlewares/uploader.js";
import productsController from '../controllers/products.controller.js'; 
import { executePolicies } from "../middlewares/policies.js";
import { passportCall } from '../middlewares/passportCall.js';

const router = Router()

router.get('/', passportCall('current'),executePolicies(['PUBLIC']),productsController.getAllProducts);

router.post('/',passportCall('current'),executePolicies(['ADMIN']), uploader.single('data'), productsController.createNewProduct);

router.put('/:pid',passportCall('current'),executePolicies(['ADMIN']), uploader.single('data'), productsController.updateProduct);

router.delete('/:pid',passportCall('current'),executePolicies(['ADMIN']), productsController.deleteProduct);

export default router