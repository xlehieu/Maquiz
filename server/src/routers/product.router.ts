import express from 'express';

import * as ProductController from '@controllers/product.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
const productRouter = express.Router();

productRouter.put('/update/:id', authMiddleware, ProductController.updateProduct);
productRouter.post('/create', authMiddleware, ProductController.createProduct);
productRouter.delete('/delete/:id', authMiddleware, ProductController.deleteProduct);
productRouter.get('/detail/:slug', ProductController.getProductDetail);
productRouter.get('/', ProductController.getAllProduct);
export default productRouter;
