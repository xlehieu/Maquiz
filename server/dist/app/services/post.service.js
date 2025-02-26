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
exports.createPost = void 0;
const classroom_model_1 = __importDefault(require("../models/classroom.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const createPost = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { classroomId, content, quizzes, user } = req.body;
            if (!classroomId || !content || !(user === null || user === void 0 ? void 0 : user.id)) {
                return reject({ status: 400, message: 'Thiếu dữ liệu' });
            }
            const findUser = yield user_model_1.default.findById(user.id);
            const classroom = yield classroom_model_1.default.findById(classroomId);
            const post = yield post_model_1.default.create({
                classroomId,
            });
        }
        catch (err) {
            return reject({ message: 'ERROR', error: err });
        }
    }));
};
exports.createPost = createPost;
//# sourceMappingURL=post.service.js.map