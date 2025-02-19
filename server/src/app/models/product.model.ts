import mongoose from 'mongoose';
import mongooseSlugGenerator from 'mongoose-slug-generator';
const Schema = mongoose.Schema;
import mongooseDelete, { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';

// Định nghĩa tài liệu (Document)
interface IProduct extends SoftDeleteDocument {
    name: string;
    description: string;
    price: number;
    discount: number;
    quantity: number;
    thumb: string;
    category: string;
    slug: string;
}
const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
        },
        thumb: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: 'Product',
        },
        slug: { type: String, slug: 'name' },
    },
    { timestamps: true },
);
mongoose.plugin(mongooseSlugGenerator);
ProductSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});

const Product: SoftDeleteModel<IProduct> = mongoose.model<IProduct, SoftDeleteModel<IProduct>>(
    'product',
    ProductSchema,
);

export default Product;
