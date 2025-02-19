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
exports.updateQuizQuestion = exports.updateQuizGeneralInfo = exports.createQuestion = exports.createQuiz = exports.getQuizDetail = exports.getQuizzes = void 0;
const index_js_1 = require("../../utils/index.js");
const QuizModel_js_1 = __importDefault(require("../models/QuizModel.js"));
const UserModel_js_1 = __importDefault(require("../models/UserModel.js"));
const getQuizzes = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body.user;
            const findUser = yield UserModel_js_1.default.findById(id);
            if (!findUser) {
                reject({
                    message: 'Lỗi xác thực',
                });
            }
            const quizzes = yield QuizModel_js_1.default.find({ user: findUser._id });
            resolve(quizzes);
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.getQuizzes = getQuizzes;
const getQuizDetail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.query;
            if (!id) {
                reject({
                    message: 'Có lỗi trong quá trình tìm',
                });
            }
            const quiz = yield QuizModel_js_1.default.findById(id);
            if (!quiz) {
                reject({
                    message: 'Quiz not found',
                });
            }
            resolve(quiz);
        }));
    }
    catch (err) {
        reject(err);
    }
});
exports.getQuizDetail = getQuizDetail;
const createQuiz = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //trong middleware đã truyền user có chứa id theo rồi
            const { name, description, subject, school, user, thumb } = req.body;
            const userInfo = yield UserModel_js_1.default.findById(user.id);
            if (!userInfo) {
                reject({
                    message: 'User not found',
                });
            }
            if (!thumb.startsWith('http')) {
                var urlThumb = yield (0, index_js_1.uploadAndGetLink)(thumb, `${user.id}/quiz`);
            }
            const quiz = yield QuizModel_js_1.default.create({
                name,
                description,
                subject,
                thumb,
                school,
                user: user.id,
                thumb: urlThumb !== null && urlThumb !== void 0 ? urlThumb : thumb,
                quiz: [],
            });
            if (quiz) {
                userInfo.quizzes.push(quiz);
                yield userInfo.save();
                resolve(quiz);
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.createQuiz = createQuiz;
const createQuestion = (req) => {
    try {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, partName, questionType, questionContent, answers } = req.body;
            if (!id || !partName || !questionType || !questionContent || !answers || answers.length === 0) {
                return res.status(400).json({
                    message: 'Vui lòng kiểm tra lại thông tin câu hỏi',
                });
            }
            const findQuiz = yield QuizModel_js_1.default.findById(req.id);
            if (!findQuiz) {
                reject({
                    message: 'Quiz not found',
                });
                return;
            }
            const checkPart = findQuiz.quiz.some((part) => {
                return part.partName === partName;
            }); // phương thức some return về true or false, xem có bất kỳ cái nào thỏa mãn điều kiện không
            if (checkPart) {
                findQuiz.quiz.forEach((quizChildren) => {
                    if (quizChildren.partName === partName) {
                        const newQuestion = {
                            questionType: questionType,
                            questionContent: questionContent,
                            answers: answers,
                        };
                        quizChildren.questions.push(newQuestion);
                    }
                });
            }
            else {
                const newPart = {
                    partName: partName,
                    questions: [
                        {
                            questionType: questionType,
                            questionContent: questionContent,
                            answers: answers,
                        },
                    ],
                };
                findQuiz.quiz.push(newPart);
            }
            const saveQuiz = yield findQuiz.save();
            resolve(saveQuiz);
            return;
        }));
    }
    catch (err) {
        reject(err);
        return;
    }
};
exports.createQuestion = createQuestion;
const updateQuizGeneralInfo = (req) => {
    try {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const { id, name, description, subject, school, user, thumb } = req.body;
            const findQuiz = yield QuizModel_js_1.default.findById(id);
            if (!findQuiz) {
                return reject({ message: 'Không tìm thấy bài trắc nghiệm tương ứng' });
            }
            if (!thumb.startsWith('http')) {
                var urlThumb = yield (0, index_js_1.uploadAndGetLink)(thumb, `${user.id}/quiz`); //base64, tên folder ảnh (userId/quiz)
            }
            const quizUpdate = yield QuizModel_js_1.default.findByIdAndUpdate(id, {
                name,
                description,
                subject,
                school,
                user: user.id,
                thumb: urlThumb !== null && urlThumb !== void 0 ? urlThumb : thumb,
            }, { new: true });
            if (quizUpdate)
                return resolve(quizUpdate);
            return reject({ message: 'Cập nhật bài trắc nghiệm thất bại' });
        }));
    }
    catch (err) {
        return reject(err);
    }
};
exports.updateQuizGeneralInfo = updateQuizGeneralInfo;
const updateQuizQuestion = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, quiz } = req.body;
            const findQuiz = yield QuizModel_js_1.default.findById(id);
            if (!findQuiz) {
                return reject({ message: 'Không tìm thấy bài trắc nghiệm tương ứng' });
            }
            else {
                findQuiz.quiz = quiz;
                const saveQuiz = yield findQuiz.save();
                if (saveQuiz)
                    return resolve(saveQuiz);
                return reject({ message: 'Cập nhật các câu hỏi trắc nghiệm thất bại' });
            }
        }
        catch (err) {
            reject(err);
        }
    }));
};
exports.updateQuizQuestion = updateQuizQuestion;
