"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    phone: { type: String, required: true, unique: true },
    avatar: { type: String },
    address: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    active: { type: Boolean, default: true },
    quizzes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'quiz', default: [] }],
    myClassrooms: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'classroom', default: [] }],
    enrolledClassrooms: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'classroom', default: [] }],
}, {
    timestamps: true,
});
UserSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    overrideMethods: true,
});
const User = mongoose_1.default.model('user', UserSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map