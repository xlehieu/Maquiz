"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductDetail = exports.createProduct = exports.getAllProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const getAllProduct = (limit = 5, page = 0) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            page = Number(page);
            const totalProduct = yield product_model_1.default.countDocuments();
            const allProduct = yield product_model_1.default.find()
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
        }
        catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    }));
};
exports.getAllProduct = getAllProduct;
const createProduct = (newProduct) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield product_model_1.default.create(newProduct);
            if (product) {
                resolve({
                    status: 'OK',
                    data: product,
                });
            }
            reject({
                status: 'ERROR',
            });
        }
        catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    }));
};
exports.createProduct = createProduct;
const getProductDetail = (slug) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield product_model_1.default.findOne({ slug: slug });
            if (product) {
                resolve({
                    status: 'OK',
                    data: product,
                });
            }
            reject({
                status: 'ERROR',
            });
        }
        catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    }));
};
exports.getProductDetail = getProductDetail;
const updateProduct = (id, updateProduct) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield product_model_1.default.findById(id);
            if (!product) {
                resolve({
                    status: 'OK',
                    message: 'Not found product info',
                });
            }
            const newInfoUpdateProduct = yield product_model_1.default.findByIdAndUpdate(id, updateProduct, { new: true });
            resolve({
                status: 'OK',
                data: newInfoUpdateProduct,
            });
        }
        catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi',
            });
        }
    }));
};
exports.updateProduct = updateProduct;
const deleteProduct = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const product = yield product_model_1.default.findById(id);
            if (!product) {
                resolve({
                    status: 'OK',
                    message: 'Not found product info',
                });
            }
            const deleteInfo = yield product_model_1.default.delete({ _id: id });
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
        }
        catch (err) {
            reject({
                status: 'ERROR',
                message: 'Delete unsuccessful',
            });
        }
    }));
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.service.js.map