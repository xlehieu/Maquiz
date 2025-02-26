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
exports.deleteQuiz = exports.getDiscoveryQuizzes = exports.getQuizForExam = exports.getQuizPreview = exports.updateQuizQuestion = exports.updateQuizGeneralInfo = exports.createQuestion = exports.createQuiz = exports.getQuizDetail = exports.getQuizzes = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../utils");
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const getQuizzes = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body.user;
            const findUser = yield user_model_1.default.findById(id);
            if (!findUser) {
                reject({
                    message: 'Lỗi xác thực',
                });
            }
            const quizzes = yield quiz_model_1.default.find({ user: findUser === null || findUser === void 0 ? void 0 : findUser._id });
            resolve({ message: 'Successfully fetched quizzes', data: quizzes });
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.getQuizzes = getQuizzes;
const getQuizDetail = (req) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            if (!id) {
                reject({
                    message: 'Có lỗi trong quá trình tìm',
                });
            }
            const quiz = yield quiz_model_1.default.findById(id);
            if (!quiz) {
                reject({
                    message: 'Quiz not found',
                });
            }
            resolve({ message: 'Successfully fetched quiz', data: quiz });
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
});
exports.getQuizDetail = getQuizDetail;
// tạo bài trác nghiệm -- tạo thông tin chung
const createQuiz = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //trong middleware đã truyền user có chứa id theo rồi
            const { name, description, subject, school, topic, schoolYear, educationLevel, user, thumb } = req.body;
            const userInfo = yield user_model_1.default.findById(user.id);
            if (!userInfo) {
                reject({
                    message: 'User not found',
                });
            }
            if (!thumb.startsWith('http')) {
                var urlThumb = yield (0, utils_1.uploadAndGetLink)(thumb, `${user.id}/quiz`);
            }
            const quiz = new quiz_model_1.default({
                name,
                description,
                subject,
                school,
                topic,
                schoolYear,
                educationLevel,
                user: user.id,
                thumb: urlThumb !== null && urlThumb !== void 0 ? urlThumb : thumb,
                quiz: [],
            });
            const save = yield quiz.save();
            if (save && save._id instanceof mongoose_1.Types.ObjectId) {
                userInfo === null || userInfo === void 0 ? void 0 : userInfo.quizzes.push(new mongoose_1.Types.ObjectId(save._id));
                yield (userInfo === null || userInfo === void 0 ? void 0 : userInfo.save());
                resolve({ message: 'Successfully create quiz information', data: quiz });
            }
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.createQuiz = createQuiz;
// Thêm câu hỏi
const createQuestion = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, partName, questionType, questionContent, answers } = req.body;
            if (!id || !partName || !questionType || !questionContent || !answers || answers.length === 0) {
                reject({
                    message: 'Vui lòng kiểm tra lại thông tin câu hỏi',
                });
            }
            const findQuiz = yield quiz_model_1.default.findById(id);
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
                    isDisabled: false,
                };
                findQuiz.quiz.push(newPart);
            }
            const saveQuiz = yield findQuiz.save();
            return resolve({ message: 'Successfully create question', data: saveQuiz });
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.createQuestion = createQuestion;
//chỉnh sửa thông tin chung
const updateQuizGeneralInfo = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, name, description, subject, school, topic, schoolYear, educationLevel, user, thumb } = req.body;
            const findQuiz = yield quiz_model_1.default.findById(id);
            if (!findQuiz) {
                return reject({ message: 'Không tìm thấy bài trắc nghiệm tương ứng' });
            }
            if (!thumb.startsWith('http')) {
                var urlThumb = yield (0, utils_1.uploadAndGetLink)(thumb, `${user.id}/quiz`); //base64, tên folder ảnh (userId/quiz)
            }
            const quizUpdate = yield quiz_model_1.default.findByIdAndUpdate(id, {
                name,
                description,
                subject,
                school,
                topic,
                schoolYear,
                educationLevel,
                user: user.id,
                thumb: urlThumb !== null && urlThumb !== void 0 ? urlThumb : thumb,
            }, { new: true });
            if (quizUpdate)
                return resolve({ message: 'Successfully updated quiz general information', data: quizUpdate });
            return reject({ message: 'Cập nhật bài trắc nghiệm thất bại' });
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.updateQuizGeneralInfo = updateQuizGeneralInfo;
// Chỉnh sửa câu hỏi
const updateQuizQuestion = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, quiz } = req.body;
            const findQuiz = yield quiz_model_1.default.findById(id);
            if (!findQuiz) {
                return reject({ message: 'Không tìm thấy bài trắc nghiệm tương ứng' });
            }
            else {
                findQuiz.quiz = quiz;
                const saveQuiz = yield findQuiz.save();
                if (saveQuiz)
                    return resolve({ message: 'Successfully updated quiz question', data: saveQuiz });
                return reject({ message: 'Cập nhật các câu hỏi trắc nghiệm thất bại' });
            }
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.updateQuizQuestion = updateQuizQuestion;
// xem trước khi làm bài
const getQuizPreview = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const findQuiz = yield quiz_model_1.default.findOne({ slug: slug });
            if (findQuiz) {
                const findUser = yield user_model_1.default.findById(findQuiz.user);
                const { name, description, subject, school, thumb, quiz, accessCount, examCount, createdAt } = findQuiz;
                findQuiz.accessCount = Number(accessCount + 1);
                yield findQuiz.save();
                return resolve({
                    message: 'Successfully fetched',
                    data: {
                        name,
                        description,
                        subject,
                        school,
                        thumb,
                        quiz,
                        accessCount,
                        examCount,
                        createdAt,
                        slug,
                        user: {
                            name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
                            avatar: findUser === null || findUser === void 0 ? void 0 : findUser.avatar,
                        },
                    },
                });
            }
            return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.getQuizPreview = getQuizPreview;
