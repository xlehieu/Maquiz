import { Types } from 'mongoose';
import Product from '../models/product.model';

export const getAllProduct = (limit: number = 5, page: number = 0) => {
    return new Promise(async (resolve, reject) => {
        try {
            page = Number(page);
            const totalProduct = await Product.countDocuments();
            const allProduct = await Product.find()
                .sort({})
                .limit(limit)
                .skip(limit * page);
            resolve({
                status: 'OK',
                data: allProduct,
                totalProduct,
                currentPage: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit),
            });
            //ceil là phương thức làm tròn lên
        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    });
};
export const createProduct = (newProduct: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.create(newProduct);
            if (product) {
                resolve({
                    status: 'OK',
                    data: product,
                });
            }
            reject({
                status: 'ERROR',
            });
        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    });
};
export const getProductDetail = (slug: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ slug: slug });
            if (product) {
                resolve({
                    status: 'OK',
                    data: product,
                });
            }
            reject({
                status: 'ERROR',
            });
        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    });
};
export const updateProduct = (id: Types.ObjectId, updateProduct: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                resolve({
                    status: 'OK',
                    message: 'Not found product info',
                });
            }
            const newInfoUpdateProduct = await Product.findByIdAndUpdate(id, updateProduct, { new: true });
            resolve({
                status: 'OK',
                data: newInfoUpdateProduct,
            });
        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    });
};
export const deleteProduct = (id: Types.ObjectId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                resolve({
                    status: 'OK',
                    message: 'Not found product info',
                });
            }
            const deleteInfo = await Product.delete({ _id: id });
            if (deleteInfo) {
                console.log(deleteInfo);
                resolve({
                    status: 'OK',
                    data: 'Delete successful',
                });
            }
            resolve({
                status: 'ERROR',
                data: 'Delete unsuccessful',
            });
        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Delete unsuccessful',
            });
        }
    });
};
