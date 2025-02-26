"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const classroomSchema = new mongoose_1.Schema({
    classCode: { type: String, required: true },
    name: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user', required: true },
    students: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'user', default: [] }],
    post: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'post', default: [] }],
    thumb: { type: String },
}, { timestamps: true });
// classroomSchema.pre('init', async function (next) {
//     let classCode = generateUniqueRandomString(6);
//     console.log(classCode);
//     let classCodeExists = await mongoose.models.classroom.exists({ classCode });
//     while (classCodeExists) {
//         classCode = generateUniqueRandomString(6);
//         classCodeExists = await mongoose.models.classroom.exists({ classCode });
//     }
//     this.thumb = imageClassThumbnailDefault[Math.floor(Math.random() * imageClassThumbnailDefault.length)];
//     this.classCode = classCode;
//     next();
// });
const Classroom = mongoose_1.default.model('classroom', classroomSchema);
exports.default = Classroom;
//# sourceMappingURL=classroom.model.js.map