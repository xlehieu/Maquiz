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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuizQuestion = exports.updateQuizGeneralInfo = exports.createQuestion = exports.createQuiz = exports.getQuizDetail = exports.getQuizzes = void 0;
const QuizService = __importStar(require("../services/QuizService.js"));
const getQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield QuizService.getQuizzes(req);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json({
            message: err,
        });
    }
});
exports.getQuizzes = getQuizzes;
const getQuizDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield QuizService.getQuizDetail(req);
        if (response) {
            return res.status(200).json(response);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err });
    }
});
exports.getQuizDetail = getQuizDetail;
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //const contentLength = req.headers['content-length'];
        //console.log('Kích thước dữ liệu trong yêu cầu:', contentLength);
        const response = yield QuizService.createQuiz(req);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.createQuiz = createQuiz;
//Lưu câu hỏi trong tạo mới quiz
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, partName, questionType, questionContent, answers } = req.body;
        if (!id || !partName || !questionType || !questionContent || !answers || answers.length === 0) {
            return res.status(400).json({
                message: 'Vui lòng kiểm tra lại thông tin câu hỏi',
            });
        }
        const response = yield QuizService.createQuestion(req);
        return res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err,
        });
    }
});
exports.createQuestion = createQuestion;
//Lưu thông tin chung trong sửa quiz
const updateQuizGeneralInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield QuizService.updateQuizGeneralInfo(req);
        return res.status(200).json(response);
    }
    catch (err) {
        // console.log(err);
        return res.status(500).json({ message: err });
    }
});
exports.updateQuizGeneralInfo = updateQuizGeneralInfo;
//Lưu câu hỏi trong sửa quiz
const updateQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield QuizService.updateQuizQuestion(req);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
});
exports.updateQuizQuestion = updateQuizQuestion;
