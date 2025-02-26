"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_generator_1 = __importDefault(require("mongoose-slug-generator"));
const Schema = mongoose_1.default.Schema;
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const ProductSchema = new Schema({
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
}, { timestamps: true });
mongoose_1.default.plugin(mongoose_slug_generator_1.default);
ProductSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    overrideMethods: true,
});
const Product = mongoose_1.default.model('product', ProductSchema);
exports.default = Product;
//# sourceMappingURL=product.model.js.map