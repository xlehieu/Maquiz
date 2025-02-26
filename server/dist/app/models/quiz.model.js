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
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const remove_accents_1 = __importDefault(require("remove-accents"));
const Schema = mongoose_1.default.Schema;
const QuizSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    school: { type: String, required: true },
    subject: { type: String, required: true },
    thumb: { type: String, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user', required: true },
    quiz: [
        {
            partName: { type: String, required: true },
            questions: [
                {
                    questionType: { type: Number, required: true },
                    questionContent: { type: String, required: true },
                    answers: [
                        {
                            content: { type: String, required: true },
                            isCorrect: { type: Boolean, required: true },
                            _id: false,
                        },
                    ],
                    _id: false,
                },
            ],
            isDisabled: { type: Boolean, required: true, default: false },
            _id: false,
        },
    ],
    accessCount: { type: Number, required: true, default: 0 },
    examCount: { type: Number, required: true, default: 0 },
    slug: { type: String, required: true, unique: true },
    topic: { type: String },
    schoolYear: { type: Number },
    educationLevel: { type: [String] }, //cách khai báo một mảng các chuỗi
    nameNoAccent: { type: String }, // Tạo thêm một field mới để lưu tên bài trắc nghiệm không dấu
}, { timestamps: true });
QuizSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this === null || this === void 0 ? void 0 : this.isModified('name')) {
            // kiểm tra xem có thay đổi so với trước đó hay không? nếu là lần đầu thêm thì isModified luôn trả về true
            let newSlug = (0, slugify_1.default)(this === null || this === void 0 ? void 0 : this.name, {
                lower: true, // Chuyển slug thành chữ thường
                strict: true, // Loại bỏ ký tự đặc biệt
                locale: 'vi', // Hỗ trợ tiếng Việt
            });
            // Kiểm tra slug đã tồn tại - slugExist này sẽ trả về objectId
            let slugExists = yield mongoose_1.default.models.quiz.exists({ slug: newSlug });
            let counter = 1;
            // Nếu slug đã tồn tại, thêm hậu tố để tạo slug mới
            while (slugExists) {
                newSlug = `${(0, slugify_1.default)(this.name, {
                    lower: true,
                    strict: true,
                    locale: 'vi',
                })}-${counter}`;
                slugExists = yield mongoose_1.default.models.quiz.exists({ slug: newSlug });
                counter++;
            }
            this.slug = newSlug;
        }
        next();
    });
});
QuizSchema.pre('save', function (next) {
    this.nameNoAccent = (0, remove_accents_1.default)(this.name.toLowerCase());
    next();
});
QuizSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    overrideMethods: true,
});
const Quiz = mongoose_1.default.model('quiz', QuizSchema);
exports.default = Quiz;
//# sourceMappingURL=quiz.model.js.map