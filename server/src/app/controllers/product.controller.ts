import { Types } from 'mongoose';
import * as ProductService from '../services/product.service';
import { Request, Response } from 'express';
export const getAllProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { limit, page } = req.query;
        const response = await ProductService.getAllProduct(Number(limit), Number(page));
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            status: 'ERROR',
            message: err,
        });
    }
};
export const getProductDetail = async (req: Request, res: Response): Promise<any> => {
    try {
        const slug = req.params.slug;
        if (!slug) {
            return res.status(200).json({
                status: 'ERROR',
                message: 'Incomplete data',
            });
        }
        const response = await ProductService.getProductDetail(slug);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            status: 'ERROR',
            message: 'ERROR',
        });
    }
};
export const createProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, description, price, discount, quantity, thumb, category } = req.body;
        if (!name || !description || !price || !discount || !quantity || !thumb || !category) {
            return res.status(200).json({
                status: 'OK',
                message: 'Incomplete data',
            });
        }
        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const productId = new Types.ObjectId(req.params.id);
        if (!productId) {
            return res.status(200).json({
                status: 'OK',
                message: 'Product ID is required',
            });
        }
        const { name, description, price, quantity, thumb, category } = req.body;
        if (!name || !description || !price || !quantity || !thumb || !category) {
            return res.status(200).json({
                status: 'OK',
                message: 'Product info is required',
            });
        }
        const response = await ProductService.updateProduct(productId, req.body);
        return res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const productId = new Types.ObjectId(req.params.id);
        if (!productId) {
            return res.status(200).json({
                status: 'OK',
                message: 'Product ID is required',
            });
        }
        const response = await ProductService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: err });
    }
};