// xem trước khi làm bài
const getQuizForExam = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { slug } = req.params;
            const findQuiz = yield quiz_model_1.default.findOne({ slug: slug });
            if (findQuiz) {
                const findUser = yield user_model_1.default.findById(findQuiz.user);
                const { name, description, subject, school, thumb, quiz, accessCount, examCount, createdAt } = findQuiz;
                findQuiz.examCount = Number(examCount + 1);
                console.log(findQuiz.examCount);
                yield findQuiz.save();
                return resolve({
                    message: 'Successfully fetched',
                    data: {
                        name,
                        description,
                        subject,
                        school,
                        thumb,
                        quiz,
                        accessCount,
                        examCount,
                        createdAt,
                        slug,
                        user: {
                            name: findUser === null || findUser === void 0 ? void 0 : findUser.name,
                            avatar: findUser === null || findUser === void 0 ? void 0 : findUser.avatar,
                        },
                    },
                });
            }
            return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.getQuizForExam = getQuizForExam;
// tìm bài trắc nghiệm
const getDiscoveryQuizzes = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page, topic, school_year, education_level, name } = req.query;
            let query = {};
            if (topic && typeof topic === 'string') {
                Object.assign(query, {
                    topic: { $in: topic.split(',') },
                });
            }
            if (school_year && typeof school_year === 'string') {
                Object.assign(query, {
                    education_level: { $in: school_year.split(',').map(Number) },
                });
            }
            if (education_level && typeof education_level === 'string') {
                Object.assign(query, {
                    school_year: { $in: education_level.split(',') },
                });
            }
            if (name && typeof name === 'string') {
                Object.assign(query, {
                    $or: [
                        { nameNoAccent: { $regex: new RegExp(name, 'i') } },
                        { name: { $regex: new RegExp(name, 'i') } },
                    ],
                });
            }
            const quizzes = yield quiz_model_1.default.find(query).skip(page ? Number(page) * 10 : 0);
            if (quizzes) {
                resolve({ message: 'Successfully fetched', data: quizzes });
            }
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.getDiscoveryQuizzes = getDiscoveryQuizzes;
// soft delete
const deleteQuiz = (req) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!id)
                return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
            const findQuiz = yield quiz_model_1.default.findById(id);
            if (findQuiz) {
                const deleteInfo = yield quiz_model_1.default.delete({ _id: id });
                if ((deleteInfo === null || deleteInfo === void 0 ? void 0 : deleteInfo.matchedCount) > 0) {
                    return resolve({ message: 'Bài trắc nghiệm đã xóa thành công', data: { id: findQuiz._id } });
                }
                return reject({ message: 'Xóa không thành công' });
            }
            return reject({ message: 'Không tìm thấy bài trắc nghiệm' });
        }
        catch (err) {
            return reject({ message: 'Lỗi', error: err });
        }
    }));
};
exports.deleteQuiz = deleteQuiz;
//# sourceMappingURL=quiz.service.js.map